import { configure } from "@utk09/ui-observability";
export { getLogger } from "@utk09/ui-observability";

const level = import.meta.env.DEV ? "DEBUG" : "WARN";

configure({
  endpoint: "",
  serviceName: "skardela",
  storage: "none",
  bus: { mode: "off" },
  minLevel: level,
  console: level,
  otelLoader: () => Promise.reject(new Error("@opentelemetry/api is not installed")),
});
