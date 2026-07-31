# Musterring Live Demo Script

Target duration: 12–15 minutes. Start at `/presentation` after clicking **Reset demo data**.

## Optional connected-assistance sequence — 3:00

- Product alternatives: on `/presentation`, click **Product alternatives**, then **Find alternatives**. Show exact versus closest results and unmet requirements.
- Material advice: click **Material & care**, then **Advise me**. Show grounded attributes, a care plan and save/sample actions.
- Voice: click **Voice Interior Assistant**. If microphone permission is unsuitable for the room, use **Try the voice demo as text**.
- Product Advisor: click **Musterring Product Advisor**, submit the prepared compact-family-sofa question, then ask “Which one has the highest seat?” and “Save the second one.” Show the confirmation boundary.
- Message: one context-aware assistance layer proposes actions; catalogue, material, configuration and project services validate and execute them.

## 1. Meeting objective — 0:45

- Route: `/presentation`
- Click: **Reset demo data**
- Expected: confirmation that the project, configuration, room, fit report and retailer were restored.
- Fallback: refresh `/presentation` and reset again.
- Message: the objective is not another generic webshop; it is a guided Online Product World that prepares a qualified retailer conversation.

## 2. Website vision — 0:50

- Route: `/presentation`
- Click: none; use the hero journey line.
- Expected: “From an inspiring catalogue to an intelligent, configurable and dealer-ready product experience.”
- Fallback: use the architecture section lower on the same page.
- Message: product data connects inspiration, decision support and the physical retail network.

## 3. Intelligent Search — 2:15

- Route: click **Launch Intelligent Search**.
- Exact query: `I need a compact beige modular sofa for a small apartment, maximum width 240 cm, with relax function.`
- Expected: customer request, structured intent, editable chips, catalogue-grounded exact matches and separately labelled close alternatives. Product cards offer Save, Compare, Configure for supported seating, Room Composer and retailer actions.
- Click: open one product, then return to results.
- Negative control: from `/presentation`, click **Run negative-control search** for `I need a red sofa under 220 cm.`
- Expected: only qualifying red products appear as exact; otherwise the interface states no exact match and labels alternatives separately.
- Fallback: use the negative control first; both paths use the deterministic grounded provider if external AI fails.
- Message: AI can interpret language, but Product IDs and match facts remain catalogue-grounded.

## 4. Configuration Assistant — 2:20

- Route: `/presentation`, click **Launch Configuration Assistant**.
- Exact request: `Build a four-seat sofa under 290 cm in an easy-care beige fabric with relax function.`
- Expected: interpreted requirements and a proposal for MR 2875. The page states: “AI interprets the customer request. The configuration engine validates the product rules.”
- Click: **Build valid proposal**, review modules, material, function, live dimensions, indicative price and Configuration ID; then save.
- Invalid check: select an incompatible option or exceed the rule boundary.
- Expected: save/continue is blocked, reasons are shown and an alternative is offered.
- Fallback: edit options manually; deterministic validation does not depend on OpenAI.
- Message: language assistance is probabilistic; validity, dimensions and concept pricing are deterministic.

## 5. Room Visualization — 1:35

- Route: `/presentation`, click **Launch Room & Retailer Journey**.
- Expected: the curated Living Room Presentation Concept opens with sofa, complementary table and storage/armchair context. Product IDs, Configuration ID, colour, material and dimensions remain attached.
- Click: save the scene, then **My Musterring**.
- Fallback: return to `/presentation`, reset, and launch Demo C again.
- Message: the current Room Composer is an inspirational, shoppable planning tool. It is not a claim of production generated-image editing or exact fit.

## 6. My Musterring — 1:05

- Route: `/my-musterring`
- Expected: **Living Room Project**, status **Ready for Consultation**, saved products, one configuration, room scene, material, fit report and preferred retailer.
- Click: open project details and reopen the configuration.
- Fallback: reset presentation data and revisit the route.
- Message: My Musterring is the persistent bridge between digital exploration and a retailer consultation.

## 7. Dealer Handover — 1:40

- Route: `/handover`
- Click: select a retailer and choose **Request a Quote** or **Book a Consultation**; enter demo contact fields, consent, then **Review retailer request**.
- Expected: review includes retailer, requested action, Product IDs, Configuration ID, materials, room scene, fit context and appointment preference.
- Click: **Submit demo request**.
- Expected: local demo reference, selected retailer, request, resources, appointment information, next step, My Musterring and print summary actions.
- Fallback: if the summary endpoint fails, return to `/presentation`, reset and use the saved project review without submitting.
- Message: the commercial conversion is a better-prepared retailer conversation, not checkout. Live CRM and booking delivery remain integrations.

## 8. Architecture — 0:55

- Route: `/presentation#architecture` or scroll to **Architecture**.
- Expected: PIM/CMS/DAM → Validated Product API → decision experiences → My Musterring → CRM/dealer/booking → analytics.
- Fallback: use `MUSTERRING_PRESENTATION_READINESS.md`.
- Message: AI handles language, visual tagging, recommendations and summaries; deterministic services own facts, rules, dimensions, fit logic, price logic and routing.

## 9. Roadmap — 0:55

- Route: continue on `/presentation`.
- Expected: Foundation, MVP, Decision Support and Advanced Visualization stages.
- Fallback: use the pilot document.
- Message: prioritize governed data and one credible category before advanced visualization.

## 10. Proposed pilot and decision — 0:55

- Route: remain on `/presentation`.
- Click: none.
- Expected: a clear next step toward a Sofas & Armchairs pilot.
- Fallback: open `MUSTERRING_PILOT_PROPOSAL.md`.
- Message: request agreement on pilot scope, data owners, one configurable family, selected retailers and CRM/booking contacts—not a production launch claim.
