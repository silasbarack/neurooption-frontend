import type { ChartType } from "./trading.types";
import { DRAWING_TOOLS, INDICATORS, TIMEFRAMES } from "./trading.constants";
import {
  DEFAULT_INDICATOR_SETTINGS,
  INDICATOR_SETTING_DEFINITIONS,
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

  return indicator.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
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
          style={{ width: 420, maxHeight: 560, overflow: "auto" }}
        >
          <h3>Indicators</h3>

          <div>
            {INDICATORS.map((indicator) => {
              const canonical = normalizeIndicatorName(indicator);
              const isActive = selectedIndicators.includes(indicator);
              const definitions = INDICATOR_SETTING_DEFINITIONS[canonical] ?? [];
              const settings =
                indicatorSettings[canonical] ??
                DEFAULT_INDICATOR_SETTINGS[canonical] ??
                {};

              return (
                <div
                  key={indicator}
                  style={{
                    borderBottom: "1px solid #eef2f7",
                    padding: "6px 0",
                  }}
                >
                  <button
                    type="button"
                    className={isActive ? "active" : ""}
                    onClick={() => onIndicatorToggle(indicator)}
                    style={{ width: "100%" }}
                  >
                    {isActive ? "✓ " : "+ "}
                    {indicator}
                  </button>

                  {isActive && definitions.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gap: 6,
                        padding: "7px 6px 2px",
                        background: "#f8fafc",
                        borderRadius: 8,
                        marginTop: 5,
                      }}
                    >
                      {definitions.map((definition) => (
                        <label
                          key={`${canonical}-${definition.key}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 92px",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#334155",
                          }}
                        >
                          <span>
                            {definition.label} ({definition.min} -{" "}
                            {definition.max})
                          </span>

                          <input
                            type="number"
                            min={definition.min}
                            max={definition.max}
                            step={definition.step}
                            value={settings[definition.key] ?? definition.min}
                            onChange={(event) =>
                              onIndicatorSettingChange?.(
                                canonical,
                                definition.key,
                                Number(event.target.value)
                              )
                            }
                            style={{
                              width: "100%",
                              height: 30,
                              border: "1px solid #d8e0ec",
                              borderRadius: 7,
                              padding: "0 8px",
                              fontWeight: 900,
                              color: "#0f172a",
                            }}
                          />
                        </label>
                      ))}
                    </div>
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
    </>
  );
}