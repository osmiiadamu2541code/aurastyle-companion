import { useState } from "react";

import { useApp } from "@/lib/app-context";
import type { ProfileId } from "@/lib/i18n";
import {
  COLOR_CHOICES,
  ICON_CHOICES,
  OCCASIONS,
  SEASONS,
  TILE_COLORS,
  type NewItem,
} from "@/lib/wardrobe";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: NewItem) => Promise<void>;
};

export function UploadModal({ open, onClose, onSave }: Props) {
  const { t, profile, profileName } = useApp();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICON_CHOICES[0]!);
  const [color, setColor] = useState(COLOR_CHOICES[0]!);
  const [season, setSeason] = useState<string>("allseason");
  const [occasion, setOccasion] = useState<string>("casual");
  const [care, setCare] = useState("");
  const [fitNote, setFitNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [askWhose, setAskWhose] = useState(false);

  if (!open) return null;

  const reset = () => {
    setName("");
    setCare("");
    setFitNote("");
    setIcon(ICON_CHOICES[0]!);
    setColor(COLOR_CHOICES[0]!);
    setSeason("allseason");
    setOccasion("casual");
    setAskWhose(false);
    setSaving(false);
  };

  const commit = async (target: ProfileId) => {
    setSaving(true);
    try {
      await onSave({
        profile: target,
        name: name.trim(),
        icon,
        color,
        season,
        occasion,
        fabric_care: care.trim(),
        fit_note: fitNote.trim(),
      });
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const submit = () => {
    if (!name.trim()) return;
    // Disambiguation: Usman's closet is the shared/ambiguous context.
    if (profile === "usman") {
      setAskWhose(true);
      return;
    }
    void commit(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 px-0 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-5 shadow-warm-lg sm:rounded-3xl">
        {askWhose ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/12 text-2xl">🤍</div>
            <h2 className="mt-3 font-display text-xl font-semibold">{t("askWhose")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("askWhoseBody")}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                disabled={saving}
                onClick={() => void commit("wife")}
                className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-60"
              >
                {t("forWife")}
              </button>
              <button
                disabled={saving}
                onClick={() => void commit("mother")}
                className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
              >
                {t("forMother")}
              </button>
              <button
                disabled={saving}
                onClick={() => void commit("usman")}
                className="rounded-2xl border border-border px-4 py-3 text-sm font-medium disabled:opacity-60"
              >
                {t("keepMine")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">{t("newItem")}</h2>
              <button onClick={onClose} className="rounded-full bg-secondary px-3 py-1 text-xs">
                {t("cancel")}
              </button>
            </div>

            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("pickIcon")}</label>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {ICON_CHOICES.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`grid h-10 w-10 place-items-center rounded-xl border text-lg ${
                    icon === i ? "border-primary bg-primary/12" : "border-border bg-secondary"
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full bg-linear-to-br ${TILE_COLORS[c]} border-2 ${
                    color === c ? "border-primary" : "border-transparent"
                  }`}
                  aria-label={c}
                />
              ))}
            </div>

            <div className="mb-3 flex items-center gap-3 rounded-2xl bg-secondary p-3">
              <div className={`grid h-16 w-16 place-items-center rounded-xl bg-linear-to-br ${TILE_COLORS[color]} text-3xl`}>
                {icon}
              </div>
              <p className="text-xs text-muted-foreground">{t("photo")}</p>
            </div>

            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("name")}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              className="mb-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("filterSeason")}</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                >
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>
                      {t(s)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("filterOccasion")}</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                >
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>
                      {t(o)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("care")}</label>
            <textarea
              value={care}
              onChange={(e) => setCare(e.target.value)}
              placeholder={t("carePlaceholder")}
              rows={3}
              className="mb-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />

            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {t("fitNoteLabel")} <span className="text-[10px] opacity-70">({t("optional")})</span>
            </label>
            <input
              value={fitNote}
              onChange={(e) => setFitNote(e.target.value)}
              placeholder={t("fitNotePlaceholder")}
              className="mb-4 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />


            <button
              onClick={submit}
              disabled={!name.trim() || saving}
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-50"
            >
              {saving ? t("saving") : `${t("save")} · ${profileName()}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
