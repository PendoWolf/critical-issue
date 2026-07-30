import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { models } from "../../data/mockData";

export function ModelsIndex() {
  return (
    <div>
      <PageHeader
        title="AI Models"
        subtitle="Governed models ready for campaign scoring."
        actions={
          <Link className="btn btn-primary" to="/app/training/new">
            Train new model
          </Link>
        }
      />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Status</th>
              <th>Accuracy</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td>{model.name}</td>
                <td>
                  <span className="badge">{model.status}</span>
                </td>
                <td>{model.accuracy}</td>
                <td>{model.updated}</td>
                <td>
                  <Link to={`/app/models/${model.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ModelDetail() {
  const { modelId } = useParams();
  const model = models.find((item) => item.id === modelId) || models[0];
  return (
    <div>
      <PageHeader
        title={model.name}
        subtitle={model.status}
        actions={
          <>
            <Link
              className="btn btn-secondary"
              to={`/app/models/${model.id}/versions`}
            >
              Versions
            </Link>
            <Link
              className="btn btn-primary"
              to={`/app/training/new?model=${model.id}`}
            >
              Retrain
            </Link>
          </>
        }
      />
      <div className="grid-3">
        <div className="panel">
          <h3>Accuracy</h3>
          <p style={{ fontSize: "2rem", margin: 0, color: "var(--ink)" }}>
            {model.accuracy}
          </p>
        </div>
        <div className="panel">
          <h3>Deploy</h3>
          <p>Push this model into a live campaign.</p>
          <Link className="btn btn-secondary" to="/app/campaigns/new">
            Create campaign
          </Link>
        </div>
        <div className="panel">
          <h3>Governance</h3>
          <p>Review fairness checks and approval history.</p>
          <Link to={`/app/models/${model.id}/governance`}>Open governance</Link>
        </div>
      </div>
    </div>
  );
}

export function ModelVersions() {
  const { modelId } = useParams();
  return (
    <div>
      <PageHeader title="Model versions" subtitle={modelId} />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Status</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>v4</td>
              <td>
                <span className="badge">Production</span>
              </td>
              <td>91.2%</td>
            </tr>
            <tr>
              <td>v3</td>
              <td>
                <span className="badge warn">Archived</span>
              </td>
              <td>89.4%</td>
            </tr>
          </tbody>
        </table>
        <Link to={`/app/models/${modelId}`}>Back to model</Link>
      </div>
    </div>
  );
}

export function ModelGovernance() {
  const { modelId } = useParams();
  return (
    <div>
      <PageHeader title="Governance" subtitle={modelId} />
      <div className="panel">
        <p>
          Approvals complete · Bias scan passed · Brand safety rules attached.
        </p>
        <Link className="btn btn-primary" to={`/app/models/${modelId}`}>
          Return to model
        </Link>
      </div>
    </div>
  );
}

export function TrainingIndex() {
  return (
    <div>
      <PageHeader
        title="Training jobs"
        subtitle="Queue, monitor, and promote model training runs."
        actions={
          <Link className="btn btn-primary" to="/app/training/new">
            New job
          </Link>
        }
      />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>job-889 · Creative Ranker EU</td>
              <td>
                <span className="badge warn">Running</span>
              </td>
              <td>
                <Link to="/app/training/job-889">Open</Link>
              </td>
            </tr>
            <tr>
              <td>job-870 · Conversion Propensity v4</td>
              <td>
                <span className="badge">Succeeded</span>
              </td>
              <td>
                <Link to="/app/training/job-870">Open</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TrainingJobDetail() {
  const { jobId } = useParams();
  return (
    <div>
      <PageHeader
        title={`Training job ${jobId}`}
        subtitle="Live progress and artifacts"
        actions={
          <Link className="btn btn-secondary" to="/app/models">
            View models
          </Link>
        }
      />
      <div className="panel">
        <div className="meter" style={{ marginBottom: "1rem" }}>
          <div style={{ width: "64%", background: "var(--teal-500)" }} />
        </div>
        <p>Epoch 12/20 · Validation AUC improving.</p>
        <Link className="btn btn-primary" to="/app/training/job-889/logs">
          View logs
        </Link>
      </div>
    </div>
  );
}

export function TrainingLogs() {
  const { jobId } = useParams();
  return (
    <div>
      <PageHeader title="Training logs" subtitle={jobId} />
      <div
        className="panel"
        style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.85rem" }}
      >
        <p>[12:01:11] Loaded 1.2M events from warehouse</p>
        <p>[12:04:02] Feature store sync complete</p>
        <p>[12:11:44] Epoch 12 val_auc=0.912</p>
      </div>
      <Link to={`/app/training/${jobId}`}>Back to job</Link>
    </div>
  );
}

export function TrainingCreate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({
    name: "",
    dataset:
      params.get("source") === "campaign-feedback"
        ? "campaign-feedback"
        : "warehouse",
    objective: "conversion",
    model: params.get("model") || "",
  });

  return (
    <div>
      <PageHeader title="New training job" subtitle={`Step ${step} of 4`} />
      <div className="panel" style={{ maxWidth: 720 }}>
        <div className="steps">
          {["Dataset", "Configure", "Review", "Submit"].map((label, i) => (
            <span
              key={label}
              className={`step-pill ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
            >
              {label}
            </span>
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="field">
              <label>Job name</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Q3 propensity retrain"
              />
            </div>
            <div className="field">
              <label>Dataset</label>
              <select
                value={draft.dataset}
                onChange={(e) =>
                  setDraft({ ...draft, dataset: e.target.value })
                }
              >
                <option value="warehouse">Warehouse sync</option>
                <option value="crm">CRM export</option>
                <option value="campaign-feedback">
                  Campaign feedback loop
                </option>
                <option value="sample">Sample dataset</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="field">
              <label>Objective</label>
              <select
                value={draft.objective}
                onChange={(e) =>
                  setDraft({ ...draft, objective: e.target.value })
                }
              >
                <option value="conversion">Conversion propensity</option>
                <option value="churn">Churn risk</option>
                <option value="creative">Creative ranking</option>
              </select>
            </div>
            <div className="field">
              <label>Base model (optional)</label>
              <select
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
              >
                <option value="">Train from scratch</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <ul className="feature-list">
              <li>Name: {draft.name || "Untitled job"}</li>
              <li>Dataset: {draft.dataset}</li>
              <li>Objective: {draft.objective}</li>
              <li>Base model: {draft.model || "None"}</li>
            </ul>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Submit training job?</h3>
            <p>Estimated runtime: 46 minutes on shared cluster.</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.pendo?.track("training_job_submitted", {
                    job_name: draft.name || "Untitled job",
                    dataset_source: draft.dataset,
                    objective: draft.objective,
                    base_model_id: draft.model || "none",
                  });
                  navigate("/app/training/job-889");
                }}
              >
                Submit job
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/app/training")}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
