import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PROFILE_ICONS } from "@/lib/profile-icons";
import { fetchAvatar, removeAvatar, uploadAvatar } from "@/lib/avatars";
import { useApp } from "@/lib/app-context";

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export function AvatarPicker() {
  const { t, profile, profileName } = useApp();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    setLocalPreview(null);
  }, [profile]);

  const { data: avatar } = useQuery({
    queryKey: ["avatar", profile],
    queryFn: () => fetchAvatar(profile),
  });

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["avatar", profile] });
    void qc.invalidateQueries({ queryKey: ["avatars"] });
  };

  const upload = useMutation({
    mutationFn: (file: File) => uploadAvatar(profile, file),
    onSuccess: () => {
      refresh();
      toast.success(t("avatarSaved"));
    },
    onError: () => toast.error("Something went wrong, let's try again."),
  });

  const clear = useMutation({
    mutationFn: () => removeAvatar(profile),
    onSuccess: () => {
      refresh();
      setLocalPreview(null);
      toast.success(t("avatarRemoved"));
    },
    onError: () => toast.error("Something went wrong, let's try again."),
  });

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error(t("photoTooBig"));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
    upload.mutate(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section className="mt-4 flex items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-warm">
      {localPreview || avatar?.url ? (
        <img
          src={localPreview ?? avatar?.url ?? ""}
          alt={profileName()}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-primary/40 object-cover"
        />
      ) : (
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-linear-to-br from-primary/25 to-accent/25 text-3xl">
          {PROFILE_ICONS[profile]}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{t("avatarTitle")}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{t("avatarHint")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={upload.isPending || clear.isPending}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-warm disabled:opacity-60"
          >
            {upload.isPending ? t("savingAvatar") : `📷 ${localPreview || avatar?.url ? t("changeAvatar") : t("addAvatar")}`}
          </button>
          {localPreview || avatar?.url ? (
            <button
              type="button"
              onClick={() => clear.mutate()}
              disabled={clear.isPending}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground disabled:opacity-60"
            >
              {t("removeAvatar")}
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        aria-label={t("addAvatar")}
        onChange={onPick}
        className="hidden"
      />
    </section>
  );
}
