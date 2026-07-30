import { Link, useParams, useSearchParams } from "react-router-dom";
import { blogPosts, docsGuides, integrations } from "../../data/mockData";
import "./marketing.css";

export function Resources() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Resources</span>
        <h1 className="page-title">Guides, stories, and product updates</h1>
        <div className="grid-3" style={{ marginTop: "1.5rem" }}>
          <Link className="panel" to="/docs">
            <h3>Documentation</h3>
            <p>Implementation guides for data, training, and activation.</p>
          </Link>
          <Link className="panel" to="/blog">
            <h3>Blog</h3>
            <p>Playbooks from teams training marketing AI in production.</p>
          </Link>
          <Link className="panel" to="/changelog">
            <h3>Changelog</h3>
            <p>
              What shipped recently across models, campaigns, and governance.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

export function DocsIndex() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Docs</span>
        <h1 className="page-title">Trainora documentation</h1>
        <div className="grid-2" style={{ marginTop: "1.25rem" }}>
          {docsGuides.map((guide) => (
            <Link className="panel" key={guide.slug} to={`/docs/${guide.slug}`}>
              <h3>{guide.title}</h3>
              <p>{guide.time} read</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export function DocDetail() {
  const { slug } = useParams();
  const guide = docsGuides.find((item) => item.slug === slug) || docsGuides[0];
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link to="/docs">← All docs</Link>
        <h1 className="page-title" style={{ marginTop: "1rem" }}>
          {guide.title}
        </h1>
        <p>
          This guide walks through the Trainora flow for{" "}
          <strong>{guide.slug}</strong>. Use the CTAs below to jump into related
          product routes.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/signup">
            Try in product
          </Link>
          <Link className="btn btn-secondary" to="/app/integrations">
            Open integrations (requires login)
          </Link>
        </div>
      </div>
    </main>
  );
}

export function BlogIndex() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Blog</span>
        <h1 className="page-title">Ideas from the training floor</h1>
        <div className="grid-3" style={{ marginTop: "1.25rem" }}>
          {blogPosts.map((post) => (
            <Link className="panel" key={post.slug} to={`/blog/${post.slug}`}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug) || blogPosts[0];
  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <Link to="/blog">← Blog</Link>
        <h1 className="page-title" style={{ marginTop: "1rem" }}>
          {post.title}
        </h1>
        <p>{post.excerpt}</p>
        <p>
          Teams using Trainora typically start with a demo, then run a trial
          workspace with a single model before expanding to multi-region
          training jobs.
        </p>
        <Link className="btn btn-primary" to="/demo">
          Discuss with an expert
        </Link>
      </div>
    </main>
  );
}

export function Customers() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Customers</span>
        <h1 className="page-title">Built for ambitious revenue teams</h1>
        <div className="grid-3" style={{ marginTop: "1.25rem" }}>
          {[
            [
              "Northwind Analytics",
              "Cut model refresh time from weeks to overnight.",
            ],
            [
              "Brightline Commerce",
              "Lifted paid conversion 14% with creative scoring.",
            ],
            [
              "Helio Cloud",
              "Unified CRM + product signals for churn training.",
            ],
          ].map(([name, result]) => (
            <div className="panel" key={name}>
              <h3>{name}</h3>
              <p>{result}</p>
              <Link to="/demo">Request a similar walkthrough →</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function Company() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Company</span>
        <h1 className="page-title">We build marketing tech for AI training</h1>
        <p>
          Trainora helps B2B teams operationalize model training without bolting
          together notebooks, spreadsheets, and brittle activation scripts.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/careers">
            Careers
          </Link>
          <Link className="btn btn-secondary" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}

export function Careers() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Careers</h1>
        <div className="grid-2" style={{ marginTop: "1rem" }}>
          {[
            "Forward Deployed ML Engineer",
            "Product Designer",
            "Enterprise AE",
          ].map((role) => (
            <div className="panel" key={role}>
              <h3>{role}</h3>
              <p>Remote-friendly · Full-time</p>
              <Link
                className="btn btn-secondary"
                to={`/careers/apply?role=${encodeURIComponent(role)}`}
              >
                Apply
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export function CareerApply() {
  const [params] = useSearchParams();
  return (
    <main className="section">
      <div className="container auth-card">
        <div className="panel">
          <h1 className="page-title">
            Apply: {params.get("role") || "Open role"}
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              pendo.track("career_application_submitted", {
                role: params.get("role") || "Open role",
              });
              window.location.href = "/careers/thanks";
            }}
          >
            <div className="field">
              <label>Name</label>
              <input required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" required />
            </div>
            <div className="field">
              <label>Portfolio / LinkedIn</label>
              <input />
            </div>
            <button className="btn btn-primary" type="submit">
              Submit application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export function CareerThanks() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Application received</h1>
        <p>Thanks — our talent team will follow up shortly.</p>
        <Link className="btn btn-primary" to="/">
          Back home
        </Link>
      </div>
    </main>
  );
}

export function Contact() {
  const [params] = useSearchParams();
  return (
    <main className="section">
      <div className="container auth-card">
        <div className="panel">
          <h1 className="page-title">Contact Trainora</h1>
          <p>Topic: {params.get("topic") || "general"}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              pendo.track("contact_form_submitted", {
                topic: params.get("topic") || "general",
              });
              window.location.href = "/contact/thanks";
            }}
          >
            <div className="field">
              <label>Work email</label>
              <input type="email" required />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea rows={4} required />
            </div>
            <button className="btn btn-primary" type="submit">
              Send message
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export function ContactThanks() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Message sent</h1>
        <p>We typically reply within one business day.</p>
        <Link className="btn btn-secondary" to="/resources">
          Browse resources
        </Link>
      </div>
    </main>
  );
}

export function IntegrationsMarketing() {
  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Integrations</span>
        <h1 className="page-title">Connect the stack you already run</h1>
        <div className="grid-3" style={{ marginTop: "1.25rem" }}>
          {integrations.map((item) => (
            <Link
              className="panel"
              key={item.id}
              to={`/integrations/${item.id}`}
            >
              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <span className="badge">{item.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export function IntegrationDetail() {
  const { id } = useParams();
  const item = integrations.find((entry) => entry.id === id) || integrations[0];
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">{item.name}</h1>
        <p>
          Connect {item.name} to stream events into Trainora training jobs and
          campaign activation.
        </p>
        <div className="hero-cta">
          <Link
            className="btn btn-primary"
            to={`/app/integrations/${item.id}/connect`}
          >
            Connect in app
          </Link>
          <Link className="btn btn-secondary" to="/docs/quickstart">
            Read setup guide
          </Link>
        </div>
      </div>
    </main>
  );
}

export function Security() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Security & compliance</h1>
        <div className="grid-3" style={{ marginTop: "1rem" }}>
          {["SOC 2 Type II", "SSO / SCIM", "Regional data residency"].map(
            (item) => (
              <div className="panel" key={item}>
                <h3>{item}</h3>
                <p>Available on Growth and Enterprise plans.</p>
              </div>
            ),
          )}
        </div>
        <Link
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          to="/demo?topic=security"
        >
          Request security review
        </Link>
      </div>
    </main>
  );
}

export function Changelog() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Changelog</h1>
        <div className="panel">
          <h3>July 2026</h3>
          <p>
            Multi-region training queues, creative scoring v2, and billing
            self-serve upgrades.
          </p>
        </div>
      </div>
    </main>
  );
}

export function StatusPage() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">System status</h1>
        <div className="panel">
          <p>
            <span className="badge">Operational</span> All training clusters and
            activation APIs are healthy.
          </p>
          <Link to="/">Return home</Link>
        </div>
      </div>
    </main>
  );
}

export function NotFound() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Page not found</h1>
        <p>That route does not exist. Try one of these common entry points:</p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/">
            Home
          </Link>
          <Link className="btn btn-secondary" to="/app">
            App
          </Link>
          <Link className="btn btn-ghost" to="/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
