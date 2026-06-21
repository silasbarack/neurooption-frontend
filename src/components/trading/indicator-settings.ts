export type IndicatorParameterType = "integer" | "decimal";

export type IndicatorSettingDefinition = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  type: IndicatorParameterType;
};

export type IndicatorSettingsMap = Record<string, Record<string, number>>;

export const INDICATOR_SETTING_DEFINITIONS: Record<
  string,
  IndicatorSettingDefinition[]
> = {
  SMA: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  EMA: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  WMA: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  BOLLINGER_BANDS: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "deviation",
      label: "Deviation",
      min: 0.1,
      max: 20,
      step: 0.1,
      type: "decimal",
    },
  ],

  PARABOLIC_SAR: [
    {
      key: "step",
      label: "Step",
      min: 0.001,
      max: 1,
      step: 0.001,
      type: "decimal",
    },
    {
      key: "maxStep",
      label: "Maximum",
      min: 0.001,
      max: 5,
      step: 0.001,
      type: "decimal",
    },
  ],

  ICHIMOKU: [
    {
      key: "conversionPeriod",
      label: "Conversion Line",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "basePeriod",
      label: "Base Line",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "spanBPeriod",
      label: "Leading Span B",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  DONCHIAN_CHANNEL: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  ENVELOPES: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "deviation",
      label: "Deviation %",
      min: 0.01,
      max: 50,
      step: 0.01,
      type: "decimal",
    },
  ],

  ALLIGATOR: [
    {
      key: "jawPeriod",
      label: "Jaw period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "teethPeriod",
      label: "Teeth period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "lipsPeriod",
      label: "Lips period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  KELTNER_CHANNEL: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "multiplier",
      label: "Multiplier",
      min: 0.1,
      max: 20,
      step: 0.1,
      type: "decimal",
    },
  ],

  HULL_MA: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  TEMA: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  KAMA: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  VWAP: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  SUPER_TREND: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "multiplier",
      label: "Multiplier",
      min: 0.1,
      max: 20,
      step: 0.1,
      type: "decimal",
    },
  ],

  LINEAR_REGRESSION: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  AWESOME_OSCILLATOR: [
    {
      key: "fastPeriod",
      label: "Fast period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "slowPeriod",
      label: "Slow period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  RSI: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  MACD: [
    {
      key: "fastPeriod",
      label: "Fast period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "slowPeriod",
      label: "Slow period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "signalPeriod",
      label: "Signal period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  CCI: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  ADX: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  ATR: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  WILLIAMS_R: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  MOMENTUM: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  STOCHASTIC_OSCILLATOR: [
    {
      key: "kPeriod",
      label: "%K period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "dPeriod",
      label: "%D period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "slowing",
      label: "Slowing",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  OSMA: [
    {
      key: "fastPeriod",
      label: "Fast period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "slowPeriod",
      label: "Slow period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "signalPeriod",
      label: "Signal period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  ACCELERATOR_OSCILLATOR: [
    {
      key: "fastPeriod",
      label: "Fast period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "slowPeriod",
      label: "Slow period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
    {
      key: "signalPeriod",
      label: "Signal period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  BULLS_POWER: [
    {
      key: "period",
      label: "EMA period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  DEMARKER: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  RATE_OF_CHANGE: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  STANDARD_DEVIATION: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],

  VARIANCE: [
    {
      key: "period",
      label: "Period",
      min: 1,
      max: 500,
      step: 1,
      type: "integer",
    },
  ],
};

export const DEFAULT_INDICATOR_SETTINGS: IndicatorSettingsMap = {
  SMA: { period: 20 },
  EMA: { period: 20 },
  WMA: { period: 20 },
  BOLLINGER_BANDS: { period: 20, deviation: 2 },
  PARABOLIC_SAR: { step: 0.02, maxStep: 0.2 },
  ICHIMOKU: { conversionPeriod: 9, basePeriod: 26, spanBPeriod: 52 },
  DONCHIAN_CHANNEL: { period: 20 },
  ENVELOPES: { period: 20, deviation: 0.1 },
  ALLIGATOR: { jawPeriod: 13, teethPeriod: 8, lipsPeriod: 5 },
  KELTNER_CHANNEL: { period: 20, multiplier: 2 },
  HULL_MA: { period: 20 },
  TEMA: { period: 20 },
  KAMA: { period: 20 },
  VWAP: { period: 50 },
  SUPER_TREND: { period: 10, multiplier: 3 },
  LINEAR_REGRESSION: { period: 20 },

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
  RATE_OF_CHANGE: { period: 12 },
  STANDARD_DEVIATION: { period: 20 },
  VARIANCE: { period: 20 },
};

export function clampIndicatorValue(
  indicator: string,
  key: string,
  value: number
) {
  const definition = INDICATOR_SETTING_DEFINITIONS[indicator]?.find(
    (item) => item.key === key
  );

  if (!definition) return value;

  const safeValue = Number.isFinite(value) ? value : definition.min;
  const clamped = Math.min(Math.max(safeValue, definition.min), definition.max);

  if (definition.type === "integer") {
    return Math.round(clamped);
  }

  return Number(clamped.toFixed(4));
}

export function updateIndicatorSetting(
  current: IndicatorSettingsMap,
  indicator: string,
  key: string,
  value: number
): IndicatorSettingsMap {
  return {
    ...current,
    [indicator]: {
      ...(current[indicator] ?? DEFAULT_INDICATOR_SETTINGS[indicator] ?? {}),
      [key]: clampIndicatorValue(indicator, key, value),
    },
  };
}

