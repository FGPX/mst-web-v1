import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Check, LockKeyhole, ShieldCheck } from "lucide-react";
import { partnerAuthConfigured, readPartnerSession } from "@/lib/partner-auth";

const errors: Record<string, string> = {
  credentials: "The email or password is incorrect.",
  configuration: "Partner access is not configured on this environment."
};

export default async function PartnerLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await readPartnerSession()) redirect("/partner");
  const { error } = await searchParams;
  const configured = partnerAuthConfigured();

  return (
    <div className="partner-login">
      <section className="partner-login-story">
        <Link href="/"><ArrowLeft size={17} /> Back to public website</Link>
        <div>
          <span className="partner-login-mark" aria-hidden="true">M</span>
          <p>Musterring Partner Workspace</p>
          <h1>Everything for a better customer consultation.</h1>
          <ul>
            <li><Check /> Create and continue customer projects</li>
            <li><Check /> Configure products with validated rules</li>
            <li><Check /> Prepare quotes and retailer-ready orders</li>
            <li><Check /> Access product and marketing resources</li>
          </ul>
        </div>
        <small>Protected workspace · authorized partners only</small>
      </section>
      <section className="partner-login-form">
        <div>
          <span className="partner-login-security"><ShieldCheck /> Secure partner access</span>
          <h2>Welcome back</h2>
          <p>Sign in to continue working with customers, products and projects.</p>
          {!configured ? <div className="partner-login-notice" role="status"><strong>Local setup required</strong><span>Add the partner environment variables before starting the application.</span></div> : null}
          {error && errors[error] ? <p className="form-error" role="alert">{errors[error]}</p> : null}
          <form action="/api/partner/login" method="post">
            <label>Email address<input type="email" name="email" autoComplete="username" required placeholder="partner@example.com" /></label>
            <label>Password<input type="password" name="password" autoComplete="current-password" required placeholder="Enter your password" /></label>
            <button type="submit" disabled={!configured}><LockKeyhole size={18} /> Sign in to Partner Workspace</button>
          </form>
          <p className="partner-login-help">Need access or a password reset? Contact your Musterring account administrator.</p>
        </div>
      </section>
    </div>
  );
}
