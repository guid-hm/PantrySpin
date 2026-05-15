import { Component, type ReactNode, type ErrorInfo } from "react";
import { Icon } from "./Icon";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: "48px 24px", textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--ps-tomato-soft)", color: "var(--ps-tomato)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon n="alert-triangle" style={{ width: 24, height: 24 }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "var(--ps-charcoal-3)", fontSize: 14, marginBottom: 20 }}>
            {this.state.error.message || "An unexpected error occurred."}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => { this.setState({ error: null }); window.location.reload(); }}
          >
            <Icon n="refresh-cw" style={{ width: 14, height: 14 }} />
            Reload app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
