import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../marketing/marketing.css";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("alex@northwind.io");

  return (
    <main className="auth-shell">
      <div className="panel auth-card">
        <h1 className="page-title">Welcome back</h1>
        <p>Log in to continue training jobs, campaigns, and analytics.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(email);
            window.pendo?.track("user_logged_in", {
              login_method: "password",
              redirect_target: params.get("next") || "/app",
              email_domain: email.split("@")[1] || "",
            });
            navigate(params.get("next") || "/app");
          }}
        >
          <div className="field">
            <label>Work email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" defaultValue="password" required />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: "100%" }}
          >
            Log in
          </button>
        </form>
        <div className="split-auth" style={{ marginTop: "1rem" }}>
          <Link className="btn btn-secondary" to="/login/sso">
            Continue with SSO
          </Link>
          <Link className="btn btn-ghost" to="/forgot-password">
            Forgot password
          </Link>
        </div>
        <p style={{ marginTop: "1rem" }}>
          New here? <Link to="/signup">Start a trial</Link>
        </p>
      </div>
    </main>
  );
}

export function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    plan: params.get("plan") || "growth",
  });

  return (
    <main className="auth-shell">
      <div className="panel auth-card">
        <h1 className="page-title">Start your Trainora trial</h1>
        <p>
          Intent: {params.get("intent") || "general"} · Plan: {form.plan}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            signup({ ...form, onboarded: false });
            window.pendo?.track("user_signed_up", {
              plan: form.plan,
              intent: params.get("intent") || "general",
              company: form.company,
              email_domain: form.email.split("@")[1] || "",
            });
            navigate("/onboarding/company");
          }}
        >
          <div className="field">
            <label>Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Work email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Company</label>
            <input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: "100%" }}
          >
            Create account
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          Prefer a guided tour? <Link to="/demo">Book a demo</Link>
        </p>
      </div>
    </main>
  );
}

export function SSOLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [domain, setDomain] = useState("northwind.io");

  return (
    <main className="auth-shell">
      <div className="panel auth-card">
        <h1 className="page-title">SSO login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(`sso@${domain}`);
            window.pendo?.track("sso_login_completed", {
              company_domain: domain,
            });
            navigate("/app");
          }}
        >
          <div className="field">
            <label>Company domain</label>
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Continue to identity provider
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          <Link to="/login">Back to password login</Link>
        </p>
      </div>
    </main>
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();
  return (
    <main className="auth-shell">
      <div className="panel auth-card">
        <h1 className="page-title">Reset password</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const emailValue = e.target.querySelector(
              "input[type='email']",
            ).value;
            window.pendo?.track("password_reset_requested", {
              email_domain: emailValue.split("@")[1] || "",
            });
            navigate("/forgot-password/sent");
          }}
        >
          <div className="field">
            <label>Work email</label>
            <input type="email" required />
          </div>
          <button className="btn btn-primary" type="submit">
            Send reset link
          </button>
        </form>
      </div>
    </main>
  );
}

export function ForgotPasswordSent() {
  return (
    <main className="auth-shell">
      <div className="panel auth-card">
        <h1 className="page-title">Check your inbox</h1>
        <p>We sent a reset link. For this demo, continue to the reset form.</p>
        <Link className="btn btn-primary" to="/reset-password">
          Open reset form
        </Link>
      </div>
    </main>
  );
}

export function ResetPassword() {
  const navigate = useNavigate();
  return (
    <main className="auth-shell">
      <div className="panel auth-card">
        <h1 className="page-title">Choose a new password</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.pendo?.track("password_reset_completed");
            navigate("/login");
          }}
        >
          <div className="field">
            <label>New password</label>
            <input type="password" required />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input type="password" required />
          </div>
          <button className="btn btn-primary" type="submit">
            Update password
          </button>
        </form>
      </div>
    </main>
  );
}
