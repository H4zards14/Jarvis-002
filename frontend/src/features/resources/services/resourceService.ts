export interface Resource {
  uniqueName: string;
  name: string;
  description: string;
  imageName?: string;
  type: string;
  category: string;
}

const excludedResources = [
  "Hexsyndicatedogtag",
  "Bioplasma",
  "Cephalite Resonance",
  "Cerulean Fungus Extract",
  "Cortichrome",
  "Entratifragmentbase",
  "Entratilabdogtag",
  "Genericdojocolorpigment",
  "Plantitem",
  "Skateweed Extract",
  "Technocyte Coda Token",
  "Zarimandogtag",
];

const normalizeName = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export async function getResources(): Promise<Resource[]> {
  const response = await fetch("https://api.warframestat.us/items?language=en");

  if (!response.ok) {
    throw new Error("Failed to fetch Resources");
  }

  const items: Resource[] = await response.json();

  return items
    .filter((item) => item.category === "Resources")
    .filter((item) => {
      const itemNames = [item.name, item.uniqueName, item.imageName ?? ""].map(
        normalizeName,
      );

      return !excludedResources.some((excluded) =>
        itemNames.includes(normalizeName(excluded)),
      );
    });
}
