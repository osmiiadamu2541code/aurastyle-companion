import { supabase } from "@/integrations/supabase/client";
import type { Lang, ProfileId } from "./i18n";

export type PreferredFit = "relaxed" | "regular" | "fitted";

export const PREFERRED_FITS: PreferredFit[] = ["relaxed", "regular", "fitted"];

export type Measurements = {
  id: string;
  profile: string;
  height_cm: number | null;
  weight_kg: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  shoulder_cm: number | null;
  inseam_cm: number | null;
  preferred_fit: string;
  comfort_needs: string;
  posture_notes: string;
  mobility_notes: string;
  created_at: string;
  updated_at: string;
};

export type MeasurementsDraft = {
  height_cm: number | null;
  weight_kg: number | null;
  chest_cm: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  shoulder_cm: number | null;
  inseam_cm: number | null;
  preferred_fit: string;
  comfort_needs: string;
  posture_notes: string;
  mobility_notes: string;
};

export async function fetchMeasurements(profile: ProfileId): Promise<Measurements | null> {
  const { data, error } = await supabase
    .from("profile_measurements")
    .select("*")
    .eq("profile", profile)
    .maybeSingle();
  if (error) throw error;
  return (data as Measurements | null) ?? null;
}

export async function saveMeasurements(profile: ProfileId, draft: MeasurementsDraft): Promise<Measurements> {
  const { data, error } = await supabase
    .from("profile_measurements")
    .upsert({ profile, ...draft }, { onConflict: "profile" })
    .select()
    .single();
  if (error) throw error;
  return data as Measurements;
}

/** Friendly letter size derived from a chest/bust or waist measurement in cm. */
function letterSize(cm: number | null, offset = 0): string | null {
  if (!cm) return null;
  const v = cm + offset;
  if (v < 82) return "XS";
  if (v < 90) return "S";
  if (v < 98) return "M";
  if (v < 108) return "L";
  if (v < 118) return "XL";
  return "XXL";
}

export function topSize(m: Measurements | null): string | null {
  if (!m) return null;
  const ease = m.preferred_fit === "relaxed" ? 4 : m.preferred_fit === "fitted" ? -3 : 0;
  return letterSize(m.chest_cm, ease);
}

export function bottomSize(m: Measurements | null): string | null {
  if (!m) return null;
  const ease = m.preferred_fit === "relaxed" ? 4 : m.preferred_fit === "fitted" ? -3 : 0;
  return letterSize(m.waist_cm ? m.waist_cm + 8 : null, ease);
}

/** Warm, per-profile fit guidance in every language. */
type FitCopy = { silhouette: string; posture: string; comfort: string };

export const FIT_COPY: Record<Lang, Record<ProfileId, FitCopy>> = {
  en: {
    usman: {
      silhouette:
        "With 100 cm across the chest and a 46 cm shoulder, a regular cut sits best on you — a shirt that skims the chest and ends just past the hip, never boxy, never pulling at the buttons.",
      posture:
        "Because your shoulders drift forward at the desk, choose shirts with a real shoulder seam sitting on the bone and a slightly longer back hem. They quietly pull you upright all day.",
      comfort:
        "Breathable cotton and linen, and a collar with one finger of room. Your 80 cm inseam means trousers should break softly on the shoe, not pool at the ankle.",
    },
    wife: {
      silhouette:
        "A 92 cm bust with a 72 cm waist gives you a lovely defined line — fitted tops, waist-marked dresses and high-rise trousers that finish at your 74 cm inseam.",
      posture:
        "You carry yourself beautifully upright, so open necklines and set-in sleeves show that line off instead of hiding it. Avoid heavy shoulder padding; you don't need it.",
      comfort:
        "Keep sleeves generous enough to reach and lift all day, and slip a soft cotton layer under anything woollen so nothing scratches your skin.",
    },
    mother: {
      silhouette:
        "Relaxed and gentle suits you, Emaye — 104 cm bust and 110 cm hip love a softly draped front, an A-line skirt and a tunic that falls straight without clinging.",
      posture:
        "With a gentle curve at the upper back, a higher back neckline and a front that drapes rather than buttons tight will sit smooth and feel easy all day.",
      comfort:
        "Front-opening pieces are simplest to dress in, seams should be flat and soft, and hems below the knee keep those knees warm on cold mornings.",
    },
    kids: {
      silhouette:
        "At 132 cm tall with a 70 cm chest, a relaxed cut with a little growing room is perfect — nothing tight at the shoulder, sleeves that can be turned up once.",
      posture:
        "Still growing fast, so nothing should pinch the shoulders or hold the arms in. Free arms mean free climbing.",
      comfort:
        "Elastic waists and easy necklines they can manage alone, flat seams and no scratchy tags — that's the whole secret to a happy morning.",
    },
  },
  am: {
    usman: {
      silhouette:
        "የደረት 100 ሴ.ሜ እና የትከሻ 46 ሴ.ሜ ስላለህ መደበኛ ልኬት ይስማማሃል — ደረትን ሳይጫን የሚያልፍ፣ ከወገብ ትንሽ ወርዶ የሚያልቅ ሸሚዝ ምረጥ።",
      posture:
        "ጠረጴዛ ላይ ስትሠራ ትከሻህ ወደፊት ስለሚያዘነብል፣ የትከሻ ስፌቱ በአጥንቱ ላይ የሚያርፍና ጀርባው ትንሽ ረዘም ያለ ሸሚዝ ልበስ። ቀኑን ሙሉ ቀጥ አድርጎ ይይዝሃል።",
      comfort:
        "አየር የሚያስተላልፍ ጥጥና በፍታ፣ አንገትጌውም አንድ ጣት የሚያስገባ ይሁን። የ80 ሴ.ሜ የእግር ልኬትህ ሱሪው ጫማ ላይ በቀስታ እንዲያርፍ ይጠይቃል።",
    },
    wife: {
      silhouette:
        "የ92 ሴ.ሜ ደረትና የ72 ሴ.ሜ ወገብ ውብ መስመር ይሰጡሻል — ተጣጣፊ ላይኛ ልብሶች፣ ወገብን የሚያሳዩ ቀሚሶችና ከፍ ያለ ወገብ ያላቸው ሱሪዎች ይስማሙሻል።",
      posture:
        "አቋቋምሽ ቀጥ ያለና ውብ ስለሆነ፣ ክፍት አንገትና በትክክል የተሰፉ እጅጌዎች ያንን መስመር ያሳያሉ። የከበደ የትከሻ ንጣፍ አያስፈልግሽም።",
      comfort:
        "እጅጌዎቹ ቀኑን ሙሉ ለመንቀሳቀስ የሚያመቹ ይሁኑ፤ ከሱፍ ልብስ በታች ለስላሳ የጥጥ ልብስ አድርጊ — ቆዳሽ አይቧጨርም።",
    },
    mother: {
      silhouette:
        "እማዬ፣ ሰፋ ያለና ልል ልብስ ይስማማሻል — የ104 ሴ.ሜ ደረትና የ110 ሴ.ሜ ዳሌ ለስላሳ ወራጅ ፊት፣ ኤ-መስመር ቀሚስና ሳይጣበቅ የሚወርድ ቀሚስ ይወዳሉ።",
      posture:
        "የላይኛው ጀርባሽ ትንሽ ስለሚጠምዘዝ፣ ከፍ ያለ የጀርባ አንገትና ወራጅ ፊት ያለው ልብስ ተመችቶ ይቀመጣል።",
      comfort:
        "ከፊት የሚከፈቱ ልብሶች ለመልበስ ቀላል ናቸው፤ ስፌቶቹ ጠፍጣፋና ለስላሳ ይሁኑ፤ ከጉልበት በታች የሚደርስ ርዝመት ጉልበቶችሽን በቀዝቃዛ ጠዋት ያሞቃል።",
    },
    kids: {
      silhouette:
        "132 ሴ.ሜ ቁመትና 70 ሴ.ሜ ደረት ስላላቸው፣ ትንሽ የእድገት ቦታ የሚሰጥ ሰፋ ያለ ልብስ ተስማሚ ነው — ትከሻ ላይ የማይጠብ፣ አንዴ የሚታጠፍ እጅጌ።",
      posture: "እያደጉ ስለሆኑ ትከሻቸውን የሚጫን ወይም እጃቸውን የሚገድብ ልብስ አይሁን። ነፃ እጅ ነፃ ጨዋታ ነው።",
      comfort: "ላስቲክ ወገብና ራሳቸው ሊለብሱት የሚችሉት አንገት፣ ጠፍጣፋ ስፌትና የማይቧጭር መለያ — የተረጋጋ ጠዋት ሚስጥር ይኸው ነው።",
    },
  },
  om: {
    usman: {
      silhouette:
        "Laphee 100 sm fi gatiittii 46 sm waan qabduuf safartuun idilee sitti tola — shamiizii laphee hin dhiibne, mudhii irraa xiqqoo gadi bu'ee dhaabbatu filadhu.",
      posture:
        "Minjaala irratti hojjechuun gatiittiin kee gara fuulduraatti waan gadi bu'uuf, hodhaan gatiittii lafee irra taa'uu fi dugdi xiqqoo dheeraa ta'e filadhu. Guyyaa guutuu qajeelaa si dhaaba.",
      comfort:
        "Jirbii fi liinan qilleensa dabarsu, morma keessattis qubni tokko haa galu. Safartuun miilla kee 80 sm waan ta'eef, kofoon suuta kophee irra haa bu'u.",
    },
    wife: {
      silhouette:
        "Laphee 92 sm fi mudhii 72 sm sarara bareedaa siif kennu — uffata gubbaa sitti dhiyaatu, kittaa mudhii agarsiisuu fi kofoo mudhii ol ka'aa.",
      posture:
        "Dhaabbiin kee qajeelaa fi bareedaa waan ta'eef, morma banaa fi harkiin sirriitti hodhame sarara sana agarsiisu. Gatiittii irratti waan ulfaataa hin barbaachisu.",
      comfort:
        "Harkii guyyaa guutuu socho'uuf mijatu haa ta'u; uffata suufii jala uffata jirbii lallaafaa uffadhu — gogaan kee hin cirriqfamu.",
    },
    mother: {
      silhouette:
        "Haadha koo, uffanni bal'aa fi laafaan sitti tola — laphee 104 sm fi teessuma 110 sm fuula suuta gadi bu'u, kittaa A-sarara fi uffata utuu hin maxxanin gadi bu'u jaallatu.",
      posture:
        "Dugdi kee gubbaan xiqqoo waan gooree, morma dugdaa ol ka'aa fi fuula suuta gadi bu'u qabu mijataadha.",
      comfort:
        "Uffanni fuula duraan banamu uffachuuf salphaadha; hodhaan diriiraa fi lallaafaa haa ta'u; dheerinni jilba gadi ganna keessa jilba kee ho'isa.",
    },
    kids: {
      silhouette:
        "Dheerina 132 sm fi laphee 70 sm waan qabaniif, uffanni bal'aan iddoo guddinaa xiqqoo qabu filatamaadha — gatiittii irratti hin dhiibu, harkis al tokko marfamuu danda'a.",
      posture: "Ammayyuu guddachaa waan jiraniif, wanti gatiittii dhiibu ykn harka hidhu hin barbaachisu. Harki bilisa ta'e taphas bilisa taasisa.",
      comfort:
        "Mudhii laastikii fi morma ofumaan uffachuu danda'an, hodhaa diriiraa fi mallattoo hin cirriqne — icciitiin ganama nagaa isuma.",
    },
  },
};

export const LAYERING_COPY: Record<Lang, Record<"sunny" | "rainy" | "chilly", Record<PreferredFit, string>>> = {
  en: {
    sunny: {
      relaxed: "Keep everything loose and single-layered today so air can move freely against the skin.",
      regular: "One light layer is plenty — leave a little room at the sleeve so the heat can escape.",
      fitted: "Fitted is fine in this heat as long as the fabric is light; skip anything lined.",
    },
    rainy: {
      relaxed: "Layer a roomy shell over your usual pieces — easy to shrug off the moment you're indoors.",
      regular: "Two layers, the outer one water-repellent and slightly wider so it doesn't cling when damp.",
      fitted: "Wear the fitted piece underneath and let the outer layer be the loose, protective one.",
    },
    chilly: {
      relaxed: "Two soft layers with room between them hold warmth far better than one heavy coat.",
      regular: "A knit layer under a structured coat keeps the shape neat while trapping warm air.",
      fitted: "A fine fitted base layer plus a coat with room to move keeps you warm without bulk.",
    },
  },
  am: {
    sunny: {
      relaxed: "ዛሬ ሁሉንም ልል አድርግ — አየር በቆዳ ላይ በነፃነት ይንቀሳቀስ።",
      regular: "አንድ ቀላል ሽፋን በቂ ነው — በእጅጌው ትንሽ ቦታ ተው፣ ሙቀት ይውጣ።",
      fitted: "ጨርቁ ቀላል እስከሆነ ድረስ ተጣጣፊ ልብስ አይጎዳም፤ ውስጠ-ሽፋን ያለውን ግን ተው።",
    },
    rainy: {
      relaxed: "ሰፋ ያለ የዝናብ ጃኬት ከላይ ልበስ — ወደ ውስጥ ስትገባ በቀላሉ ታወልቀዋለህ።",
      regular: "ሁለት ሽፋን፣ የውጪው ውሃ የማያሳልፍና ትንሽ ሰፋ ያለ ይሁን።",
      fitted: "ተጣጣፊውን ውስጥ አድርግ፣ የውጪው ልል እና ጠባቂ ይሁን።",
    },
    chilly: {
      relaxed: "በመካከላቸው ቦታ ያላቸው ሁለት ለስላሳ ሽፋኖች ከአንድ ወፍራም ኮት በላይ ያሞቃሉ።",
      regular: "ከኮት በታች የሹራብ ሽፋን ቅርፁን ሳያበላሽ ሙቀት ይይዛል።",
      fitted: "ቀጭን ተጣጣፊ የውስጥ ልብስና ለመንቀሳቀስ የሚያመች ኮት ሳያከብድ ያሞቃል።",
    },
  },
  om: {
    sunny: {
      relaxed: "Har'a hunda bal'aa fi tokkicha godhi — qilleensi gogaa irra bilisaan haa socho'u.",
      regular: "Uffanni salphaan tokko ni ga'a — harka irratti iddoo xiqqoo dhiisi, ho'i haa ba'u.",
      fitted: "Huccuun salphaa yoo ta'e uffanni sitti dhiyaatu rakkoo hin qabu; kan keessa qabu dhiisi.",
    },
    rainy: {
      relaxed: "Uffata bokkaa bal'aa irraan uffadhu — yeroo ol seentu salphaatti baafatta.",
      regular: "Uffata lama, kan alaa bishaan hin dabarsine fi xiqqoo bal'aa haa ta'u.",
      fitted: "Kan sitti dhiyaatu keessaan uffadhu, kan alaa bal'aa fi eegdu haa ta'u.",
    },
    chilly: {
      relaxed: "Uffanni lallaafaan lamaa gidduu isaanii iddoo qabu, kootii tokko ulfaataa caalaa si ho'isa.",
      regular: "Uffata suufii kootii jalatti uffachuun bocasaa hin balleessu, ho'as qaba.",
      fitted: "Uffanni keessaa haphiin fi kootiin socho'uuf mijatu utuu si hin ulfeessin si ho'isa.",
    },
  },
};

export function fitLabelKey(fit: string): string {
  return PREFERRED_FITS.includes(fit as PreferredFit) ? fit : "regular";
}
