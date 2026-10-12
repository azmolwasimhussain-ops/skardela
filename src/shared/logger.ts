import { configure, getLogger as createLogger } from "@utk09/ui-observability";

// Keep one local export so callers use this module for setup and logger access.
export const getLogger = createLogger;

const isTest = import.meta.env.MODE === "test";
const level = isTest ? "WARN" : import.meta.env.DEV ? "DEBUG" : "WARN";

configure({
  endpoint: null,
  serviceName: "skardela",
  storage: "none",
  identity: "memory",
  bus: { mode: "off" },
  minLevel: level,
  // Use the object form so level and styles can change independently in later configure calls.
  console: { level },
});
