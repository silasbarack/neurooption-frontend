import { ASSETS } from "./trading.constants";
import type { Asset, AssetCategory } from "./trading.types";

type AssetSelectorProps = {
  assets?: Asset[];
  selectedAsset: Asset;
  activeCategory: AssetCategory;
  open: boolean;
  onToggle: () => void;
  onCategoryChange: (category: AssetCategory) => void;
  onAssetChange: (asset: Asset) => void;
};

export default function AssetSelector({
  assets = ASSETS,
  selectedAsset,
  activeCategory,
  open,
  onToggle,
  onCategoryChange,
  onAssetChange,
}: AssetSelectorProps) {
  const categories = Array.from(
    new Set(assets.map((asset) => asset.category))
  ) as AssetCategory[];

  const filteredAssets = assets.filter(
    (asset) => asset.category === activeCategory
  );

  return (
    <div className="nt-asset-selector">
      <button type="button" className="nt-asset-trigger" onClick={onToggle}>
        <span>{selectedAsset.symbol}</span>
        <b>⌄</b>
      </button>

      {open && (
        <div className="nt-asset-menu">
          <div className="nt-asset-tabs">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? "active" : ""}
                onClick={() => onCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="nt-asset-list">
            {filteredAssets.map((asset) => (
              <button
                key={asset.symbol}
                type="button"
                className={asset.symbol === selectedAsset.symbol ? "active" : ""}
                onClick={() => onAssetChange(asset)}
              >
                <strong>{asset.symbol}</strong>
                <span>
                  {asset.label} • Payout boost {asset.payoutBoost}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}