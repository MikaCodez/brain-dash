# Football Commentary Assignment

## Overview

Your task is to build a real-time football commentary feed using a provided stream of match events. You will be parsing a JSON file containing a comprehensive list of events from a fictional high-scoring thriller between Liverpool and Manchester City.

## Data Source: `match_events.json`

The file contains a single JSON object with:

- `matchId`, `date`, `venue`: Metadata.
- `teams`: Array of two team objects, including players (starting XI + subs).
- `events`: An array of chronological event objects.

### Event Object Structure

Each event in the `events` array represents a single action on the pitch:

```json
{
  "id": "uuid-string",
  "type": "pass",
  "timestamp": "2024-05-15T15:23:12Z",
  "matchTime": "23:12",
  "period": 1,
  "teamId": "liv",
  "playerId": "liv_66",
  "location": { "x": 65.5, "y": 88.2 },
  "outcome": "successful",
  "details": {
    "receiverId": "liv_11"
  }
}
```

### Key Fields

- **`type`**: The kind of event (`pass`, `shot`, `foul`, `card`, `goal`, `kickoff`, `whistle`, `var`, etc.).
- **`matchTime`**: The display time (MM:SS).
- **`location`**: The `x, y` coordinates of the event.

## Coordinate System & Zones

The pitch is represented on a 2D plane:

- **X-axis (0-100)**: Length of the pitch.
  - `0`: Left goal line.
  - `50`: Halfway line.
  - `100`: Right goal line.
- **Y-axis (0-100)**: Width of the pitch.
  - `0`: Top touchline.
  - `100`: Bottom touchline.

### Zones (To Be Calculated)

You must implement logic to classify events into zones based on their `location` coordinates:

- **`defensive_box`**: Inside the team's own penalty area.
  - If attacking Left -> Right: `X < 18` and `18 < Y < 82`.
  - If attacking Right -> Left: `X > 82` and `18 < Y < 82`.
- **`defensive_third`**: The third closest to the team's own goal.
  - If attacking Left -> Right: `X < 35`.
  - If attacking Right -> Left: `X > 65`.
- **`midfield`**: The middle battleground (`35 < X < 65`).
- **`offensive_third`**: The third closest to the opponent's goal.
  - If attacking Left -> Right: `X > 65`.
  - If attacking Right -> Left: `X < 35`.
- **`offensive_box`**: Inside the opponent's penalty area.
  - If attacking Left -> Right: `X > 82` and `18 < Y < 82`.
  - If attacking Right -> Left: `X < 18` and `18 < Y < 82`.

## Assignment Requirements

1.  **Event Feed**: Display the events in a list as they "happen" (you can simulate real-time playback).
2.  **Zone Classification**: You must dynamically determine the zone (e.g., "offensive_third") for each event based on its coordinates.
3.  **Scoreboard & State Management**:
    - The raw data does **not** include the match score. You must implement a state engine to calculate it live based on the event stream.
4.  **Commentary Engine**:
    - Generate commentary text for key events using the event type, player, and calculated zone (e.g., "Trent Alexander-Arnold passes from the midfield.").
    - **API Usage**: You will be provided with an OpenAI API key separately. You **MUST** use this key for commentary generation.
    - **Model Restriction**: The key is restricted to the `gpt-4o-mini` model. You are **strictly prohibited** from using any other model.
    - Highlight goals and cards.
    - _Bonus_: Generate more descriptive text for sequences (e.g., "Great build-up play ending in a shot!").
5.  **Stats Dashboard**: Show live stats (Possession, Shots, Passes) that update as events come in.

## Setup

1.  Use `match_events.json` as your data source.
2.  **Backend**: Use **FastAPI** to serve the event stream.
3.  **Frontend**: Use React to display the commentary feed and visualize the events in real-time.
4.  Get creative with the presentation!

Good luck!
