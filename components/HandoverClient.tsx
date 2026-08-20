"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Check, Clock, MapPin, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { dealers, products } from "@/lib/data";
import { storage } from "@/lib/persistence";
import type { SavedRoomScene } from "@/lib/types";

export function HandoverClient({ initialRequest = "Book a Consultation", productId, materialId, sceneId }: { initialRequest?: string; productId?: string; materialId?: string; sceneId?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [requestType, setRequestType] = useState(initialRequest);
  const [appointmentMode, setAppointmentMode] = useState("Showroom consultation");
  const [preferredTime, setPreferredTime] = useState("Weekday morning");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [consent, setConsent] = useState(false);
  const [dealerId, setDealerId] = useState(dealers[0].id);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [consultationSummary, setConsultationSummary] = useState("");
  const [summaryPending, setSummaryPending] = useState(false);
  const [reviewReady, setReviewReady] = useState(false);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [savedConfigurations, setSavedConfigurations] = useState<ReturnType<typeof storage.configurations>>([]);
  const [savedRoomScenes, setSavedRoomScenes] = useState<SavedRoomScene[]>([]);
  const [savedFitReports, setSavedFitReports] = useState<Record<string, unknown>[]>([]);
  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>([]);
  useEffect(() => {
    setDealerId(storage.selectedDealer() ?? dealers[0].id);
    setSavedProductIds(storage.savedProducts());
    setSavedConfigurations(storage.configurations());
    setSavedRoomScenes(storage.roomScenes());
    setSavedFitReports(storage.fitReports());
    setSavedMaterialIds(storage.savedMaterials());
  }, []);
  const selectedDealer = dealers.find((dealer) => dealer.id === dealerId) ?? dealers[0];
  const saved = products.filter((product) => savedProductIds.includes(product.id));
  const latestConfiguration = savedConfigurations.at(-1);
  const selectedRoomScene = (sceneId ? savedRoomScenes.find((scene) => scene.id === sceneId) : undefined) ?? savedRoomScenes.at(-1);
  const latestRoomScene = selectedRoomScene;
  const structuredProject = () => {
    const fitReports = storage.fitReports();
    return {
      customerIntent: message || "Customer requests a Musterring retailer consultation.",
      productIds: [...new Set([...(productId ? [productId] : []), ...storage.savedProducts(), ...(selectedRoomScene?.items.map((item) => item.productId) ?? [])])],
      configurationIds: storage.configurations().map((item) => item.id),
      materialIds: [...new Set([...(materialId ? [materialId] : []), ...storage.savedMaterials()])],
      roomPlan: selectedRoomScene ?? null,
      fitWarnings: fitReports.flatMap((report) => Array.isArray(report.reasons) ? report.reasons.map(String) : []),
      requestedRetailerAction: requestType
    };
  };
  const generateSummary = async () => {
    setSummaryPending(true);
    const response = await fetch("/api/ai/retailer-summary", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(structuredProject())
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    setSummaryPending(false);
    if (!response?.ok || !payload?.summary) return null;
    setConsultationSummary(payload.summary);
    storage.track({ name: "ai_retailer_summary_created", dealerId });
    return payload;
  };
  const submit = async () => {
    if (!consent || !name || !email) return;
    setSubmitState("loading");
    storage.track({ name: "lead_started", dealerId });
    setSubmitError("");
    const summaryPayload = consultationSummary ? { summary: consultationSummary, projectData: structuredProject() } : await generateSummary();
    if (!summaryPayload) {
      setSubmitState("error");
      setSubmitError("The project summary could not be created.");
      return;
    }
    const response = await fetch("/api/demo/handover", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: `${name} ${lastName}`.trim(), email, phone, message, requestType, dealerId, consent: true, aiSummary: summaryPayload.summary, projectData: summaryPayload.projectData })
    }).catch(() => null);
    const payload = response ? await response.json().catch(() => null) : null;
    if (!response?.ok || !payload?.reference) {
      setSubmitState("error");
      setSubmitError(payload?.error ?? "The request could not be validated. Please try again.");
      return;
    }
    const reference = String(payload.reference);
    storage.setDealer(dealerId);
    const consentRecord = storage.recordConsent("retailer-handover", true);
    storage.saveLead({
      reference,
      name: `${name} ${lastName}`.trim(),
      email,
      phone,
      message,
      requestType,
      dealerId,
      productId,
      materialId,
      consentRecordId: consentRecord.id,
      appointment: `${appointmentMode} · ${appointmentDate || "Date to confirm"} · ${preferredTime}`,
      project: {
        productIds: storage.savedProducts(),
        configurationIds: storage.configurations().map((item) => item.id),
        comparisonProductIds: storage.comparisons(),
        materialIds: storage.savedMaterials(),
        roomScenes: selectedRoomScene ? [selectedRoomScene] : storage.roomScenes(),
        fitReports: storage.fitReports(),
        consultationSummary: summaryPayload.summary,
        structuredProjectData: summaryPayload.projectData
      },
      createdAt: new Date().toISOString()
    });
    storage.track({ name: "lead_submitted", dealerId });
    storage.track({ name: "appointment_booked", dealerId });
    router.push("/booking/confirmation");
  };
  return (
    <div className="stitch-handover">
      <header className="container stitch-handover-head">
        <div><p className="eyebrow">Project handover</p><h1>Living Room Project<br /><em>Configuration Summary</em></h1></div>
        <p>Your interior selection is ready for personal advice. Choose a retailer, add your contact preferences and review everything before sending.</p>
      </header>
      <ol className="container handover-progress" aria-label="Project handover progress">
        <li className="is-complete"><span>1</span><strong>Project</strong><small>Selection ready</small></li>
        <li className="is-current"><span>2</span><strong>Retailer</strong><small>Choose a partner</small></li>
        <li><span>3</span><strong>Details</strong><small>Add preferences</small></li>
        <li className={reviewReady ? "is-current" : ""}><span>4</span><strong>Review</strong><small>Confirm before sending</small></li>
      </ol>
      <section className="container stitch-handover-select">
        <aside><h2>Saved Project Context</h2><p className="eyebrow">Configuration ID</p><strong>{latestConfiguration?.id ?? "No saved configuration"}</strong><p className="eyebrow">Room Scene</p><dl><div><dt>Concept</dt><dd>{latestRoomScene?.name ?? "Not saved"}</dd></div><div><dt>Entered size</dt><dd>{latestRoomScene?.roomSize?.widthMm && latestRoomScene.roomSize.lengthMm ? `${latestRoomScene.roomSize.widthMm / 10} × ${latestRoomScene.roomSize.lengthMm / 10} cm` : "Not entered"}</dd></div></dl><p className="eyebrow">Project resources</p><dl><div><dt>Products</dt><dd>{saved.length}</dd></div><div><dt>Fit reports</dt><dd>{savedFitReports.length}</dd></div></dl><button onClick={() => window.print()}>Download project summary</button></aside>
        <div className="stitch-dealer-choice">
          <div className="stitch-dealer-filters"><b>Consultation services:</b><span>3D Planning</span><span>Showroom Request</span><span>Technical Fit</span></div>
          {dealers.slice(0, 3).map((dealer) => <article className={dealerId === dealer.id ? "is-selected" : ""} key={dealer.id}><h2>{dealer.name}</h2><p>{dealer.address}, {dealer.postcode} {dealer.city}</p><small><Clock size={14} /> {dealer.openingHours} · {dealer.distanceKm} km away</small><button onClick={() => setDealerId(dealer.id)}>{dealerId === dealer.id ? <><Check size={15} /> Selected</> : "Select & continue"}</button></article>)}
        </div>
        <div className="stitch-dealer-map"><button>+</button><button>−</button><MapPin /><span>Viewing area: {selectedDealer.city}</span></div>
      </section>
      <section className="stitch-consultation">
        <div className="container">
          <aside className="consultation-copy">
            <p className="eyebrow">Personal planning service</p>
            <h2>Book Your Interior Consultation</h2>
            <p>Your saved project is prepared for a focused conversation with your selected retailer. A specialist will contact you to confirm the details and technical feasibility.</p>
            <div className="consultation-retailer-card">
              <MapPin aria-hidden="true" />
              <span>
                <small>Selected retailer</small>
                <strong>{selectedDealer.name}</strong>
                <em>{selectedDealer.city} · {selectedDealer.distanceKm} km away</em>
              </span>
            </div>
            <ul className="consultation-trust-list">
              <li><Check aria-hidden="true" /> Saved products and project context included</li>
              <li><ShieldCheck aria-hidden="true" /> Review everything before submission</li>
              <li><Clock aria-hidden="true" /> Final timing is confirmed by the retailer</li>
            </ul>
          </aside>
          <form onSubmit={(event) => {
            event.preventDefault();
            if (!reviewReady) {
              setReviewReady(true);
              return;
            }
            void submit();
          }}>
            <div className="is-wide consultation-form-heading">
              <span>Retailer request</span>
              <strong>Complete the details, then review before sending</strong>
            </div>
            <fieldset className="is-wide consultation-fieldset">
              <legend><span>01</span> Consultation preferences</legend>
              <div className="consultation-field-grid">
                <label>Request type<select value={requestType} onChange={(event) => setRequestType(event.target.value)}><option>Book a Consultation</option><option>Request a Quote</option><option>Check Showroom Availability</option><option>Request a Material Sample</option><option>Request Material Consultation</option><option>Request Technical Fit Check</option><option>Delivery Planning</option></select></label>
                <label>Appointment mode<select value={appointmentMode} onChange={(event) => setAppointmentMode(event.target.value)}><option>Showroom consultation</option><option>Video consultation</option><option>Phone consultation</option><option>Home planning visit</option></select></label>
                <label>Preferred date<input type="date" value={appointmentDate} onChange={(event) => setAppointmentDate(event.target.value)} /></label>
                <label>Preferred time<select value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)}><option>Weekday morning</option><option>Weekday afternoon</option><option>Weekday evening</option><option>Saturday</option></select></label>
              </div>
            </fieldset>
            <fieldset className="is-wide consultation-fieldset">
              <legend><span>02</span> Your contact details</legend>
              <div className="consultation-field-grid">
                <label>First name<input required autoComplete="given-name" placeholder="Your first name" value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label>Last name<input autoComplete="family-name" placeholder="Your last name" value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
                <label>Email address<input required type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                <label>Phone number<input type="tel" autoComplete="tel" placeholder="+49" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
              </div>
            </fieldset>
            <fieldset className="is-wide consultation-fieldset consultation-project-fieldset">
              <legend><span>03</span> Project notes</legend>
              <label>Message to retailer <small>Optional</small><textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={`Add priorities, questions or access details. Saved products: ${saved.map((product) => product.modelCode).join(", ") || "Living Room Project"}`} /></label>
              <div className="card card-body retailer-summary-preview">
              <p className="eyebrow">Consultation summary</p>
              {consultationSummary ? <><p>{consultationSummary}</p><small>Saved project details will be included with the request.</small></> : <p>Create a concise summary from saved products, configurations, materials, room plan and fit notes before submission.</p>}
              <button type="button" onClick={() => void generateSummary()} disabled={summaryPending}>{summaryPending ? "Creating summary…" : consultationSummary ? "Refresh summary" : "Create consultation summary"}</button>
              </div>
            </fieldset>
            {reviewReady ? <section className="is-wide handover-review" aria-label="Complete retailer request review">
              <p className="eyebrow">Review before submission</p>
              <h2>Complete project handover</h2>
              <dl>
                <div><dt>Retailer</dt><dd>{selectedDealer.name}</dd></div>
                <div><dt>Requested action</dt><dd>{requestType}</dd></div>
                <div><dt>Product IDs</dt><dd>{saved.map((product) => product.id).join(", ") || "None saved"}</dd></div>
                <div><dt>Configuration IDs</dt><dd>{savedConfigurations.map((configuration) => configuration.id).join(", ") || "None saved"}</dd></div>
                <div><dt>Selected materials</dt><dd>{savedMaterialIds.join(", ") || "None saved"}</dd></div>
                <div><dt>Room scene</dt><dd>{latestRoomScene?.name ?? "None saved"}</dd></div>
                <div><dt>Fit information</dt><dd>{savedFitReports.length ? `${savedFitReports.length} saved report(s)` : "No fit report saved"}</dd></div>
                <div><dt>Appointment preference</dt><dd>{appointmentMode} · {appointmentDate || "Date to confirm"} · {preferredTime}</dd></div>
              </dl>
              <p>Final prices, availability, physical fit and appointment times are confirmed by the selected retailer. In demo mode, this request is stored locally and is not delivered to a live CRM.</p>
              <button type="button" onClick={() => setReviewReady(false)}>Edit request</button>
            </section> : null}
            <label className="stitch-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I agree that my project data will be transmitted to <strong>{selectedDealer.name}</strong> for this consultation.</span></label>
            {submitError ? <p className="is-wide form-error" role="alert">{submitError}</p> : null}
            <button className="is-wide" type="submit" disabled={submitState === "loading"}>{submitState === "loading" ? "Validating request…" : reviewReady ? "Confirm request" : "Review retailer request"} <ArrowRight /></button>
          </form>
        </div>
      </section>
    </div>
  );
}
