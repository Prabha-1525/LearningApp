export type AnalyticsEventName = string;

export type AnalyticsPayload = Readonly<
  Record<string, string | number | boolean | null>
>;

export type AnalyticsPort = {
  track(event: AnalyticsEventName, payload?: AnalyticsPayload): void;
  setUserProperty(key: string, value: string): void;
};
