import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { plans } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import "./marketing.css";

export function DemoRequest() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  return (
    <main className="section">
      <div className="container auth-card">
        <div className="panel">
          <span className="eyebrow">Demo</span>
          <h1 className="page-title">Book a Trainora walkthrough</h1>
          <p>
            Solution: {params.get("solution") || "platform overview"} · Plan
            interest: {params.get("plan") || "undecided"}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.pendo?.track("demo_requested", {
                solution: params.get("solution") || "platform overview",
                plan_interest: params.get("plan") || "undecided",
                training_interest: e.target.querySelector("select").value,
                company: e.target.querySelectorAll("input")[1]?.value || "",
              });
              navigate("/demo/confirmed");
            }}
          >
            <div className="field">
              <label>Work email</label>
              <input type="email" required />
            </div>
            <div className="field">
              <label>Company</label>
              <input required />
            </div>
            <div className="field">
              <label>What do you want to train first?</label>
              <select defaultValue="propensity">
                <option value="propensity">Propensity models</option>
                <option value="creative">Creative scoring</option>
                <option value="audience">Audience expansion</option>
                <option value="lifecycle">Lifecycle orchestration</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">
              Request demo
            </button>
          </form>
          <p style={{ marginTop: "1rem" }}>
            Want to click around now?{" "}
            <Link to="/signup">Start a self-serve trial</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export function DemoConfirmed() {
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Demo requested</h1>
        <p>
          A solutions engineer will reach out with times. Meanwhile, explore
          these paths:
        </p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/resources">
            Browse resources
          </Link>
          <Link className="btn btn-secondary" to="/signup">
            Start trial anyway
          </Link>
          <Link className="btn btn-ghost" to="/customers">
            See customer stories
          </Link>
        </div>
      </div>
    </main>
  );
}

export function Checkout() {
  const { planId } = useParams();
  const plan = plans.find((item) => item.id === planId) || plans[1];
  const navigate = useNavigate();
  const { signup, updatePlan } = useAuth();

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="page-title">Checkout · {plan.name}</h1>
        <div className="panel">
          <p>
            {plan.price
              ? `$${plan.price}/month billed annually available at next step.`
              : "Custom enterprise paperwork."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signup({
                name: "Checkout User",
                email: "checkout@example.com",
                company: "Checkout Co",
                plan: plan.id,
                onboarded: false,
              });
              updatePlan(plan.id);
              window.pendo?.track("checkout_completed", {
                plan_id: plan.id,
                plan_name: plan.name,
                plan_price: plan.price,
              });
              navigate(`/checkout/${plan.id}/success`);
            }}
          >
            <div className="field">
              <label>Cardholder name</label>
              <input required defaultValue="Alex Rivera" />
            </div>
            <div className="field">
              <label>Card number</label>
              <input required defaultValue="4242 4242 4242 4242" />
            </div>
            <div className="grid-2">
              <div className="field">
                <label>Expiry</label>
                <input required defaultValue="12/28" />
              </div>
              <div className="field">
                <label>CVC</label>
                <input required defaultValue="123" />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Pay & continue
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export function CheckoutSuccess() {
  const { planId } = useParams();
  return (
    <main className="section">
      <div className="container">
        <h1 className="page-title">Payment successful</h1>
        <p>
          Your {planId} workspace is ready. Finish onboarding to unlock the app.
        </p>
        <Link className="btn btn-primary" to="/onboarding/company">
          Continue onboarding
        </Link>
      </div>
    </main>
  );
}
