# Workout Tracker

A personal fitness tracker + motivation tool. Dark-themed, mobile-first, no auth needed.

## Setup

```bash
npm install
```

Create a `.env` file in the project root:

```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get an API key at [console.anthropic.com](https://console.anthropic.com).

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

| Tab | Description |
|-----|-------------|
| **Home** | Streak, motivational quote, quick-start CTAs, weekly progress |
| **5-min starter** | Timer-based micro session (40s on / 20s rest) |
| **Log** | Log Day A/B/C with pre-filled exercises, all fields editable |
| **Weight** | Log bodyweight, line chart over time |
| **History** | All sessions, expandable, streak heatmap |
| **Progress** | Volume chart per exercise, % change stats |
| **Coach** | AI coaching via Claude — overload suggestions, form tips |

## Data

All data is stored in `localStorage`. Nothing leaves your browser except the AI coaching request (which sends your last 5 sessions + weight history to Claude).
