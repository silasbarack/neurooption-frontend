import React from "react";
import type { ChartType } from "./trading.types";
import { DRAWING_TOOLS, INDICATORS, TIMEFRAMES } from "./trading.constants";
import {
  DEFAULT_INDICATOR_SETTINGS,
  INDICATOR_SETTING_DEFINITIONS,
  clampIndicatorValue,
  type IndicatorSettingsMap,
} from "./indicator-settings";

type TradingToolbarProps = {
  timeframe: string;
  chartType: ChartType;
  selectedTool: string;
  selectedIndicators: string[];
  indicatorSettings?: IndicatorSettingsMap;
  timeframeOpen: boolean;
  indicatorsOpen: boolean;
  drawingOpen: boolean;
  onTimeframeToggle: () => void;
  onIndicatorsToggle: () => void;
  onDrawingToggle: () => void;
  onTimeframeChange: (timeframe: string) => void;
  onChartTypeChange: (chartType: ChartType) => void;
  onToolChange: (tool: string) => void;
  onIndicatorToggle: (indicator: string) => void;
  onIndicatorSettingChange?: (
    indicator: string,
    key: string,
    value: number
  ) => void;
};

type IndicatorModalState = {
  label: string;
  canonical: string;
  draft: Record<string, number>;
};

function normalizeIndicatorName(indicator: string) {
  const name = indicator.trim().toLowerCase();

  if (name === "moving average" || name === "ma" || name === "simple ma") return "SMA";
  if (name.includes("exponential")) return "EMA";
  if (name.includes("weighted")) return "WMA";
  if (name.includes("bollinger")) return "BOLLINGER_BANDS";
  if (name.includes("parabolic") || name.includes("sar")) return "PARABOLIC_SAR";
  if (name.includes("ichimoku")) return "ICHIMOKU";
  if (name.includes("donchian")) return "DONCHIAN_CHANNEL";
  if (name.includes("envelope")) return "ENVELOPES";
  if (name.includes("alligator")) return "ALLIGATOR";
  if (name.includes("keltner")) return "KELTNER_CHANNEL";
  if (name.includes("hull")) return "HULL_MA";
  if (name.includes("tema")) return "TEMA";
  if (name.includes("kama")) return "KAMA";
  if (name.includes("price channel")) return "PRICE_CHANNEL";
  if (name.includes("linear regression")) return "LINEAR_REGRESSION";
  if (name.includes("vwap")) return "VWAP";
  if (name.includes("supertrend") || name.includes("super trend")) return "SUPER_TREND";
  if (name.includes("awesome")) return "AWESOME_OSCILLATOR";
  if (name === "rsi" || name.includes("relative strength")) return "RSI";
  if (name.includes("macd")) return "MACD";
  if (name.includes("cci")) return "CCI";
  if (name.includes("adx")) return "ADX";
  if (name.includes("atr")) return "ATR";
  if (name.includes("williams")) return "WILLIAMS_R";
  if (name.includes("momentum")) return "MOMENTUM";
  if (name.includes("stochastic")) return "STOCHASTIC_OSCILLATOR";
  if (name.includes("osma")) return "OSMA";
  if (name.includes("accelerator")) return "ACCELERATOR_OSCILLATOR";
  if (name.includes("bull") || name.includes("elder ray")) return "BULLS_POWER";
  if (name.includes("demarker")) return "DEMARKER";
  if (name.includes("rate of change") || name === "roc") return "RATE_OF_CHANGE";
  if (name.includes("standard deviation")) return "STANDARD_DEVIATION";
  if (name.includes("variance")) return "VARIANCE";

  return indicator.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function getSettingsSummary(
  canonical: string,
  indicatorSettings: IndicatorSettingsMap
) {
  const definitions = INDICATOR_SETTING_DEFINITIONS[canonical] ?? [];
  const settings =
    indicatorSettings[canonical] ??
    DEFAULT_INDICATOR_SETTINGS[canonical] ??
    {};

  if (definitions.length === 0) return "";

  return definitions
    .map((definition) => settings[definition.key] ?? definition.min)
    .join(" ");
}

export default function TradingToolbar({
  timeframe,
  chartType,
  selectedTool,
  selectedIndicators,
  indicatorSettings = DEFAULT_INDICATOR_SETTINGS,
  timeframeOpen,
  indicatorsOpen,
  drawingOpen,
  onTimeframeToggle,
  onIndicatorsToggle,
  onDrawingToggle,
  onTimeframeChange,
  onChartTypeChange,
  onToolChange,
  onIndicatorToggle,
  onIndicatorSettingChange,
}: TradingToolbarProps) {
  const [modal, setModal] = React.useState<IndicatorModalState | null>(null);

  function openIndicatorSettings(label: string) {
    const canonical = normalizeIndicatorName(label);
    const definitions = INDICATOR_SETTING_DEFINITIONS[canonical] ?? [];

    const currentSettings =
      indicatorSettings[canonical] ??
      DEFAULT_INDICATOR_SETTINGS[canonical] ??
      {};

    const draft: Record<string, number> = {};

    definitions.forEach((definition) => {
      draft[definition.key] = Number(
        currentSettings[definition.key] ?? definition.min
      );
    });

    setModal({
      label,
      canonical,
      draft,
    });
  }

  function updateDraft(key: string, value: number) {
    if (!modal) return;

    setModal({
      ...modal,
      draft: {
        ...modal.draft,
        [key]: value,
      },
    });
  }

  function saveModal() {
    if (!modal) return;

    const definitions = INDICATOR_SETTING_DEFINITIONS[modal.canonical] ?? [];

    definitions.forEach((definition) => {
      const cleanValue = clampIndicatorValue(
        modal.canonical,
        definition.key,
        Number(modal.draft[definition.key])
      );

      onIndicatorSettingChange?.(modal.canonical, definition.key, cleanValue);
    });

    setModal(null);
  }

  function removeModalIndicator() {
    if (!modal) return;

    if (selectedIndicators.includes(modal.label)) {
      onIndicatorToggle(modal.label);
    }

    setModal(null);
  }

  return (
    <>
      <div className="nt-toolbar-left">
        <div className="nt-tool-wrap">
          <button type="button" className="nt-tool-btn" onClick={onTimeframeToggle}>
            📊 {timeframe}
          </button>

          {timeframeOpen && (
            <div className="nt-floating nt-timeframes">
              {TIMEFRAMES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={item === timeframe ? "active" : ""}
                  onClick={() => onTimeframeChange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" className="nt-tool-btn" onClick={onIndicatorsToggle}>
          Indicators
        </button>

        <button type="button" className="nt-tool-btn" onClick={onDrawingToggle}>
          ✎ {selectedTool}
        </button>

        <button type="button" className="nt-tool-btn compact">
          •••
        </button>
      </div>

      <div className="nt-chart-types">
        {(["Candlesticks", "Heiken Ashi", "Bars", "Line"] as ChartType[]).map(
          (item) => (
            <button
              key={item}
              type="button"
              className={item === chartType ? "active" : ""}
              onClick={() => onChartTypeChange(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      {indicatorsOpen && (
        <div
          className="nt-floating nt-indicators"
          style={{
            width: 430,
            maxHeight: 560,
            overflow: "auto",
            padding: 14,
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Indicators</h3>

          <div style={{ display: "grid", gap: 7 }}>
            {INDICATORS.map((indicator) => {
              const canonical = normalizeIndicatorName(indicator);
              const isActive = selectedIndicators.includes(indicator);
              const definitions = INDICATOR_SETTING_DEFINITIONS[canonical] ?? [];
              const summary = getSettingsSummary(canonical, indicatorSettings);

              return (
                <div
                  key={indicator}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isActive ? "1fr auto auto auto" : "1fr auto",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 9px",
                    border: "1px solid #e4ebf5",
                    borderRadius: 10,
                    background: isActive ? "#f8fbff" : "#ffffff",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onIndicatorToggle(indicator)}
                    style={{
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      cursor: "pointer",
                      fontWeight: 900,
                      color: "#101828",
                      display: "grid",
                      gap: 2,
                    }}
                  >
                    <span>
                      {isActive ? "✓ " : "+ "}
                      {indicator}
                    </span>

                    {isActive && summary && (
                      <small
                        style={{
                          color: "#667085",
                          fontWeight: 800,
                          fontSize: 11,
                        }}
                      >
                        {summary}
                      </small>
                    )}
                  </button>

                  {isActive && (
                    <button
                      type="button"
                      title="Visible"
                      style={{
                        border: "1px solid #d8e0ec",
                        background: "#ffffff",
                        borderRadius: 8,
                        width: 32,
                        height: 30,
                        cursor: "pointer",
                      }}
                    >
                      👁
                    </button>
                  )}

                  {isActive && definitions.length > 0 && (
                    <button
                      type="button"
                      title="Edit settings"
                      onClick={() => openIndicatorSettings(indicator)}
                      style={{
                        border: "1px solid #d8e0ec",
                        background: "#ffffff",
                        borderRadius: 8,
                        width: 32,
                        height: 30,
                        cursor: "pointer",
                      }}
                    >
                      ✎
                    </button>
                  )}

                  {isActive && (
                    <button
                      type="button"
                      title="Remove indicator"
                      onClick={() => onIndicatorToggle(indicator)}
                      style={{
                        border: "1px solid #f3c6c6",
                        background: "#fff5f5",
                        color: "#dc2626",
                        borderRadius: 8,
                        width: 32,
                        height: 30,
                        cursor: "pointer",
                        fontWeight: 900,
                      }}
                    >
                      ×
                    </button>
                  )}

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => onIndicatorToggle(indicator)}
                      style={{
                        border: "1px solid #d8e0ec",
                        background: "#ffffff",
                        borderRadius: 8,
                        width: 34,
                        height: 30,
                        cursor: "pointer",
                        fontWeight: 900,
                      }}
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {drawingOpen && (
        <div className="nt-floating nt-drawings">
          <h3>Drawing tools</h3>
          <div>
            {DRAWING_TOOLS.map((tool) => (
              <button
                key={tool}
                type="button"
                className={selectedTool === tool ? "active" : ""}
                onClick={() => onToolChange(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            background: "rgba(15, 23, 42, 0.28)",
            backdropFilter: "blur(2px)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
            }
          }}
        >
          <div
            style={{
              width: 500,
              maxWidth: "92vw",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "linear-gradient(180deg, #eef7ff 0%, #dcecff 100%)",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.30)",
              padding: 24,
              color: "#0f172a",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 950,
                  letterSpacing: "-0.03em",
                }}
              >
                {modal.label}
              </h2>

              <button
                type="button"
                onClick={() => setModal(null)}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: 36,
                  fontWeight: 950,
                  lineHeight: 1,
                  cursor: "pointer",
                  textShadow: "0 1px 4px rgba(0,0,0,0.18)",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <button
                type="button"
                style={{
                  height: 42,
                  padding: "0 34px",
                  borderRadius: 12,
                  border: "1px solid #72d7ff",
                  background: "#9be8ff",
                  color: "#ffffff",
                  fontWeight: 950,
                  fontSize: 16,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
                }}
              >
                Inputs
              </button>

              <button
                type="button"
                style={{
                  height: 42,
                  padding: "0 34px",
                  borderRadius: 12,
                  border: "1px solid rgba(15,23,42,0.22)",
                  background: "rgba(37,99,235,0.10)",
                  color: "#334155",
                  fontWeight: 950,
                  fontSize: 16,
                }}
              >
                Styles
              </button>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {(INDICATOR_SETTING_DEFINITIONS[modal.canonical] ?? []).map(
                (definition) => (
                  <label
                    key={definition.key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 150px",
                      alignItems: "center",
                      gap: 18,
                      fontSize: 18,
                      fontWeight: 950,
                      color: "#334155",
                    }}
                  >
                    <span>{definition.label}</span>

                    <input
                      type="number"
                      min={definition.min}
                      max={definition.max}
                      step={definition.step}
                      value={modal.draft[definition.key] ?? definition.min}
                      onChange={(event) =>
                        updateDraft(definition.key, Number(event.target.value))
                      }
                      style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 8,
                        border: "1px solid rgba(15,23,42,0.25)",
                        background: "#e8f5ff",
                        color: "#0f172a",
                        fontSize: 18,
                        fontWeight: 950,
                        padding: "0 14px",
                        outline: "none",
                        boxShadow: "inset 0 1px 2px rgba(15,23,42,0.08)",
                      }}
                    />
                  </label>
                )
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 36,
              }}
            >
              <button
                type="button"
                onClick={removeModalIndicator}
                style={{
                  height: 48,
                  padding: "0 26px",
                  borderRadius: 8,
                  border: "1px solid rgba(15,23,42,0.14)",
                  background: "rgba(30, 64, 175, 0.12)",
                  color: "#ffffff",
                  fontSize: 17,
                  fontWeight: 950,
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>

              <button
                type="button"
                onClick={() => setModal(null)}
                style={{
                  height: 48,
                  padding: "0 26px",
                  borderRadius: 8,
                  border: "1px solid rgba(239,68,68,0.28)",
                  background: "rgba(239,68,68,0.36)",
                  color: "#ffffff",
                  fontSize: 17,
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveModal}
                style={{
                  height: 48,
                  padding: "0 30px",
                  borderRadius: 8,
                  border: "1px solid rgba(6,182,212,0.35)",
                  background: "rgba(6,182,212,0.58)",
                  color: "#ffffff",
                  fontSize: 17,
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>

            <p
              style={{
                margin: "16px 0 0",
                color: "#64748b",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Minimum value is 1 for periods. Maximum value is 500 to prevent the chart from freezing.
            </p>
          </div>
        </div>
      )}
    </>
  );
}