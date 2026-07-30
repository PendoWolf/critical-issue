import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { integrations } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";

export function AppIntegrations() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connect sources for training data and activation."
      />
      <div className="grid-3">
        {integrations.map((item) => (
          <div className="panel" key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.category}</p>
            <span className="badge">{item.status}</span>
            <div style={{ marginTop: "0.85rem" }}>
              <Link
                className="btn btn-secondary"
                to={`/app/integrations/${item.id}/connect`}
              >
                {item.status === "Connected" ? "Manage" : "Connect"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntegrationConnect() {
  const { integrationId } = useParams();
  const item =
    integrations.find((entry) => entry.id === integrationId) || integrations[0];
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [syncFrequency, setSyncFrequency] = useState("hourly");

  return (
    <div>
      <PageHeader
        title={`Connect ${item.name}`}
        subtitle={`Step ${step} of 3`}
      />
      <div className="panel" style={{ maxWidth: 640 }}>
        {step === 1 && (
          <div>
            <p>Authorize Trainora to read events and write scores.</p>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Authorize
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="field">
              <label>Sync frequency</label>
              <select
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value)}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="realtime">Near real-time</option>
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
            <h3>Test connection</h3>
            <p>We found 128k events in the last 30 days.</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  pendo.track("integration_connected", {
                    integration_id: item.id,
                    integration_name: item.name,
                    category: item.category,
                    sync_frequency: syncFrequency,
                  });
                  navigate(`/app/integrations/${item.id}/success`);
                }}
              >
                Finish setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function IntegrationSuccess() {
  const { integrationId } = useParams();
  return (
    <div>
      <PageHeader title="Integration connected" subtitle={integrationId} />
      <div className="hero-cta">
        <Link className="btn btn-primary" to="/app/training/new">
          Start a training job
        </Link>
        <Link className="btn btn-secondary" to="/app/integrations">
          Back to integrations
        </Link>
      </div>
    </div>
  );
}

export function Experiments() {
  return (
    <div>
      <PageHeader
        title="Experiments"
        subtitle="A/B test model policies before broad rollout."
        actions={
          <Link className="btn btn-primary" to="/app/experiments/new">
            New experiment
          </Link>
        }
      />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Experiment</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Propensity threshold 0.65 vs 0.72</td>
              <td>
                <span className="badge">Running</span>
              </td>
              <td>
                <Link to="/app/experiments/exp-12">Open</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExperimentDetail() {
  const { experimentId } = useParams();
  return (
    <div>
      <PageHeader
        title={`Experiment ${experimentId}`}
        subtitle="Policy comparison"
      />
      <div className="grid-2">
        <div className="panel">
          <h3>Control</h3>
          <p>Conversion 3.9%</p>
        </div>
        <div className="panel">
          <h3>Variant</h3>
          <p>Conversion 4.4%</p>
        </div>
      </div>
      <Link
        className="btn btn-primary"
        style={{ marginTop: "1rem" }}
        to="/app/campaigns/new"
      >
        Promote winner to campaign
      </Link>
    </div>
  );
}

export function ExperimentCreate() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="New experiment" />
      <div className="panel" style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Name</label>
          <input placeholder="Creative ranker exploration" />
        </div>
        <div className="field">
          <label>Traffic split</label>
          <select defaultValue="50">
            <option value="50">50 / 50</option>
            <option value="80">80 / 20</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            pendo.track("experiment_launched", {
              experiment_name: panel?.querySelector("input")?.value || "",
              traffic_split: panel?.querySelector("select")?.value || "50",
            });
            navigate("/app/experiments/exp-12");
          }}
        >
          Launch experiment
        </button>
      </div>
    </div>
  );
}

export function SettingsWorkspace() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader title="Workspace settings" subtitle={user?.company} />
      <div className="panel" style={{ maxWidth: 640 }}>
        <div className="field">
          <label>Workspace name</label>
          <input defaultValue={user?.company} />
        </div>
        <div className="field">
          <label>Default region</label>
          <select defaultValue="us">
            <option value="us">US</option>
            <option value="eu">EU</option>
            <option value="apac">APAC</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            pendo.track("workspace_settings_saved", {
              workspace_name: panel?.querySelector("input")?.value || "",
              default_region: panel?.querySelector("select")?.value || "us",
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export function SettingsTeam() {
  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Invite teammates and assign roles."
        actions={
          <Link className="btn btn-primary" to="/app/settings/team/invite">
            Invite member
          </Link>
        }
      />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alex Rivera</td>
              <td>Admin</td>
            </tr>
            <tr>
              <td>Sam Chen</td>
              <td>Analyst</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TeamInvite() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Invite teammate" />
      <div className="panel" style={{ maxWidth: 560 }}>
        <div className="field">
          <label>Email</label>
          <input type="email" />
        </div>
        <div className="field">
          <label>Role</label>
          <select defaultValue="analyst">
            <option value="admin">Admin</option>
            <option value="analyst">Analyst</option>
            <option value="marketer">Marketer</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            pendo.track("team_member_invited", {
              invitee_role: panel?.querySelector("select")?.value || "analyst",
            });
            navigate("/app/settings/team/invite/sent");
          }}
        >
          Send invite
        </button>
      </div>
    </div>
  );
}

export function TeamInviteSent() {
  return (
    <div>
      <PageHeader title="Invite sent" />
      <Link className="btn btn-primary" to="/app/settings/team">
        Back to team
      </Link>
    </div>
  );
}

export function SettingsBilling() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle={`Current plan: ${user?.plan || "trial"}`}
        actions={
          <Link className="btn btn-primary" to="/app/settings/billing/upgrade">
            Upgrade
          </Link>
        }
      />
      <div className="panel">
        <p>Next invoice on Aug 1 · Payment method •••• 4242</p>
        <Link to="/pricing">Compare public pricing →</Link>
      </div>
    </div>
  );
}

export function BillingUpgrade() {
  const { updatePlan, user } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Upgrade plan" />
      <div className="grid-2">
        {["growth", "enterprise"].map((plan) => (
          <div className="panel" key={plan}>
            <h3>{plan}</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (plan === "enterprise") navigate("/demo?plan=enterprise");
                else {
                  pendo.track("plan_upgraded", {
                    new_plan: plan,
                    previous_plan: user?.plan || "trial",
                  });
                  updatePlan(plan);
                  navigate("/app/settings/billing/upgrade/success");
                }
              }}
            >
              {plan === "enterprise" ? "Talk to sales" : "Upgrade now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BillingUpgradeSuccess() {
  return (
    <div>
      <PageHeader title="Plan updated" subtitle="Growth features unlocked." />
      <Link className="btn btn-primary" to="/app">
        Back to overview
      </Link>
    </div>
  );
}

export function SettingsNotifications() {
  return (
    <div>
      <PageHeader title="Notifications" />
      <div className="panel" style={{ maxWidth: 560 }}>
        {["Training job completed", "Model drift alerts", "Weekly digest"].map(
          (item) => (
            <label
              key={item}
              style={{
                display: "flex",
                gap: "0.6rem",
                marginBottom: "0.75rem",
              }}
            >
              <input type="checkbox" defaultChecked />
              {item}
            </label>
          ),
        )}
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            const checkboxes =
              panel?.querySelectorAll('input[type="checkbox"]') || [];
            pendo.track("notification_preferences_saved", {
              training_job_completed_enabled: checkboxes[0]?.checked ?? true,
              model_drift_alerts_enabled: checkboxes[1]?.checked ?? true,
              weekly_digest_enabled: checkboxes[2]?.checked ?? true,
            });
          }}
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}

export function AdminConsole() {
  return (
    <div>
      <PageHeader
        title="Admin console"
        subtitle="Org-wide controls for security and environments."
      />
      <div className="grid-3">
        <Link className="panel" to="/app/admin/audit-log">
          <h3>Audit log</h3>
          <p>Review privileged actions.</p>
        </Link>
        <Link className="panel" to="/app/admin/environments">
          <h3>Environments</h3>
          <p>Manage staging vs production.</p>
        </Link>
        <Link className="panel" to="/app/admin/api-keys">
          <h3>API keys</h3>
          <p>Issue and rotate credentials.</p>
        </Link>
      </div>
    </div>
  );
}

export function AdminAuditLog() {
  return (
    <div>
      <PageHeader title="Audit log" />
      <div className="panel">
        <p>alex@northwind.io promoted model mdl-21 · 2h ago</p>
        <p>sam@northwind.io connected Snowflake · 1d ago</p>
      </div>
    </div>
  );
}

export function AdminEnvironments() {
  return (
    <div>
      <PageHeader title="Environments" />
      <div className="grid-2">
        <div className="panel">
          <h3>Production</h3>
          <span className="badge">Active</span>
        </div>
        <div className="panel">
          <h3>Staging</h3>
          <Link to="/app/training/new">Run staging train →</Link>
        </div>
      </div>
    </div>
  );
}

export function AdminApiKeys() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader
        title="API keys"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => navigate("/app/admin/api-keys/new")}
          >
            Create key
          </button>
        }
      />
      <div className="panel">
        <p>
          <code>tr_live_••••9182</code> · created 12d ago
        </p>
      </div>
    </div>
  );
}

export function AdminApiKeyCreate() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Create API key" />
      <div className="panel" style={{ maxWidth: 560 }}>
        <div className="field">
          <label>Key name</label>
          <input placeholder="Activation service" />
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            pendo.track("api_key_created", {
              key_name: panel?.querySelector("input")?.value || "",
            });
            navigate("/app/admin/api-keys");
          }}
        >
          Create
        </button>
      </div>
    </div>
  );
}
