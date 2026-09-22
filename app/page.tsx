type Accent = "purple" | "green" | "neutral";

const signUpSteps: Array<{
  id: string;
  label: string;
  title: string;
  sub: string;
  body: string;
  cta: string;
  accent: Accent;
}> = [
  {
    id: "start",
    label: "1 Get Started",
    title: "LINK",
    sub: "Welcome",
    body: "Create your account",
    cta: "Create account",
    accent: "purple",
  },
  {
    id: "account",
    label: "2 Create Account",
    title: "Create your account",
    sub: "Let’s get started",
    body: "Enter your full name",
    cta: "Continue",
    accent: "neutral",
  },
  {
    id: "verify",
    label: "3 Verify Email",
    title: "Check your email",
    sub: "We’ve sent a verification link to",
    body: "yourname@example.com",
    cta: "Verify email",
    accent: "green",
  },
  {
    id: "created",
    label: "4 Account Created",
    title: "Your account is ready!",
    sub: "You can now sign in and start exploring",
    body: "Continue to sign in",
    cta: "Continue",
    accent: "green",
  },
  {
    id: "welcome",
    label: "5 Welcome",
    title: "Welcome to LINK!",
    sub: "Let’s personalise your experience",
    body: "Tell us about you",
    cta: "Continue",
    accent: "purple",
  },
];

const loginSteps: Array<{
  id: string;
  label: string;
  title: string;
  sub: string;
  body: string;
  cta: string;
  accent: Accent;
}> = [
  {
    id: "signin",
    label: "1 Sign in",
    title: "LINK",
    sub: "Sign in",
    body: "Enter your email or phone",
    cta: "Sign in",
    accent: "neutral",
  },
  {
    id: "logged",
    label: "2 Logged In",
    title: "Welcome back!",
    sub: "You’ve successfully signed in",
    body: "Continue",
    cta: "Continue",
    accent: "green",
  },
  {
    id: "forgot",
    label: "3 Forgot Password",
    title: "Forgot password?",
    sub: "Enter your email address and we’ll send a reset link",
    body: "Reset link",
    cta: "Send reset",
    accent: "neutral",
  },
  {
    id: "reset",
    label: "4 Reset Password",
    title: "Create new password",
    sub: "Choose a new password",
    body: "Password must be at least 8 characters",
    cta: "Reset password",
    accent: "neutral",
  },
  {
    id: "success",
    label: "5 Password Reset Success",
    title: "Password reset successful",
    sub: "You can now sign in with your new password",
    body: "Go to sign in",
    cta: "Go to sign in",
    accent: "green",
  },
];

const alternateMethods = [
  {
    label: "1 Sign Up with Phone",
    title: "Enter your account",
    meta: "Enter your mobile number",
  },
  {
    label: "2 Verify Phone Code",
    title: "Enter verification code",
    meta: "We sent a 6-digit code to +44 703...",
  },
  {
    label: "3 Social Sign Up",
    title: "Create your account",
    meta: "Continue with Google",
  },
  {
    label: "4 Continue as Guest",
    title: "Continue as guest",
    meta: "Access a limited version of the app",
  },
];

const states = [
  "Field Error",
  "Loading State",
  "Server Error",
  "Account Locked",
  "Back to Sign In",
];

const bullets = [
  "All data is encrypted in transit and at rest",
  "Passwords are hashed and securely stored",
  "We never share your data with third parties without consent",
  "Users can delete their account at any time",
];

const notes = [
  "All forms include inline validation",
  "All buttons are 44px minimum height",
  "Clear and consistent visual hierarchy",
  "Text and icon contrast meet WCAG 2.2 AA",
];

const copyGuidelines = [
  "Use plain, positive language",
  "Be supportive and non-judgemental",
  "Explain what users need to do and why",
  "Avoid jargon and acronyms",
];

const nextStep = [
  "After sign-in/up, users proceed to a personalised onboarding screen",
  "Tell us about your needs and goals",
  "Offer next steps and support options",
];

function PhoneCard({
  label,
  title,
  sub,
  body,
  cta,
  accent,
}: {
  label: string;
  title: string;
  sub: string;
  body: string;
  cta: string;
  accent: "purple" | "green" | "neutral";
}) {
  return (
    <div className="flow-card">
      <div className="step-pill">{label}</div>
      <div className="phone-shell">
        <div className="phone-header">
          <span>9:41</span>
          <span className="phone-status">◉◉◉</span>
        </div>
        <div className="phone-body">
          {title === "LINK" ? (
            <>
              <div className="brand-mini">
                <span className="mini-blob a" />
                <span className="mini-blob b" />
                <span className="mini-blob c" />
                <span className="mini-blob d" />
              </div>
              <div className="mini-logo">LINK</div>
              <div className="tiny-copy">{sub}</div>
            </>
          ) : (
            <>
              <h3>{title}</h3>
              <p>{sub}</p>
            </>
          )}
          <div className="field-block">{body}</div>
          <button type="button" className={`feature-button ${accent}`}>
            {cta}
          </button>
          {label.includes("Welcome") || label.includes("Logged In") || label.includes("Password Reset Success") ? (
            <div className="check-mark">✓</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MiniStateCard({ text }: { text: string }) {
  return <div className="state-card">{text}</div>;
}

export default function HomePage() {
  return (
    <div className="link-demo-page">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">
            <span className="orb orb-a" />
            <span className="orb orb-b" />
            <span className="orb orb-c" />
            <span className="orb orb-d" />
            <span className="link-cross" />
          </div>
          <div className="brand-copy">
            <div className="brand-title">LINK</div>
            <div className="brand-subtitle">Lincolnshire Inclusion &amp; Navigation Network</div>
          </div>
        </div>
        <div className="tagline">From need to opportunity.</div>

        <div className="sidebar-group">
          <h3>OVERVIEW</h3>
          <p>Multiple ways for users to create an account or sign in. Simple, accessible and secure.</p>
        </div>

        <div className="sidebar-group">
          <h3>PRIMARY ACTIONS</h3>
          <ul>
            <li>Create account</li>
            <li>Sign in</li>
          </ul>
        </div>

        <div className="sidebar-group">
          <h3>SECONDARY ACTIONS</h3>
          <ul>
            <li>Forgot password</li>
            <li>Continue as guest</li>
            <li>Help</li>
          </ul>
        </div>

        <div className="sidebar-group">
          <h3>DESIGN PRINCIPLES</h3>
          <ul>
            <li>Person-first</li>
            <li>Simple &amp; clear</li>
            <li>Inclusive &amp; accessible</li>
            <li>Secure &amp; private</li>
          </ul>
        </div>

        <div className="sidebar-group">
          <h3>AUTHENTICATION METHODS</h3>
          <ul>
            <li>Email &amp; Password</li>
            <li>Phone (SMS code)</li>
            <li>Google</li>
            <li>Apple</li>
            <li>Continue as guest</li>
          </ul>
        </div>

        <div className="sidebar-group">
          <h3>PASSWORD RULES</h3>
          <ul>
            <li>Minimum 8 characters</li>
            <li>Include uppercase letter</li>
            <li>Include lowercase letter</li>
            <li>Include number or symbol</li>
          </ul>
        </div>

        <div className="sidebar-group">
          <h3>ACCESSIBILITY</h3>
          <ul>
            <li>Large tap targets</li>
            <li>High contrast</li>
            <li>Screen reader labels</li>
            <li>Error text linked to fields</li>
          </ul>
        </div>
      </aside>

      <main className="content-panel">
        <header className="page-header">
          <h1>LINK — Sign Up / Log In</h1>
          <p>Users can create an account or sign in using email, phone or social accounts.</p>
        </header>

        <section className="flow-block">
          <div className="flow-title">A. SIGN UP FLOW</div>
          <div className="card-row">
            {signUpSteps.map((step) => (
              <PhoneCard key={step.id} {...step} />
            ))}
          </div>
        </section>

        <section className="flow-block">
          <div className="flow-title">B. LOG IN FLOW</div>
          <div className="card-row">
            {loginSteps.map((step) => (
              <PhoneCard key={step.id} {...step} />
            ))}
          </div>
        </section>

        <section className="flow-block alt-layout">
          <div className="alt-column">
            <div className="flow-title">C. ALTERNATIVE SIGN UP METHODS</div>
            <div className="card-row compact">
              {alternateMethods.map((method) => (
                <div key={method.label} className="alt-method-card">
                  <div className="mini-label">{method.label}</div>
                  <div className="method-box">
                    <div className="method-title">{method.title}</div>
                    <div className="method-meta">{method.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="state-column">
            <div className="state-header">STATES</div>
            <div className="state-list">
              {states.map((state) => (
                <MiniStateCard key={state} text={state} />
              ))}
            </div>
          </div>
        </section>

        <footer className="bottom-strip">
          <div className="bottom-card">
            <h4>SECURITY &amp; PRIVACY</h4>
            <ul>
              {bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bottom-card">
            <h4>NOTES</h4>
            <ul>
              {notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bottom-card">
            <h4>UX COPY GUIDELINES</h4>
            <ul>
              {copyGuidelines.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bottom-card">
            <h4>NEXT STEP</h4>
            <ul>
              {nextStep.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
}
