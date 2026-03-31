# Live Match Dashboard - For Gaming Company

A real-time football analytics dashboard built for Gaming Company, featuring live AI-powered match commentary, tactical pitch tracking, and live match statistics for Liverpool vs Manchester City.

---

## Preview

**Light Mode**
- Live scoreboard with team photos and stadium background
- Real-time AI commentary feed with player names
- Tactical pitch view with ⚽ ball position tracker
- Possession bar and match stats

**Dark Mode**
- Full dark theme toggle accessible from the navbar

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
- 🔁 **Auto-reconnection** — SSE hook reconnects automatically with exponential backoff if connection drops

---

## Testing

Tests are written using **pytest** and cover the core `MatchProcessor` logic including zone calculations, stats tracking, score updates and possession calculations.

### Running the tests

```bash
# Run inside the Docker container
docker exec brain-analytics-api python -m pytest tests/ -v

# Generate an HTML report
docker exec brain-analytics-api python -m pytest tests/ -v --html=tests/report.html
```

### Test Results

Tests were run on **31 March 2026** using Python 3.11.15.

| Result | Total Tests | Failed | Skipped | Duration |
|--------|-------------|--------|---------|----------|
| ✅ Pass | 13 | 0 | 0 | 4ms |

### Test Coverage

| Test | Description | Result |
|------|-------------|--------|
| `test_offensive_box_left_to_right` | Ball in offensive box when Liverpool attack left to right | ✅ Passed |
| `test_offensive_third_left_to_right` | Ball in offensive third, Liverpool direction | ✅ Passed |
| `test_defensive_box_left_to_right` | Ball in defensive box, Liverpool direction | ✅ Passed |
| `test_defensive_third_left_to_right` | Ball in defensive third, Liverpool direction | ✅ Passed |
| `test_midfield` | Ball at centre pitch returns midfield zone | ✅ Passed |
| `test_offensive_box_right_to_left` | Man City offensive box (right to left direction) | ✅ Passed |
| `test_defensive_box_right_to_left` | Man City defensive box (right to left direction) | ✅ Passed |
| `test_directions_swap_second_half` | Teams switch ends correctly at half time | ✅ Passed |
| `test_corner_flag_position` | Edge coordinate (100, 0) returns valid zone | ✅ Passed |
| `test_unknown_team_defaults` | Unknown team ID defaults to midfield | ✅ Passed |
| `test_shot_on_target_increments` | Saved shot correctly increments shots on target | ✅ Passed |
| `test_goal_updates_score` | Goal event correctly updates team score | ✅ Passed |
| `test_possession_updates_with_passes` | Possession percentage calculated correctly from pass ratio | ✅ Passed |

### Key Findings

- **Zone calculation is accurate** across both team directions including the half-time switch
- **Stats tracking correctly differentiates** shot outcomes (on target, off target, blocked, woodwork)
- **Score state updates independently** per team without affecting the opponent
- **Possession calculation** is pass-ratio based and updates dynamically with each event
- **Edge cases handled** — unknown teams default safely to midfield, corner flag coordinates return a valid zone

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
│   ├── commentary.py       # OpenAI GPT-4o-mini commentary generation
│   ├── main.py             # FastAPI SSE stream + /state endpoint
│   ├── models.py           # Pydantic models for type-safe data handling
│   ├── processor.py        # MatchProcessor with pub/sub + zone + stats
│   ├── match_events.json   # Liverpool vs Man City full match data
│   ├── requirements.txt
│   └── tests/
│       ├── __init__.py
│       └── test_processor.py  # 13 pytest tests
├── app/
│   ├── app/
│   │   ├── page.tsx        # Main dashboard page
│   │   └── globals.css
│   ├── components/
│   │   ├── Feed.tsx        # Live commentary feed
│   │   ├── Pitch.tsx       # Tactical pitch view
│   │   ├── Scoreboard.tsx  # Live score header
│   │   └── Stats.tsx       # Full match stats panel
│   ├── hooks/
│   │   └── useMatchStream.ts  # SSE + reconnection + player name lookup
│   └── public/assets/      # Team logos, stadium images
├── docker-compose.yml
└── .env                    # API key (not committed)
```

---

## Styling

- **Framework:** Tailwind CSS + inline React styles
- **Font:** Inter (body), Plus Jakarta Sans (headings)
- **Colours:** Liverpool Red `#C8102E`, Man City Blue `#6CABDD`
- **Themes:** Full light and dark mode support

---

## Built By

**Malcolm Wiredu** — Full Stack Developer  
Takehome assignment for Brain Analytics

## Credits

- Dribbble for football theme styles
- Unsplash and Google for Football Images and Logo
- Previous Tailwind styles adapted from previous projects