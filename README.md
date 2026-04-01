#  [Deployed site here](https://brain-dash-frontend.onrender.com/)

#  Live Match Dashboard - For Gaming Company

A real-time football analytics dashboard built for a Gaming Company, featuring live AI-powered match commentary, tactical pitch tracking, and live match statistics for Liverpool vs Manchester City.

---

## Screenshots & UX Overview

The dashboard was designed with accessibility and readability as core principles, offering both a light and dark mode to suit different viewing environments and user preferences.

### Light Mode — Full Dashboard

![light-mode](https://github.com/user-attachments/assets/14e14cc1-b895-45ce-867b-ceecc42c09d4)



The light mode presents a clean, high-contrast layout suitable for daytime use or brightly lit environments. The white card system clearly separates each panel — commentary, pitch, and stats — making it easy to scan at a glance. Liverpool red and Man City blue are used consistently as team identifiers throughout every component, ensuring the viewer always knows which team is in possession or action without needing to read text.

---

### Dark Mode — Full Dashboard
![dark-mode](https://github.com/user-attachments/assets/f175e5f4-89d8-427e-8fa6-321bc294a1f0)



The dark mode uses deep navy and charcoal tones that reduce eye strain during extended viewing or evening use. All text meets WCAG AA contrast standards against the dark backgrounds. The toggle is accessible from the top-right navbar at any point. Both modes share identical layouts so there is no cognitive adjustment when switching between them.

---

### Live Commentary Feed

![commentary-feed](https://github.com/user-attachments/assets/7ca5bf20-438d-4c8d-9545-104faab02b64)



Each event card in the commentary feed is colour-coded by event type — green for passes and interceptions, red for fouls and cards, blue for tackles — providing instant visual context before the viewer reads the commentary text. Player name badges are coloured by team (Liverpool red, Man City blue). The most recent event is always highlighted at the top with a stronger border and background. Cards fade gently as they scroll down, reducing visual noise from older events while keeping them accessible for reference.

---

### Tactical Pitch View

![tactical-view](https://github.com/user-attachments/assets/64461adb-e2d0-4674-8857-a5b23314bc01)


The tactical view uses a real aerial stadium photograph as the pitch background, giving the viewer a sense of presence rather than an abstract diagram. A ⚽ football tracks the ball's x/y coordinates from the match data in real time, with a subtle pulse animation to draw the eye. The current event type is shown as a badge in the top-right corner, and a label at the bottom shows the exact event and player name — allowing the viewer to follow the flow of play spatially without relying purely on the commentary text.

---

### Possession & Match Stats

![stats](https://github.com/user-attachments/assets/e573e57d-bbb4-4bdc-8b2d-29cc543ea363)


The stats panel surfaces eight live metrics per team in a mirrored bar format — Liverpool stats on the left in red, Man City on the right in blue. This symmetrical layout makes comparisons instant. The possession bar at the top gives a quick overall impression of dominance, while the detailed rows below (Shots, On Target, Passes, Tackles, Interceptions, Fouls, Corners, Saves) allow deeper analysis. All bars animate smoothly as values update, providing a sense of momentum shifting throughout the match.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| AI Commentary | OpenAI GPT-4o-mini |
| Streaming | Server-Sent Events (SSE) |
| Infrastructure | Docker + Docker Compose |

---

## Prerequisites

Make sure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- An OpenAI API Key

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:brainanalytics/takehome-malcolm-wiredu.git
cd takehome-malcolm-wiredu
```

### 2. Set up your environment variable

Create a `.env` file in the root of the project:

```bash
echo "OPENAI_API_KEY=your-openai-key-here" > .env
```

Replace `your-openai-key-here` with a valid OpenAI API key.

> **Note:** The `.env` file is gitignored and will never be committed.

### 3. Build and run with Docker

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

This will spin up two containers:
- `brain-analytics-api` — FastAPI backend running on `http://localhost:8000`
- `brain-analytics-app` — Next.js frontend running on `http://localhost:3000`

### 4. Open the dashboard

Visit: **http://localhost:3000**

---

## How It Works

### Backend (`/api`)

- `main.py` — FastAPI app with a `/stream` SSE endpoint that streams match events every **4 seconds**
- `commentary.py` — Calls OpenAI GPT-4o-mini with real player names and match context to generate live commentary
- `processor.py` — Calculates pitch zones (offensive box, midfield etc.) from x/y coordinates
- `models.py` — Pydantic models for type-safe event parsing and match state management
- `match_events.json` — Full match data for Liverpool vs Manchester City (93 minutes, ~200+ events)

### Frontend (`/app`)

- `page.tsx` — Main dashboard layout with light/dark mode toggle
- `components/Scoreboard.tsx` — Live score with stadium background and team photos
- `components/Feed.tsx` — Commentary feed with colour-coded event cards and player names
- `components/Pitch.tsx` — Real pitch photo with ⚽ ball tracker overlay
- `components/Stats.tsx` — Possession bar and full match stats
- `hooks/useMatchStream.ts` — SSE hook with reconnection logic and state management

### AI Commentary

Each match event is sent to OpenAI with:
- The **real player name** (e.g. "Erling Haaland", "Mohamed Salah")
- The **team name** (Liverpool / Manchester City)
- The **pitch zone** (offensive box, midfield, defensive third etc.)
- **Recent context** from the last 3 events for continuity

The model returns a single punchy sentence of CBS Sports Golazo-style commentary.

---

## Features

- ⚽ **Live score** updates automatically as goals are streamed
- 📺 **AI commentary** for every key event — passes, tackles, goals, VAR, fouls
- 🗺️ **Tactical pitch** — real aerial stadium photo with ball position tracking
- 📊 **Live stats** — possession, shots on/off target, tackles, interceptions, fouls, corners, saves
- 🌙 **Dark/Light mode** toggle
- 🏃 **Player names** fully mapped for all 32 players across both squads
- 🔁 **Auto-reconnection** — SSE hook reconnects with exponential backoff if connection drops

---

## Testing

### Why Testing Matters Here

The `MatchProcessor` is the brain of this application — it calculates pitch zones from raw x/y coordinates, tracks stats for every event type, manages the live score, and computes possession percentages in real time. A bug in any of these calculations would silently produce incorrect data across the entire dashboard — wrong zones fed to the AI commentary, wrong scores displayed, inaccurate stats. Writing tests for this layer ensures the data pipeline is trustworthy before it ever reaches the frontend or OpenAI.

### Test Report

![report-html](https://github.com/user-attachments/assets/225a82aa-d8d6-4121-94e9-b43b9fad1d30)


The test suite was run on **31 March 2026** inside the Docker container using Python 3.11.15 with pytest 7.4.3. All 13 tests passed in 4ms with zero failures, skips or errors.

### Running the Tests

```bash
# Run inside the Docker container
docker exec brain-analytics-api python -m pytest tests/ -v

# Generate an HTML report
docker exec brain-analytics-api python -m pytest tests/ -v --html=tests/report.html
```

### Test Results Summary

| Result | Total Tests | Failed | Skipped | Duration |
|--------|-------------|--------|---------|----------|
| ✅ Pass | 13 | 0 | 0 | 4ms |

### Full Test Coverage

| Test | What It Verifies | Result |
|------|-----------------|--------|
| `test_offensive_box_left_to_right` | Ball in offensive box when Liverpool attack left to right | ✅ Passed |
| `test_offensive_third_left_to_right` | Ball in offensive third, Liverpool direction | ✅ Passed |
| `test_defensive_box_left_to_right` | Ball in defensive box, Liverpool direction | ✅ Passed |
| `test_defensive_third_left_to_right` | Ball in defensive third, Liverpool direction | ✅ Passed |
| `test_midfield` | Ball at centre pitch returns midfield zone | ✅ Passed |
| `test_offensive_box_right_to_left` | Man City offensive box (right to left direction) | ✅ Passed |
| `test_defensive_box_right_to_left` | Man City defensive box (right to left direction) | ✅ Passed |
| `test_directions_swap_second_half` | Teams switch ends correctly at half time | ✅ Passed |
| `test_corner_flag_position` | Edge coordinate (100, 0) returns a valid zone | ✅ Passed |
| `test_unknown_team_defaults` | Unknown team ID defaults safely to midfield | ✅ Passed |
| `test_shot_on_target_increments` | Saved shot correctly increments shots on target stat | ✅ Passed |
| `test_goal_updates_score` | Goal event correctly updates the scoring team's score | ✅ Passed |
| `test_possession_updates_with_passes` | Possession percentage is correctly calculated from pass ratio | ✅ Passed |

### Key Findings

- **Zone calculation is accurate** across both team directions including the half-time direction swap. Liverpool and Man City correctly swap their offensive and defensive zones when period 2 begins.
- **Stats tracking correctly differentiates** shot outcomes — a saved shot increments `shots_on_target`, an off-target shot increments `shots_off_target`, and a blocked shot increments `shots_blocked`. These are tracked independently rather than as a single shots counter.
- **Score state updates independently** per team — a Man City goal does not affect Liverpool's score and vice versa.
- **Possession calculation** is pass-ratio based and recalculates dynamically after every pass event, meaning it reflects the live balance of play rather than a static value.
- **Edge cases are handled gracefully** — an unknown team ID defaults to midfield rather than throwing an error, and a ball at the corner flag coordinates (100, 0) returns a valid zone without crashing.

---

## Restarting the Stream

The match stream replays from kick-off each time the server restarts. To replay:

```bash
docker compose down && docker compose up
```

---

## Useful Commands

```bash
# View API logs
docker compose logs api --tail=20

# View frontend logs
docker compose logs app --tail=20

# Full rebuild (if dependencies change)
docker compose build --no-cache && docker compose up

# Test the stream directly
curl -N http://localhost:8000/stream 2>/dev/null | head -10

# Run tests
docker exec brain-analytics-api python -m pytest tests/ -v
```

---

## Project Structure

```
takehome-malcolm-wiredu/
├── api/
│   ├── commentary.py          # OpenAI GPT-4o-mini commentary generation
│   ├── main.py                # FastAPI SSE stream + /state endpoint
│   ├── models.py              # Pydantic models for type-safe data handling
│   ├── processor.py           # MatchProcessor with pub/sub + zone + stats
│   ├── match_events.json      # Liverpool vs Man City full match data
│   ├── requirements.txt
│   └── tests/
│       ├── __init__.py
│       └── test_processor.py  # 13 pytest tests
├── app/
│   ├── app/
│   │   ├── page.tsx           # Main dashboard page
│   │   └── globals.css
│   ├── components/
│   │   ├── Feed.tsx           # Live commentary feed
│   │   ├── Pitch.tsx          # Tactical pitch view
│   │   ├── Scoreboard.tsx     # Live score header
│   │   └── Stats.tsx          # Full match stats panel
│   ├── hooks/
│   │   └── useMatchStream.ts  # SSE + reconnection + player name lookup
│   └── public/assets/         # Team logos, stadium images, screenshots
│       ├── light-mode.jpg
│       ├── dark-mode.jpg
│       ├── commentary-feed.jpg
│       ├── tactical-view.jpg
│       ├── stats.jpg
│       └── report-html.jpg
├── docker-compose.yml
└── .env                       # API key (not committed)
```

---

## Styling

- **Framework:** Tailwind CSS + inline React styles
- **Font:** Inter (body), Plus Jakarta Sans (headings)
- **Colours:** Liverpool Red `#C8102E`, Man City Blue `#6CABDD`
- **Themes:** Full light and dark mode support with WCAG AA contrast compliance

---

## Built By

**Malcolm Wiredu** — Full Stack Developer  
Full Stack Application For Gaming Company

## Credits

- Dribbble for football theme styles
- Unsplash and Google for Football Images and Logo
- Previous Tailwind styles adapted from previous projects
