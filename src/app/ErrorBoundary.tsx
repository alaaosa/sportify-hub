import React from "react";

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<unknown, State> {
  constructor(props: unknown) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("Unhandled error in React tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ padding: 24, color: "#111827", fontFamily: "sans-serif" }}
        >
          <h2 style={{ color: "#EF4444" }}>Application error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
