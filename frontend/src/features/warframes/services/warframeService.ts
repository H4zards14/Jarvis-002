export interface Warframe {
  uniqueName: string;
  name: string;
  description: string;
  health: number;
  shield: number;
  armor: number;
  masteryReq: number;
  sprintSpeed: number;
  imageName?: string;
}
export async function getWarframes(): Promise<Warframe[]> {
  const response = await fetch(
    "https://api.warframestat.us/warframes?language=en",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Warframes");
  }

  return response.json();
}
