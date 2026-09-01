import { createFileRoute } from "@tanstack/react-router";

import { useApp } from "@/lib/app-context";
import { POSTURE, WORKOUTS } from "@/lib/content";

export const Route = createFileRoute("/aurafit")({
  head: () => ({
    meta: [
      { title: "AuraFit — Posture guides & gentle workouts" },
      {
        name: "description",
        content:
          "Step-by-step desk, standing and phone-neck posture guides plus three complete home workout routines with reps, sets and timing.",
      },
      { property: "og:title", content: "AuraFit — Posture guides & gentle workouts" },
      {
        property: "og:description",
        content: "Posture guides and three full home workout routines, explained step by step.",
      },
    ],
  }),
  component: AuraFit,
});

function AuraFit() {
  const { t, lang } = useApp();
  const guides = POSTURE[lang];
  const workouts = WORKOUTS[lang];

  return (
    <div className="space-y-5 px-4 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("fitTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("fitSub")}</p>
      </div>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("postureTitle")}
        </h2>
        <div className="space-y-3">
          {guides.map((g) => (
            <article key={g.id} className="rounded-3xl border border-border bg-card p-5 shadow-warm">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/30 text-xl">
                  {g.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base leading-snug font-semibold">{g.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{g.intro}</p>
                </div>
              </div>

              <p className="mt-4 text-[11px] font-semibold tracking-widest text-primary uppercase">{t("steps")}</p>
              <ol className="mt-2 space-y-2">
                {g.steps.map((s, i) => (
                  <li key={s} className="flex gap-2.5 text-sm leading-relaxed">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/12 text-[11px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 rounded-2xl bg-secondary p-3">
                <p className="text-[11px] font-semibold tracking-wide text-secondary-foreground uppercase">
                  {t("tips")}
                </p>
                <ul className="mt-1.5 space-y-1.5">
                  {g.tips.map((tip) => (
                    <li key={tip} className="flex gap-2 text-xs leading-relaxed text-foreground/80">
                      <span>🤍</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {t("workoutTitle")}
        </h2>
        <div className="space-y-3">
          {workouts.map((w) => (
            <article key={w.id} className="rounded-3xl border border-border bg-card p-5 shadow-warm">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-xl">
                  {w.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base leading-snug font-semibold">{w.title}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    ⏱ {t("duration")}: {w.duration} · {t("level")}: {w.level}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-foreground/80">{w.intro}</p>

              <ul className="mt-3 space-y-2">
                {w.exercises.map((ex) => (
                  <li key={ex.name} className="rounded-2xl bg-secondary p-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                      <p className="truncate text-sm font-semibold">{ex.name}</p>
                      <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {ex.dose}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{ex.how}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
