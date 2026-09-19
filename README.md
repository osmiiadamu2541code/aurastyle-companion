# AuraStyle Companion

Build a mobile-first web app called "AuraStyle AI" — a personal stylist app with a warm, motherly-care tone.

TECH & THEME
- React + Tailwind, mobile-first responsive layout
- "Warm Sunset" color theme: warm oranges, corals, soft golds, cream backgrounds — cozy and inviting, not corporate
- Copy throughout should sound warm, caring, encouraging (like a mother giving advice), never robotic

HEADER (persistent, on every tab)
- Language switcher: EN, Amharic (አማርኛ), Afaan Oromoo — actually translate all UI text and content copy when switched, don't just relabel the button
- Profile switcher: Usman, Wife, Mother, Kids — switching profile changes the wardrobe items shown and personalizes tone/content for that person

TAB 1 — HOME
- Empathetic daily weather + outfit advice card: show a (mock/simulated) current weather condition and temperature, and a warm written recommendation of what to wear today tailored to that weather and the active profile
- Should feel like real, complete content — actual outfit suggestions with reasoning, not lorem ipsum or "coming soon"

TAB 2 — SMART WARDROBE
- Full photo grid of wardrobe items (use nice placeholder clothing images/icons, populate with realistic sample items per profile — at least 8-10 items per profile)
- Category filters: by Season (Summer/Winter/Rainy etc.) and by Occasion (Casual/Work/Formal/Event etc.) — filters must actually filter the grid
- Upload Modal: lets user add a new item with photo, name, category, season, occasion, and a "fabric care" field (washing/ironing instructions) — fully functional, adds to the grid
- Delete button on each item that removes it from the wardrobe
- Disambiguation pop-up: when uploading/adding an item while "Usman" profile (or an ambiguous context) is active, show a confirmation popup asking "Is this item for your wife or mother?" before assigning it to that profile's wardrobe

TAB 3 — AURAFIT
- Posture guides: real written guide content with clear step-by-step instructions and tips (at least 2-3 posture guides, e.g. desk posture, standing posture, phone-neck posture)
- Workout routines: at least 3 real complete workout routines with exercise lists, reps/sets/duration, and short instructions

GENERAL RULES
- No placeholder text, no "Coming soon", no empty states without real content — every tab and feature must be fully working with real, complete sample data
- Bottom tab navigation for Home / Smart Wardrobe / AuraFit, mobile app feel throughout

Please set up Lovable Cloud if needed to store wardrobe items and profile data persistently (so uploads/deletes actually persist), rather than just local component state.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/52d2c8c2-b384-421b-99f0-22283e5df7d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
