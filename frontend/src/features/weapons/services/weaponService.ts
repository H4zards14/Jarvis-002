export interface Weapon {
  uniqueName: string;
  name: string;
  description: string;
  imageName?: string;
  type: string;
  category: string;
  masteryReq: number;
}

export async function getWeapons(): Promise<Weapon[]> {
  const response = await fetch(
    "https://api.warframestat.us/weapons?language=en",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Weapons");
  }

  return response.json();
}
