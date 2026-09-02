import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { useApp } from "@/lib/app-context";
import { CONDITION_LABEL, getTodayWeather, OUTFIT } from "@/lib/content";
import {
  bottomSize,
  fetchMeasurements,
  FIT_COPY,
  fitLabelKey,
  LAYERING_COPY,
  topSize,
  type PreferredFit,
} from "@/lib/measurements";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuraStyle AI — Your caring daily stylist" },
      {
        name: "description",
        content:
          "Warm, motherly outfit advice for today's weather, a smart family wardrobe, and gentle posture and workout guides — in English, Amharic and Afaan Oromoo.",
      },
      { property: "og:title", content: "AuraStyle AI — Your caring daily stylist" },
      {
        property: "og:description",
        content: "Daily weather-aware outfit advice with the warmth of a mother's care.",
      },
    ],
  }),
  component: Home,
});

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return "greetingMorning";
  if (h < 18) return "greetingAfternoon";
  return "greetingEvening";
}

function Home() {
  const { t, lang, profile, profileName } = useApp();
  const weather = getTodayWeather();
  const advice = OUTFIT[lang][profile][weather.condition];
  const { data: fit } = useQuery({
    queryKey: ["measurements", profile],
    queryFn: () => fetchMeasurements(profile),
  });
  const fitKey = fitLabelKey(fit?.preferred_fit ?? "regular") as PreferredFit;
  const copy = FIT_COPY[lang][profile];
  const layering = LAYERING_COPY[lang][weather.condition][fitKey];

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <p className="font-display text-2xl leading-snug font-semibold text-foreground">
          {t(greetingKey())} 🤍
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {profileName()} · {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-primary/90 to-accent p-5 text-primary-foreground shadow-warm-lg">
        <p className="text-[11px] font-medium tracking-widest uppercase opacity-80">{t("todayWeather")}</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="font-display text-4xl font-semibold">{weather.temp}°C</p>
            <p className="truncate text-sm opacity-90">{CONDITION_LABEL[lang][weather.condition]}</p>
          </div>
          <span className="shrink-0 text-5xl">{weather.icon}</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
          {[
            [t("feelsLike"), `${weather.feels}°C`],
            [t("humidity"), `${weather.humidity}%`],
            [t("wind"), `${weather.wind} km/h`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-primary-foreground/15 px-2 py-2">
              <p className="opacity-80">{label}</p>
              <p className="mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 shadow-warm">
        <h2 className="font-display text-lg font-semibold">{t("outfitTitle")}</h2>
        <ul className="mt-3 space-y-2">
          {advice.pieces.map((piece) => (
            <li key={piece} className="flex items-start gap-2.5 rounded-2xl bg-secondary px-3 py-2.5 text-sm">
              <span className="mt-0.5 text-base">🧷</span>
              <span className="leading-relaxed">{piece}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("whyTitle")}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{advice.why}</p>

        <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/8 p-4">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">{t("motherNote")}</p>
          <p className="mt-1.5 text-sm leading-relaxed italic text-foreground/85">{advice.note}</p>
        </div>

        <Link
          to="/wardrobe"
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm"
        >
          {t("navWardrobe")} →
        </Link>
      </section>
    </div>
  );
}
