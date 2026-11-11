export interface Relic {
  name: string;
  uniqueName: string;
  image: string;
  vaultInfo: {
    vaulted: boolean;
  };
}

interface RelicsApiEntry {
  _id: string;
  tier: string;
  relicName: string;
  state: string;
}

interface RelicsApiResponse {
  relics: RelicsApiEntry[];
}

interface MarketItem {
  slug: string;
  i18n?: {
    en?: {
      icon?: string;
      thumb?: string;
    };
  };
}

interface MarketItemsResponse {
  data: MarketItem[];
}

const RELICS_API = "https://drops.warframestat.us/data/relics.json";

const MARKET_ITEMS_API = "https://api.warframe.market/v2/items";

const MARKET_IMAGES = "https://warframe.market/static/assets/";

export async function getRelics(): Promise<Relic[]> {
  // Load the Relics first. This is the required request.
  const relicResponse = await fetch(RELICS_API);

  if (!relicResponse.ok) {
    throw new Error("Failed to load Relics.");
  }

  const relicData = (await relicResponse.json()) as RelicsApiResponse;

  // Try loading marketplace artwork separately.
  // If this request fails, the Relics can still load.
  let marketItems: MarketItem[] = [];

  try {
    const marketResponse = await fetch(MARKET_ITEMS_API);

    if (marketResponse.ok) {
      const marketData = (await marketResponse.json()) as MarketItemsResponse;

      marketItems = marketData.data || [];
    }
  } catch {
    console.warn("Marketplace artwork could not be loaded.");
  }

  return relicData.relics.map((relic) => {
    const marketSlug = `${relic.tier}_${relic.relicName}_relic`.toLowerCase();

    const matchingItem = marketItems.find((item) => item.slug === marketSlug);

    const imagePath =
      matchingItem?.i18n?.en?.icon || matchingItem?.i18n?.en?.thumb;

    return {
      name: `${relic.tier} ${relic.relicName} ${relic.state}`,
      uniqueName: relic._id,
      image: imagePath
        ? `${MARKET_IMAGES}${imagePath.replace(/^\/+/, "")}`
        : "",
      vaultInfo: {
        vaulted: false,
      },
    };
  });
}
