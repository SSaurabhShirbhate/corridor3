# 🎨 Portfolio ITOM — Master To-Do List

> **Cel:** Dopieścić portfolio do poziomu **AWWWARDS SOTD / FWA** — zero kompromisów.  
> **Data startu:** 2026-02-13  
> **Stack:** React + Three.js (R3F) + GSAP + Vite

---

## 🔴 Priorytet 1 — Krytyczne błędy i brakujące funkcjonalności

### 1. Naprawić wyciekające chmury z About do Corridor
- [X] Zbadać `SkyChunk.jsx` — obecny `CORRIDOR_CLIP_Z = -8` nie trzyma, chmury "uciekają" do korytarza
- [X] Rozważyć dodanie clippingu per-kamera zamiast stałego Z-threshold
- [X] Dodać testy wizualne — wejście/wyjście z About w obie strony
- **Pliki:** [SkyChunk.jsx](file:///src'ów | 🟠 |

---

## ⏱ Sugerowana kolejność pracy

```
Tydzień 1: #1 (chmury) → #2 (monitory) → #4 (dekoracje korytarza)
Tydzień 2: #3 (awards) → #5 (czytelność grafik) → #6 (B&W→kolor hover)
Tydzień 3: #7 (tutorial) → #10 (prawdziwy content) → #11 (performance)
Tydzień 4: #9 (easter eggs) → #13 (microinterakcje) → #8 (dźwięki)
Na koniec: #12 (accessibility) → Final QA
```
