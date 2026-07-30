import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import { audiences } from "../../data/mockData";

export function AudiencesIndex() {
  return (
    <div>
      <PageHeader
        title="Audiences"
        subtitle="Cohorts used for training and activation."
        actions={
          <>
            <Link className="btn btn-secondary" to="/app/audiences/import">
              Import
            </Link>
            <Link className="btn btn-primary" to="/app/audiences/new">
              Build audience
            </Link>
          </>
        }
      />
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Audience</th>
              <th>Size</th>
              <th>Freshness</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {audiences.map((audience) => (
              <tr key={audience.id}>
                <td>{audience.name}</td>
                <td>{audience.size}</td>
                <td>{audience.freshness}</td>
                <td>
                  <Link to={`/app/audiences/${audience.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AudienceDetail() {
  const { audienceId } = useParams();
  const audience =
    audiences.find((item) => item.id === audienceId) || audiences[0];
  return (
    <div>
      <PageHeader
        title={audience.name}
        subtitle={`${audience.size} profiles · ${audience.freshness}`}
        actions={
          <Link className="btn btn-primary" to="/app/campaigns/new">
            Use in campaign
          </Link>
        }
      />
      <div className="panel">
        <p>This audience is eligible for training jobs and live scoring.</p>
        <Link to="/app/training/new">Queue training with this audience →</Link>
      </div>
    </div>
  );
}

export function AudienceImport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({
    source: "csv",
    emailMapping: "email",
    accountIdMapping: "account_id",
  });

  return (
    <div>
      <PageHeader title="Import audience" subtitle={`Step ${step} of 3`} />
      <div className="panel" style={{ maxWidth: 680 }}>
        {step === 1 && (
          <div>
            <div className="field">
              <label>Source</label>
              <select
                value={draft.source}
                onChange={(e) => setDraft({ ...draft, source: e.target.value })}
              >
                <option value="csv">CSV upload</option>
                <option value="salesforce">Salesforce</option>
                <option value="segment">Segment</option>
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
              <label>Map email field</label>
              <select
                value={draft.emailMapping}
                onChange={(e) =>
                  setDraft({ ...draft, emailMapping: e.target.value })
                }
              >
                <option value="email">email</option>
                <option value="work_email">work_email</option>
              </select>
            </div>
            <div className="field">
              <label>Map account id</label>
              <select
                value={draft.accountIdMapping}
                onChange={(e) =>
                  setDraft({ ...draft, accountIdMapping: e.target.value })
                }
              >
                <option value="account_id">account_id</option>
                <option value="company_id">company_id</option>
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
            <h3>Confirm import</h3>
            <p>19,240 rows ready. Duplicates will be merged by email.</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.pendo?.track("audience_imported", {
                    source: draft.source,
                    row_count: 19240,
                    email_field_mapping: draft.emailMapping,
                    account_id_mapping: draft.accountIdMapping,
                  });
                  navigate("/app/audiences/aud-11");
                }}
              >
                Confirm import
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AudienceCreate() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Build audience" subtitle="Rule-based cohort builder" />
      <div className="panel" style={{ maxWidth: 680 }}>
        <div className="field">
          <label>Name</label>
          <input placeholder="Expansion-ready mid-market" />
        </div>
        <div className="field">
          <label>Rule</label>
          <select defaultValue="intent">
            <option value="intent">High intent score &gt; 80</option>
            <option value="usage">Product usage spike last 14d</option>
            <option value="renewal">Renewal window &lt; 60d</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            window.pendo?.track("audience_created", {
              audience_name: panel?.querySelector("input")?.value || "",
              rule_type: panel?.querySelector("select")?.value || "",
            });
            navigate("/app/audiences/aud-10");
          }}
        >
          Save audience
        </button>
      </div>
    </div>
  );
}

export function AnalyticsHome() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Measure lift from trained models."
        actions={
          <Link className="btn btn-primary" to="/app/analytics/reports">
            Reports
          </Link>
        }
      />
      <div className="grid-3">
        {[
          ["Model-influenced pipeline", "$2.4M"],
          ["Avg. campaign lift", "+12.6%"],
          ["Training freshness", "18h"],
        ].map(([label, value]) => (
          <div className="panel" key={label}>
            <h3>{label}</h3>
            <p style={{ fontSize: "2rem", margin: 0, color: "var(--ink)" }}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: "1rem" }}>
        <Link to="/app/analytics/reports/export">Export dashboard CSV →</Link>
      </div>
    </div>
  );
}

export function AnalyticsReports() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Saved and scheduled analytics" />
      <div className="grid-2">
        {[
          "Weekly lift digest",
          "Model drift monitor",
          "Channel contribution",
        ].map((report) => (
          <div className="panel" key={report}>
            <h3>{report}</h3>
            <Link to="/app/analytics/reports/export">Export</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsExport() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader
        title="Export report"
        subtitle="Choose format and destination"
      />
      <div className="panel" style={{ maxWidth: 560 }}>
        <div className="field">
          <label>Format</label>
          <select defaultValue="csv">
            <option value="csv">CSV</option>
            <option value="xlsx">Excel</option>
            <option value="looker">Looker Studio</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            const panel = e.currentTarget.closest(".panel");
            window.pendo?.track("report_exported", {
              export_format: panel?.querySelector("select")?.value || "",
            });
            navigate("/app/analytics/reports/export/done");
          }}
        >
          Start export
        </button>
      </div>
    </div>
  );
}

export function AnalyticsExportDone() {
  return (
    <div>
      <PageHeader
        title="Export queued"
        subtitle="We'll email a download link shortly."
      />
      <Link className="btn btn-primary" to="/app/analytics">
        Back to analytics
      </Link>
    </div>
  );
}
