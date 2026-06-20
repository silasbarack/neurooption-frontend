import type { ChartType } from "./trading.types";
import {
  BOTTOM_INDICATORS,
  DRAWING_TOOLS,
  OVERLAY_INDICATORS,
  TIMEFRAMES,
} from "./trading.constants";

type TradingToolbarProps = {
  timeframe: string;
  chartType: ChartType;
  selectedTool: string;
  selectedIndicators: string[];
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
};

function IndicatorGroup({
  title,
  items,
  selectedIndicators,
  onIndicatorToggle,
}: {
  title: string;
  items: string[];
  selectedIndicators: string[];
  onIndicatorToggle: (indicator: string) => void;
}) {
  return (
    <section className="nt-indicator-section">
      <h4>{title}</h4>

      <div>
        {items.map((indicator) => (
          <button
            key={indicator}
            type="button"
            className={selectedIndicators.includes(indicator) ? "active" : ""}
            onClick={() => onIndicatorToggle(indicator)}
          >
            {indicator}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function TradingToolbar({
  timeframe,
  chartType,
  selectedTool,
  selectedIndicators,
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
        <div className="nt-floating nt-indicators">
          <h3>Forex indicators</h3>

          <IndicatorGroup
            title="Overlay indicators on chart"
            items={OVERLAY_INDICATORS}
            selectedIndicators={selectedIndicators}
            onIndicatorToggle={onIndicatorToggle}
          />

          <IndicatorGroup
            title="Bottom indicators below chart"
            items={BOTTOM_INDICATORS}
            selectedIndicators={selectedIndicators}
            onIndicatorToggle={onIndicatorToggle}
          />
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