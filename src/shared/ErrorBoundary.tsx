import { Component, type ErrorInfo, type ReactNode } from "react";
import { getLogger } from "./logger";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    getLogger("shared.error-boundary").error("A component threw an error", error, {
      componentStack: info.componentStack ?? undefined,
    });
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
