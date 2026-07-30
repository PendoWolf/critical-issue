import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const steps = [
  { path: "company", label: "Company" },
  { path: "use-case", label: "Use case" },
  { path: "channels", label: "Channels" },
  { path: "dataset", label: "Dataset" },
  { path: "review", label: "Review" },
];

function Stepper({ current }) {
  const idx = steps.findIndex((step) => step.path === current);
  return (
    <div className="steps">
      {steps.map((step, i) => (
        <Link
          key={step.path}
          to={`/onboarding/${step.path}`}
          className={`step-pill ${i === idx ? "active" : ""} ${i < idx ? "done" : ""}`}
        >
          {i + 1}. {step.label}
        </Link>
      ))}
    </div>
  );
}

export function OnboardingLayout() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/signup" replace />;
  if (user?.onboarded) return <Navigate to="/app" replace />;

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <span className="eyebrow">Onboarding</span>
        <h1 className="page-title">Set up your training workspace</h1>
        <Outlet />
      </div>
    </main>
  );
}

export function OnboardingCompany() {
  const { onboardingDraft, setOnboardingDraft, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="panel">
      <Stepper current="company" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/onboarding/use-case");
        }}
      >
        <div className="field">
          <label>Company name</label>
          <input
            required
            defaultValue={onboardingDraft.company || user?.company || ""}
            onChange={(e) =>
              setOnboardingDraft({
                ...onboardingDraft,
                company: e.target.value,
              })
            }
          />
        </div>
        <div className="field">
          <label>Your role</label>
          <select
            defaultValue={onboardingDraft.role || "Growth Lead"}
            onChange={(e) =>
              setOnboardingDraft({ ...onboardingDraft, role: e.target.value })
            }
          >
            <option>Growth Lead</option>
            <option>Marketing Ops</option>
            <option>Data Science</option>
            <option>Revenue Ops</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}

export function OnboardingUseCase() {
  const { onboardingDraft, setOnboardingDraft } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="panel">
      <Stepper current="use-case" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/onboarding/channels");
        }}
      >
        <div className="field">
          <label>Primary use case</label>
          <select
            value={onboardingDraft.useCase || "propensity"}
            onChange={(e) =>
              setOnboardingDraft({
                ...onboardingDraft,
                useCase: e.target.value,
              })
            }
          >
            <option value="propensity">Propensity training</option>
            <option value="creative">Creative scoring</option>
            <option value="audience">Audience expansion</option>
            <option value="lifecycle">Lifecycle orchestration</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link className="btn btn-secondary" to="/onboarding/company">
            Back
          </Link>
          <button className="btn btn-primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export function OnboardingChannels() {
  const { onboardingDraft, setOnboardingDraft } = useAuth();
  const navigate = useNavigate();
  const options = [
    "Email",
    "Paid social",
    "Search",
    "Lifecycle",
    "Sales outreach",
  ];

  const toggle = (channel) => {
    const current = onboardingDraft.channels || [];
    setOnboardingDraft({
      ...onboardingDraft,
      channels: current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    });
  };

  return (
    <div className="panel">
      <Stepper current="channels" />
      <p>Select channels that will receive model scores.</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {options.map((channel) => {
          const active = (onboardingDraft.channels || []).includes(channel);
          return (
            <button
              key={channel}
              type="button"
              className={`step-pill ${active ? "active" : ""}`}
              onClick={() => toggle(channel)}
            >
              {channel}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Link className="btn btn-secondary" to="/onboarding/use-case">
          Back
        </Link>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/onboarding/dataset")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export function OnboardingDataset() {
  const { onboardingDraft, setOnboardingDraft } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="panel">
      <Stepper current="dataset" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/onboarding/review");
        }}
      >
        <div className="field">
          <label>Initial dataset source</label>
          <select
            value={onboardingDraft.dataset || "crm"}
            onChange={(e) =>
              setOnboardingDraft({
                ...onboardingDraft,
                dataset: e.target.value,
              })
            }
          >
            <option value="crm">CRM export</option>
            <option value="warehouse">Cloud warehouse</option>
            <option value="product">Product events</option>
            <option value="sample">Use Trainora sample data</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link className="btn btn-secondary" to="/onboarding/channels">
            Back
          </Link>
          <button className="btn btn-primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export function OnboardingReview() {
  const { onboardingDraft, completeOnboarding, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="panel">
      <Stepper current="review" />
      <h3>Workspace summary</h3>
      <ul className="feature-list">
        <li>Company: {onboardingDraft.company || user?.company}</li>
        <li>Role: {onboardingDraft.role || user?.role}</li>
        <li>Use case: {onboardingDraft.useCase || "propensity"}</li>
        <li>
          Channels:{" "}
          {(onboardingDraft.channels || []).join(", ") || "Not selected"}
        </li>
        <li>Dataset: {onboardingDraft.dataset || "crm"}</li>
      </ul>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Link className="btn btn-secondary" to="/onboarding/dataset">
          Back
        </Link>
        <button
          className="btn btn-primary"
          onClick={() => {
            completeOnboarding();
            pendo.track("onboarding_completed", {
              company: onboardingDraft.company || user?.company,
              role: onboardingDraft.role || user?.role,
              useCase: onboardingDraft.useCase || "propensity",
              channels: (onboardingDraft.channels || []).join(", "),
              channelCount: (onboardingDraft.channels || []).length,
              dataset: onboardingDraft.dataset || "crm",
              launchAction: "launch_workspace",
            });
            navigate("/app");
          }}
        >
          Launch workspace
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            completeOnboarding();
            pendo.track("onboarding_completed", {
              company: onboardingDraft.company || user?.company,
              role: onboardingDraft.role || user?.role,
              useCase: onboardingDraft.useCase || "propensity",
              channels: (onboardingDraft.channels || []).join(", "),
              channelCount: (onboardingDraft.channels || []).length,
              dataset: onboardingDraft.dataset || "crm",
              launchAction: "launch_and_create_job",
            });
            navigate("/app/training/new");
          }}
        >
          Launch & create first training job
        </button>
      </div>
    </div>
  );
}
