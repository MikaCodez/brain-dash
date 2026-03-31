# Brain Analytics — Live Match Dashboard

A real-time football analytics dashboard built for Brain Analytics, featuring live AI-powered match commentary, tactical pitch tracking, and live match statistics for Liverpool vs Manchester City.

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
- `match_events.json` — Full match data for Liverpool vs Manchester City (93 minutes, ~200+ events)

### Frontend (`/app`)

- `page.tsx` — Main dashboard layout with light/dark mode toggle
- `components/Scoreboard.tsx` — Live score with stadium background and team photos
- `components/Feed.tsx` — Commentary feed with colour-coded event cards and player names
- `components/Pitch.tsx` — Real pitch photo with ⚽ ball tracker overlay
- `components/Stats.tsx` — Possession bar and match stats
- `hooks/useMatchStream.ts` — SSE hook that connects to the backend stream and manages state

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
- 📊 **Live stats** — possession percentage and shot/pass counts for both teams
- 🌙 **Dark/Light mode** toggle
- 🏃 **Player names** fully mapped for all 32 players across both squads

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
```

---

## Project Structure

```
takehome-malcolm-wiredu/
├── api/
│   ├── commentary.py       # OpenAI GPT-4o-mini commentary generation
│   ├── main.py             # FastAPI SSE stream endpoint
│   ├── processor.py        # Pitch zone calculator
│   ├── match_events.json   # Liverpool vs Man City full match data
│   └── requirements.txt
├── app/
│   ├── app/
│   │   ├── page.tsx        # Main dashboard page
│   │   └── globals.css
│   ├── components/
│   │   ├── Feed.tsx        # Live commentary feed
│   │   ├── Pitch.tsx       # Tactical pitch view
│   │   ├── Scoreboard.tsx  # Live score header
│   │   └── Stats.tsx       # Possession & match stats
│   ├── hooks/
│   │   └── useMatchStream.ts  # SSE + player name lookup
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

- Dribble for football theme styles
- Unsplash and Google for Football Images and Logo
- Previous tailwind styles used from previous projects
