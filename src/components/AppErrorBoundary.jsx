import React from "react";

import {
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.error(
      "YOUR GLOW — Rendering Error:",
      error,
      info
    );
  }

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "25px",
          background: "#FAF6EF",
          color: "#382F35",
          fontFamily:
            "'DM Sans', Arial, sans-serif",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: "610px",
            padding:
              "clamp(30px, 6vw, 65px)",
            textAlign: "center",
            background: "#FFFDF9",
            border: "1px solid #E8DCD5",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "38px",
            }}
          >
            <Sparkles
              size={29}
              color="#B88E86"
              strokeWidth={1.5}
            />

            <strong
              style={{
                fontSize: "1.2rem",
                letterSpacing: "0.08em",
              }}
            >
              YOUR GLOW.
            </strong>
          </div>

          <AlertCircle
            size={35}
            strokeWidth={1.4}
            color="#BA8A80"
          />

          <h1
            style={{
              margin: "25px 0",
              fontFamily:
                "'DM Serif Display', Georgia, serif",
              fontWeight: 400,
              fontSize:
                "clamp(2.7rem, 7vw, 4.5rem)",
              lineHeight: 1.06,
            }}
          >
            A little pause
            <br />
            in your{" "}
            <em
              style={{
                color: "#B68A83",
              }}
            >
              glow.
            </em>
          </h1>

          <p
            style={{
              maxWidth: "440px",
              margin: "0 auto 30px",
              color: "#897A77",
              fontSize: "0.91rem",
              lineHeight: 1.9,
            }}
          >
            Something unexpected interrupted
            this website concept. Reload the
            page to try again.
          </p>

          <button
            type="button"
            onClick={this.reloadPage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "13px",
              minHeight: "53px",
              padding: "15px 24px",
              background: "#382F35",
              color: "white",
              border: 0,
              fontWeight: 800,
              fontSize: "0.79rem",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={17} />
            Reload Experience
            <ArrowRight size={17} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "38px",
              color: "#A08A83",
              fontSize: "0.68rem",
            }}
          >
            <ShieldCheck size={17} />
            YOUR GLOW · PORTFOLIO CONCEPT
          </div>
        </section>
      </main>
    );
  }
}