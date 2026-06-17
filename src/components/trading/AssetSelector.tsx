import type { Asset, AssetCategory } from "./trading.types";
import { ASSET_CATEGORIES, ASSETS } from "./trading.constants";

type AssetSelectorProps = {
  selectedAsset: Asset;
  activeCategory: AssetCategory;
  open: boolean;
  onToggle: () => void;
  onCategoryChange: (category: AssetCategory) => void;
  onAssetChange: (asset: Asset) => void;
};

export default function AssetSelector({
  selectedAsset,
  activeCategory,
  open,
  onToggle,
  onCategoryChange,
  onAssetChange,
}: AssetSelectorProps) {
  return (
    <div className="nt-asset-selector">
      <button type="button" className="nt-asset-trigger" onClick={onToggle}>
        <span>{selectedAsset.symbol}</span>
        <strong>⌄</strong>
      </button>

      {open && (
        <div className="nt-asset-menu">
          <div className="nt-asset-tabs">
            {ASSET_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? "active" : ""}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="nt-asset-list">
            {ASSETS.filter((asset) => asset.category === activeCategory).map((asset) => (
              <button
                key={asset.symbol}
                type="button"
                className={asset.symbol === selectedAsset.symbol ? "active" : ""}
                onClick={() => onAssetChange(asset)}
              >
                <strong>{asset.symbol}</strong>
                <span>{asset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}