import { supabase } from "@/integrations/supabase/client";
import type { Lang, ProfileId } from "./i18n";

export type WardrobeItem = {
  id: string;
  profile: string;
  name: string;
  name_am: string | null;
  name_om: string | null;
  icon: string;
  color: string;
  season: string;
  occasion: string;
  fabric_care: string;
  fit_note: string;
  image_url: string;
  photo_url?: string | null;
  created_at: string;
};

export type NewItem = {
  profile: ProfileId;
  name: string;
  icon: string;
  color: string;
  season: string;
  occasion: string;
  fabric_care: string;
  fit_note: string;
  image_url?: string;
  photoFile?: File | null;
};


export const SEASONS = ["summer", "winter", "rainy", "allseason"] as const;
export const OCCASIONS = ["casual", "work", "formal", "event"] as const;

export const ICON_CHOICES = ["👕", "👔", "👗", "👚", "🧥", "👖", "🩳", "🧣", "🧤", "👞", "👟", "👠", "🧢", "👒", "🧶", "🥼"];

export const TILE_COLORS: Record<string, string> = {
  coral: "from-coral/45 to-honey/25",
  honey: "from-honey/50 to-cream/40",
  sand: "from-sand/60 to-cream/40",
  clay: "from-clay/45 to-honey/25",
  dusk: "from-dusk/40 to-clay/25",
  sky: "from-sky/45 to-cream/40",
  stone: "from-stone/45 to-sand/35",
  cream: "from-cream/70 to-sand/40",
};

export const COLOR_CHOICES = Object.keys(TILE_COLORS);

export function itemName(item: WardrobeItem, lang: Lang) {
  if (lang === "am") return item.name_am ?? item.name;
  if (lang === "om") return item.name_om ?? item.name;
  return item.name;
}

export async function fetchWardrobe(profile: ProfileId): Promise<WardrobeItem[]> {
  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("profile", profile)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as WardrobeItem[];
}

export async function addWardrobeItem(item: NewItem): Promise<WardrobeItem> {
  const { data, error } = await supabase.from("wardrobe_items").insert(item).select().single();
  if (error) throw error;
  return data as WardrobeItem;
}

export async function deleteWardrobeItem(id: string): Promise<void> {
  const { error } = await supabase.from("wardrobe_items").delete().eq("id", id);
  if (error) throw error;
}
