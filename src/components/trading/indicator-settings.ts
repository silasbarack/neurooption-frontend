export type IndicatorParameterType = "integer" | "decimal";

export type IndicatorSettingDefinition = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  type: IndicatorParameterType;
};

export type IndicatorStyleDefinition = {
  key: string;
  label: string;
  type: "color" | "number" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
};

export type IndicatorSettingsMap = Record<string, Record<string, number>>;
export type IndicatorStylesMap = Record<string, Record<string, string | number | boolean>>;

export const INDICATOR_SETTING_DEFINITIONS: Record<
  string,
  IndicatorSettingDefinition[]
> = {
  SMA: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  EMA: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  WMA: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  ALLIGATOR: [
    { key: "jawPeriod", label: "Jaw period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "teethPeriod", label: "Teeth period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "lipsPeriod", label: "Lips period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  BOLLINGER_BANDS: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "deviation", label: "Deviation", min: 0.1, max: 10, step: 0.1, type: "decimal" },
  ],

  PARABOLIC_SAR: [
    { key: "step", label: "Step", min: 0.001, max: 1, step: 0.001, type: "decimal" },
    { key: "maxStep", label: "Maximum", min: 0.001, max: 5, step: 0.001, type: "decimal" },
  ],

  ICHIMOKU: [
    { key: "conversionPeriod", label: "Conversion Line", min: 1, max: 500, step: 1, type: "integer" },
    { key: "basePeriod", label: "Base Line", min: 1, max: 500, step: 1, type: "integer" },
    { key: "spanBPeriod", label: "Leading Span B", min: 1, max: 500, step: 1, type: "integer" },
  ],

  DONCHIAN_CHANNEL: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  ENVELOPES: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "deviation", label: "Deviation %", min: 0.01, max: 20, step: 0.01, type: "decimal" },
  ],

  AWESOME_OSCILLATOR: [
    { key: "fastPeriod", label: "Fast SMA Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "slowPeriod", label: "Slow SMA Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  RSI: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  MACD: [
    { key: "fastPeriod", label: "Fast period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "slowPeriod", label: "Slow period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "signalPeriod", label: "Signal period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  CCI: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  ADX: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  ATR: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  WILLIAMS_R: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  MOMENTUM: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  STOCHASTIC_OSCILLATOR: [
    { key: "kPeriod", label: "%K Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "dPeriod", label: "%D Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "slowing", label: "Slowing", min: 1, max: 500, step: 1, type: "integer" },
  ],

  OSMA: [
    { key: "fastPeriod", label: "Fast EMA Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "slowPeriod", label: "Slow EMA Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "signalPeriod", label: "Signal SMA Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  ACCELERATOR_OSCILLATOR: [
    { key: "fastPeriod", label: "Fast SMA Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "slowPeriod", label: "Slow SMA Period", min: 1, max: 500, step: 1, type: "integer" },
    { key: "signalPeriod", label: "Signal SMA Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  BULLS_POWER: [
    { key: "period", label: "EMA Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  DEMARKER: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],

  RATE_OF_CHANGE: [
    { key: "period", label: "Period", min: 1, max: 500, step: 1, type: "integer" },
  ],
};

export const INDICATOR_STYLE_DEFINITIONS: Record<string, IndicatorStyleDefinition[]> = {
  SMA: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  EMA: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  WMA: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  ALLIGATOR: [
    { key: "jawColor", label: "Jaw colour", type: "color" },
    { key: "teethColor", label: "Teeth colour", type: "color" },
    { key: "lipsColor", label: "Lips colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  MACD: [
    { key: "showHistogram", label: "Histogram", type: "checkbox" },
    { key: "histogramUpColor", label: "Histogram up colour", type: "color" },
    { key: "histogramDownColor", label: "Histogram down colour", type: "color" },
    { key: "showMacdLine", label: "MACD line", type: "checkbox" },
    { key: "macdLineColor", label: "MACD line colour", type: "color" },
    { key: "macdLineWidth", label: "MACD line width", type: "number", min: 1, max: 5, step: 0.5 },
    { key: "showSignalLine", label: "Signal line", type: "checkbox" },
    { key: "signalLineColor", label: "Signal line colour", type: "color" },
    { key: "signalLineWidth", label: "Signal line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  OSMA: [
    { key: "histogramUpColor", label: "Histogram up colour", type: "color" },
    { key: "histogramDownColor", label: "Histogram down colour", type: "color" },
  ],

  AWESOME_OSCILLATOR: [
    { key: "histogramUpColor", label: "Histogram up colour", type: "color" },
    { key: "histogramDownColor", label: "Histogram down colour", type: "color" },
  ],

  ACCELERATOR_OSCILLATOR: [
    { key: "histogramUpColor", label: "Histogram up colour", type: "color" },
    { key: "histogramDownColor", label: "Histogram down colour", type: "color" },
  ],

  RSI: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
    { key: "upperLevelColor", label: "Upper level colour", type: "color" },
    { key: "lowerLevelColor", label: "Lower level colour", type: "color" },
  ],

  CCI: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
    { key: "levelColor", label: "Level colour", type: "color" },
  ],

  RATE_OF_CHANGE: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
    { key: "zeroLineColor", label: "Zero line colour", type: "color" },
  ],

  ADX: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  ATR: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  WILLIAMS_R: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],

  MOMENTUM: [
    { key: "lineColor", label: "Line colour", type: "color" },
    { key: "lineWidth", label: "Line width", type: "number", min: 1, max: 5, step: 0.5 },
  ],
};

export const DEFAULT_INDICATOR_SETTINGS: IndicatorSettingsMap = {
  SMA: { period: 20 },
  EMA: { period: 20 },
  WMA: { period: 20 },
  ALLIGATOR: { jawPeriod: 13, teethPeriod: 8, lipsPeriod: 5 },
  BOLLINGER_BANDS: { period: 20, deviation: 2 },
  PARABOLIC_SAR: { step: 0.02, maxStep: 0.2 },
  ICHIMOKU: { conversionPeriod: 9, basePeriod: 26, spanBPeriod: 52 },
  DONCHIAN_CHANNEL: { period: 20 },
  ENVELOPES: { period: 20, deviation: 0.1 },

  AWESOME_OSCILLATOR: { fastPeriod: 5, slowPeriod: 34 },
  RSI: { period: 14 },
  MACD: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  CCI: { period: 20 },
  ADX: { period: 14 },
  ATR: { period: 14 },
  WILLIAMS_R: { period: 14 },
  MOMENTUM: { period: 10 },
  STOCHASTIC_OSCILLATOR: { kPeriod: 14, dPeriod: 3, slowing: 3 },
  OSMA: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  ACCELERATOR_OSCILLATOR: { fastPeriod: 5, slowPeriod: 34, signalPeriod: 5 },
  BULLS_POWER: { period: 13 },
  DEMARKER: { period: 14 },
  RATE_OF_CHANGE: { period: 14 },
};

export const DEFAULT_INDICATOR_STYLES: IndicatorStylesMap = {
  SMA: { lineColor: "#22c55e", lineWidth: 1.5 },
  EMA: { lineColor: "#f97316", lineWidth: 1.5 },
  WMA: { lineColor: "#2563eb", lineWidth: 1.5 },

  ALLIGATOR: {
    jawColor: "#3b82f6",
    teethColor: "#ef4444",
    lipsColor: "#a3e635",
    lineWidth: 1.5,
  },

  MACD: {
    showHistogram: true,
    histogramUpColor: "#b6e34b",
    histogramDownColor: "#ef4444",
    showMacdLine: true,
    macdLineColor: "#b6e34b",
    macdLineWidth: 1.3,
    showSignalLine: true,
    signalLineColor: "#ef4444",
    signalLineWidth: 1.3,
  },

  OSMA: {
    histogramUpColor: "#b6e34b",
    histogramDownColor: "#ef4444",
  },

  AWESOME_OSCILLATOR: {
    histogramUpColor: "#22c55e",
    histogramDownColor: "#ef4444",
  },

  ACCELERATOR_OSCILLATOR: {
    histogramUpColor: "#22c55e",
    histogramDownColor: "#ef4444",
  },

  RSI: {
    lineColor: "#d7d36a",
    lineWidth: 1.4,
    upperLevelColor: "#38bdf8",
    lowerLevelColor: "#f59e0b",
  },

  CCI: {
    lineColor: "#facc15",
    lineWidth: 1.4,
    levelColor: "#f59e0b",
  },

  RATE_OF_CHANGE: {
    lineColor: "#facc15",
    lineWidth: 1.4,
    zeroLineColor: "#94a3b8",
  },

  ADX: { lineColor: "#38bdf8", lineWidth: 1.4 },
  ATR: { lineColor: "#f97316", lineWidth: 1.4 },
  WILLIAMS_R: { lineColor: "#a78bfa", lineWidth: 1.4 },
  MOMENTUM: { lineColor: "#22c55e", lineWidth: 1.4 },
};

export function clampIndicatorValue(
  indicator: string,
  key: string,
  value: number,
) {
  const definition = INDICATOR_SETTING_DEFINITIONS[indicator]?.find(
    (item) => item.key === key,
  );

  if (!definition) return value;

  const safeValue = Number.isFinite(value) ? value : definition.min;
  const clamped = Math.min(Math.max(safeValue, definition.min), definition.max);

  if (definition.type === "integer") return Math.round(clamped);

  return Number(clamped.toFixed(4));
}

export function updateIndicatorSetting(
  current: IndicatorSettingsMap,
  indicator: string,
  key: string,
  value: number,
): IndicatorSettingsMap {
  return {
    ...current,
    [indicator]: {
      ...(current[indicator] ?? DEFAULT_INDICATOR_SETTINGS[indicator] ?? {}),
      [key]: clampIndicatorValue(indicator, key, value),
    },
  };
}

export function updateIndicatorStyle(
  current: IndicatorStylesMap,
  indicator: string,
  key: string,
  value: string | number | boolean,
): IndicatorStylesMap {
  const definition = INDICATOR_STYLE_DEFINITIONS[indicator]?.find(
    (item) => item.key === key,
  );

  let nextValue: string | number | boolean = value;

  if (definition?.type === "number") {
    const numeric = Number(value);
    const min = definition.min ?? 0;
    const max = definition.max ?? 10;
    nextValue = Math.min(Math.max(Number.isFinite(numeric) ? numeric : min, min), max);
  }

  return {
    ...current,
    [indicator]: {
      ...(current[indicator] ?? DEFAULT_INDICATOR_STYLES[indicator] ?? {}),
      [key]: nextValue,
    },
  };
}
