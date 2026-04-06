// Privacy-first analytics — no third-party services that share health data
// All analytics are internal only

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
}

const events: AnalyticsEvent[] = [];

export function trackEvent(event: string, properties?: Record<string, string | number | boolean>) {
  events.push({
    event,
    properties,
    timestamp: new Date().toISOString(),
  });
}

export function getEvents(): AnalyticsEvent[] {
  return [...events];
}
