import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { audiences, campaigns, models } from "../../data/mockData";

export function CampaignsIndex() {
  return (
    <div>
      <PageHeader
        title="Campaigns"
        subtitle="Activate trained models across channels."
        actions={
          <Link className="btn btn-primary" to="/app/campaigns/new">
            Create campaign
          </Link>
        }
      />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Lift</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{campaign.channel}</td>
                <td>
                  <span className="badge">{campaign.status}</span>
                </td>
                <td>{campaign.lift}</td>
                <td>
                  <Link to={`/app/campaigns/${campaign.id}`}>Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
}

export function CampaignDetail() {
  const { campaignId } = useParams();
  const campaign =
    campaigns.find((item) => item.id === campaignId) || campaigns[0];

  return (
    <div>
      <PageHeader
        title={campaign.name}
        subtitle={`${campaign.channel} · ${campaign.status}`}
        actions={
          <>
            <Link
              className="btn btn-secondary"
              to={`/app/campaigns/${campaign.id}/edit`}
            >
              Edit
            </Link>
            <Link
              className="btn btn-primary"
              to={`/app/campaigns/${campaign.id}/results`}
            >
              View results
            </Link>
          </>
        }
      />
      <div className="grid-3">
        <div className="panel">
          <h3>Lift</h3>
          <p style={{ fontSize: "2rem", margin: 0, color: "var(--ink)" }}>
            {campaign.lift}
          </p>
        </div>
        <div className="panel">
          <h3>Linked model</h3>
          <p>{models[0].name}</p>
          <Link to={`/app/models/${models[0].id}`}>Open model</Link>
        </div>
        <div className="panel">
          <h3>Audience</h3>
          <p>{audiences[0].name}</p>
          <Link to={`/app/audiences/${audiences[0].id}`}>Open audience</Link>
        </div>
      </div>
    </div>
  );
}

export function CampaignResults() {
  const { campaignId } = useParams();
  return (
    <div>
      <PageHeader
        title="Campaign results"
        subtitle={`Campaign ${campaignId}`}
      />
      <div className="grid-2">
        <div className="panel">
          <h3>Conversion rate</h3>
          <p style={{ fontSize: "2rem", margin: 0, color: "var(--ink)" }}>
            4.8%
          </p>
        </div>
        <div className="panel">
          <h3>Feedback loop</h3>
          <p>Send outcomes into the next training job.</p>
          <Link
            className="btn btn-primary"
            to="/app/training/new?source=campaign-feedback"
          >
            Queue retrain
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CampaignCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({
    name: "",
    audienceId: audiences[0].id,
    modelId: models[0].id,
    channel: "Email + Ads",
  });

  return (
    <div>
      <PageHeader title="Create campaign" subtitle={`Step ${step} of 4`} />
      <div className="panel" style={{ maxWidth: 720 }}>
        <div className="steps">
          {["Basics", "Audience", "Model", "Launch"].map((label, i) => (
            <span
              key={label}
              className={`step-pill ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
            >
              {label}
            </span>
          ))}
        </div>

        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <div className="field">
              <label>Campaign name</label>
              <input
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Channel mix</label>
              <select
                value={draft.channel}
                onChange={(e) =>
                  setDraft({ ...draft, channel: e.target.value })
                }
              >
                <option>Email + Ads</option>
                <option>Lifecycle</option>
                <option>Sales outreach</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <div className="field">
              <label>Audience</label>
              <select
                value={draft.audienceId}
                onChange={(e) =>
                  setDraft({ ...draft, audienceId: e.target.value })
                }
              >
                {audiences.map((audience) => (
                  <option key={audience.id} value={audience.id}>
                    {audience.name}
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
              <Link className="btn btn-ghost" to="/app/audiences/import">
                Import new audience
              </Link>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="field">
              <label>Scoring model</label>
              <select
                value={draft.modelId}
                onChange={(e) =>
                  setDraft({ ...draft, modelId: e.target.value })
                }
              >
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setStep(4)}>
                Continue
              </button>
              <Link className="btn btn-ghost" to="/app/training/new">
                Train a new model
              </Link>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Ready to launch</h3>
            <ul className="feature-list">
              <li>Name: {draft.name || "Untitled"}</li>
              <li>Channel: {draft.channel}</li>
              <li>Audience: {draft.audienceId}</li>
              <li>Model: {draft.modelId}</li>
            </ul>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(3)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.pendo?.track("campaign_launched", {
                    campaign_name: draft.name || "Untitled",
                    channel: draft.channel,
                    audience_id: draft.audienceId,
                    model_id: draft.modelId,
                  });
                  navigate("/app/campaigns/cmp-104/results");
                }}
              >
                Launch campaign
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  window.pendo?.track("campaign_saved_as_draft", {
                    campaign_name: draft.name || "Untitled",
                    channel: draft.channel,
                    audience_id: draft.audienceId,
                    model_id: draft.modelId,
                  });
                  navigate("/app/campaigns");
                }}
              >
                Save as draft
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CampaignEdit() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Edit campaign" subtitle={campaignId} />
      <div className="panel" style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Name</label>
          <input defaultValue="Q3 Enterprise Upsell" />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            window.pendo?.track("campaign_edited", {
              campaign_id: campaignId,
            });
            navigate(`/app/campaigns/${campaignId}`);
          }}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
