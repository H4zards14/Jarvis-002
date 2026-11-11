export interface Mod {
  uniqueName: string;
  name: string;
  description: string;
  imageName?: string;
  type: string;
  category: string;
  polarity?: string;
  baseDrain?: number;
  fusionLimit?: number;
}

export async function getMods(): Promise<Mod[]> {
  const response = await fetch("https://api.warframestat.us/mods?language=en");

  if (!response.ok) {
    throw new Error("Failed to fetch Mods");
  }

  return response.json();
}
