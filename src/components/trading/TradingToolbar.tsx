import React from "react";
import type { ChartType } from "./trading.types";
import { DRAWING_TOOLS, INDICATORS, TIMEFRAMES } from "./trading.constants";
import {
  DEFAULT_INDICATOR_SETTINGS,
  DEFAULT_INDICATOR_STYLES,
  INDICATOR_SETTING_DEFINITIONS,
  INDICATOR_STYLE_DEFINITIONS,
  type IndicatorSettingsMap,
  type IndicatorStylesMap,
} from "./indicator-settings";

type TradingToolbarProps = {
  timeframe: string;
  chartType: ChartType;
  selectedTool: string;
  selectedIndicators: string[];
  indicatorSettings?: IndicatorSettingsMap;
  indicatorStyles?: IndicatorStylesMap;
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
    value: number,
  ) => void;
  onIndicatorStyleChange?: (
    indicator: string,
    key: string,
    value: string | number | boolean,
  ) => void;
};

function normalizeIndicatorName(indicator: string) {
  const name = indicator.trim().toLowerCase();

  if (name === "moving average" || name === "ma" || name === "simple ma") return "SMA";
  if (name.includes("exponential")) return "EMA";
  if (name.includes("weighted")) return "WMA";
  if (name.includes("alligator")) return "ALLIGATOR";
  if (name.includes("bollinger")) return "BOLLINGER_BANDS";
  if (name.includes("parabolic") || name.includes("sar")) return "PARABOLIC_SAR";
  if (name.includes("ichimoku")) return "ICHIMOKU";
  if (name.includes("donchian")) return "DONCHIAN_CHANNEL";
  if (name.includes("envelope")) return "ENVELOPES";
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
  if (name.includes("bull")) return "BULLS_POWER";
  if (name.includes("demarker")) return "DEMARKER";
  if (name.includes("rate of change") || name === "roc") return "RATE_OF_CHANGE";

  return indicator.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function displayIndicatorTitle(indicator: string) {
  const canonical = normalizeIndicatorName(indicator);

  if (canonical === "RATE_OF_CHANGE") return "Rate of Change";
  if (canonical === "AWESOME_OSCILLATOR") return "Awesome Oscillator";
  if (canonical === "ACCELERATOR_OSCILLATOR") return "Accelerator Oscillator";
  if (canonical === "STOCHASTIC_OSCILLATOR") return "Stochastic Oscillator";
  if (canonical === "WILLIAMS_R") return "Williams %R";
  if (canonical === "BOLLINGER_BANDS") return "Bollinger Bands";
  if (canonical === "PARABOLIC_SAR") return "Parabolic SAR";
  if (canonical === "DONCHIAN_CHANNEL") return "Donchian Channel";

  return indicator;
}

export default function TradingToolbar({
  timeframe,
  chartType,
  selectedTool,
  selectedIndicators,
  indicatorSettings = DEFAULT_INDICATOR_SETTINGS,
  indicatorStyles = DEFAULT_INDICATOR_STYLES,
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
  onIndicatorStyleChange,
}: TradingToolbarProps) {
  const [editingIndicator, setEditingIndicator] = React.useState<string | null>(null);
  const [activeEditorTab, setActiveEditorTab] = React.useState<"inputs" | "styles">(
    "inputs",
  );
  const [draftSettings, setDraftSettings] = React.useState<Record<string, number>>({});
  const [draftStyles, setDraftStyles] = React.useState<
    Record<string, string | number | boolean>
  >({});

  const editingCanonical = editingIndicator
    ? normalizeIndicatorName(editingIndicator)
    : null;

  function openEditor(indicator: string) {
    const canonical = normalizeIndicatorName(indicator);

    setEditingIndicator(indicator);
    setActiveEditorTab("inputs");
    setDraftSettings({
      ...(DEFAULT_INDICATOR_SETTINGS[canonical] ?? {}),
      ...(indicatorSettings[canonical] ?? {}),
    });
    setDraftStyles({
      ...(DEFAULT_INDICATOR_STYLES[canonical] ?? {}),
      ...(indicatorStyles[canonical] ?? {}),
    });
  }

  function closeEditor() {
    setEditingIndicator(null);
    setActiveEditorTab("inputs");
    setDraftSettings({});
    setDraftStyles({});
  }

  function saveEditor() {
    if (!editingCanonical) return;

    Object.entries(draftSettings).forEach(([key, value]) => {
      onIndicatorSettingChange?.(editingCanonical, key, Number(value));
    });

    Object.entries(draftStyles).forEach(([key, value]) => {
      onIndicatorStyleChange?.(editingCanonical, key, value);
    });

    closeEditor();
  }

  function removeEditingIndicator() {
    if (!editingIndicator) return;

    if (selectedIndicators.includes(editingIndicator)) {
      onIndicatorToggle(editingIndicator);
    }

    closeEditor();
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
          ),
        )}
      </div>

      {indicatorsOpen && (
        <div
          className="nt-floating nt-indicators"
          style={{ width: 410, maxHeight: 560, overflow: "auto" }}
        >
          <h3>Indicators</h3>

          <div style={{ display: "grid", gap: 6 }}>
            {INDICATORS.map((indicator) => {
              const active = selectedIndicators.includes(indicator);
              const canonical = normalizeIndicatorName(indicator);
              const hasInputs =
                (INDICATOR_SETTING_DEFINITIONS[canonical] ?? []).length > 0;
              const hasStyles =
                (INDICATOR_STYLE_DEFINITIONS[canonical] ?? []).length > 0;

              return (
                <div
                  key={indicator}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 34px",
                    gap: 6,
                    alignItems: "center",
                    borderBottom: "1px solid #eef2f7",
                    paddingBottom: 5,
                  }}
                >
                  <button
                    type="button"
                    className={active ? "active" : ""}
                    onClick={() => onIndicatorToggle(indicator)}
                    style={{ width: "100%", justifyContent: "flex-start" }}
                  >
                    {active ? "✓ " : "+ "}
                    {displayIndicatorTitle(indicator)}
                  </button>

                  <button
                    type="button"
                    title="Edit indicator settings"
                    onClick={() => {
                      if (!active) onIndicatorToggle(indicator);
                      if (hasInputs || hasStyles) openEditor(indicator);
                    }}
                    style={{
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #d7e1ee",
                      background: active ? "#e0f2fe" : "#f8fafc",
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                  >
                    ✎
                  </button>
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

      {editingIndicator && editingCanonical && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            background: "rgba(15, 23, 42, 0.22)",
            backdropFilter: "blur(2px)",
          }}
        >
          <div
            style={{
              width: "min(430px, calc(100vw - 30px))",
              borderRadius: 16,
              padding: 22,
              background: "linear-gradient(180deg, #5f86b1, #486c96)",
              color: "#ffffff",
              boxShadow: "0 25px 80px rgba(15, 23, 42, 0.35)",
              border: "1px solid rgba(255,255,255,0.24)",
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
              <h2 style={{ margin: 0, fontSize: 22 }}>
                {displayIndicatorTitle(editingIndicator)}
              </h2>

              <button
                type="button"
                onClick={closeEditor}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: 34,
                  lineHeight: 1,
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setActiveEditorTab("inputs")}
                style={{
                  height: 42,
                  minWidth: 110,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.45)",
                  background: activeEditorTab === "inputs" ? "#7dd3fc" : "transparent",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Inputs
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab("styles")}
                style={{
                  height: 42,
                  minWidth: 110,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.45)",
                  background: activeEditorTab === "styles" ? "#7dd3fc" : "transparent",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Styles
              </button>
            </div>

            {activeEditorTab === "inputs" && (
              <div style={{ display: "grid", gap: 14, minHeight: 210 }}>
                {(INDICATOR_SETTING_DEFINITIONS[editingCanonical] ?? []).map(
                  (definition) => (
                    <label
                      key={definition.key}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 145px",
                        gap: 14,
                        alignItems: "center",
                        fontSize: 16,
                        fontWeight: 900,
                      }}
                    >
                      <span>{definition.label}</span>

                      <input
                        type="number"
                        min={definition.min}
                        max={definition.max}
                        step={definition.step}
                        value={
                          draftSettings[definition.key] ??
                          DEFAULT_INDICATOR_SETTINGS[editingCanonical]?.[
                            definition.key
                          ] ??
                          definition.min
                        }
                        onChange={(event) =>
                          setDraftSettings((current) => ({
                            ...current,
                            [definition.key]: Number(event.target.value),
                          }))
                        }
                        style={{
                          height: 42,
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.5)",
                          background: "#2f669c",
                          color: "#ffffff",
                          padding: "0 12px",
                          fontSize: 16,
                          fontWeight: 900,
                        }}
                      />
                    </label>
                  ),
                )}

                {(INDICATOR_SETTING_DEFINITIONS[editingCanonical] ?? []).length ===
                  0 && <p>No input settings for this indicator yet.</p>}
              </div>
            )}

            {activeEditorTab === "styles" && (
              <div style={{ display: "grid", gap: 14, minHeight: 210 }}>
                {(INDICATOR_STYLE_DEFINITIONS[editingCanonical] ?? []).map(
                  (definition) => {
                    const value =
                      draftStyles[definition.key] ??
                      DEFAULT_INDICATOR_STYLES[editingCanonical]?.[definition.key];

                    if (definition.type === "checkbox") {
                      return (
                        <label
                          key={definition.key}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "32px 1fr",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 16,
                            fontWeight: 900,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(event) =>
                              setDraftStyles((current) => ({
                                ...current,
                                [definition.key]: event.target.checked,
                              }))
                            }
                            style={{ width: 22, height: 22 }}
                          />
                          <span>{definition.label}</span>
                        </label>
                      );
                    }

                    if (definition.type === "color") {
                      return (
                        <label
                          key={definition.key}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 95px",
                            alignItems: "center",
                            gap: 14,
                            fontSize: 16,
                            fontWeight: 900,
                          }}
                        >
                          <span>{definition.label}</span>

                          <input
                            type="color"
                            value={String(value ?? "#ffffff")}
                            onChange={(event) =>
                              setDraftStyles((current) => ({
                                ...current,
                                [definition.key]: event.target.value,
                              }))
                            }
                            style={{
                              width: 72,
                              height: 42,
                              border: "1px solid rgba(255,255,255,0.45)",
                              borderRadius: 8,
                              background: "#2f669c",
                              padding: 4,
                            }}
                          />
                        </label>
                      );
                    }

                    return (
                      <label
                        key={definition.key}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 120px",
                          alignItems: "center",
                          gap: 14,
                          fontSize: 16,
                          fontWeight: 900,
                        }}
                      >
                        <span>{definition.label}</span>

                        <input
                          type="number"
                          min={definition.min}
                          max={definition.max}
                          step={definition.step}
                          value={Number(value ?? definition.min ?? 1)}
                          onChange={(event) =>
                            setDraftStyles((current) => ({
                              ...current,
                              [definition.key]: Number(event.target.value),
                            }))
                          }
                          style={{
                            height: 42,
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.5)",
                            background: "#2f669c",
                            color: "#ffffff",
                            padding: "0 12px",
                            fontSize: 16,
                            fontWeight: 900,
                          }}
                        />
                      </label>
                    );
                  },
                )}

                {(INDICATOR_STYLE_DEFINITIONS[editingCanonical] ?? []).length ===
                  0 && <p>No style settings for this indicator yet.</p>}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                onClick={removeEditingIndicator}
                style={{
                  height: 42,
                  minWidth: 95,
                  border: "none",
                  borderRadius: 8,
                  background: "rgba(30, 41, 59, 0.28)",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>

              <button
                type="button"
                onClick={closeEditor}
                style={{
                  height: 42,
                  minWidth: 95,
                  border: "none",
                  borderRadius: 8,
                  background: "#b86b87",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEditor}
                style={{
                  height: 42,
                  minWidth: 95,
                  border: "none",
                  borderRadius: 8,
                  background: "#1796a6",
                  color: "#ffffff",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
