import asyncio
import json
from typing import AsyncGenerator
from models import MatchEvent, MatchState, MatchScore, TeamStats

class MatchProcessor:
    """
    Manages shared match state and broadcasts events
    to all connected subscribers via asyncio pub/sub.
    """

    def __init__(self):
        self._state = MatchState()
        self._subscribers: list[asyncio.Queue] = []
        self._directions = {
            "liv": "left_to_right",
            "mci": "right_to_left"
        }

    # ------------------------------------------------------------------
    # Zone calculation
    # ------------------------------------------------------------------
    def get_zone(self, x: float, y: float, team_id: str) -> str:
        direction = self._directions.get(team_id, "left_to_right")
        in_box_height = 18 < y < 82

        if direction == "left_to_right":
            if x > 82 and in_box_height: return "offensive_box"
            if x < 18 and in_box_height: return "defensive_box"
            if x > 65:                   return "offensive_third"
            if x < 35:                   return "defensive_third"
        else:
            if x < 18 and in_box_height: return "offensive_box"
            if x > 82 and in_box_height: return "defensive_box"
            if x < 35:                   return "offensive_third"
            if x > 65:                   return "defensive_third"
        return "midfield"

    def _update_directions(self, period: int):
        if period == 2:
            self._directions = {
                "liv": "right_to_left",
                "mci": "left_to_right"
            }

    # ------------------------------------------------------------------
    # Stats calculation — uses all available event types
    # ------------------------------------------------------------------
    def _update_stats(self, event: MatchEvent):
        team = event.teamId
        if not team or team not in self._state.stats:
            return

        stats = self._state.stats[team]
        t = event.type
        outcome = event.details.get("outcome", event.outcome or "")

        if t == "pass":
            stats.passes += 1
        elif t == "shot":
            stats.shots += 1
            if outcome == "goal":       stats.shots_on_target += 1
            elif outcome == "saved":    stats.shots_on_target += 1
            elif outcome == "off_target": stats.shots_off_target += 1
            elif outcome == "blocked":  stats.shots_blocked += 1
            elif outcome == "woodwork": stats.shots_off_target += 1
        elif t == "goal":
            stats.goals += 1
            self._update_score(team)
        elif t == "tackle":
            stats.tackles += 1
        elif t == "interception":
            stats.interceptions += 1
        elif t == "foul":
            stats.fouls += 1
        elif t == "card":
            stats.cards += 1
        elif t == "corner":
            stats.corners += 1
        elif t == "save":
            stats.saves += 1

        self._update_possession()

    def _update_score(self, team: str):
        if team == "liv":
            self._state.score.liv += 1
        elif team == "mci":
            self._state.score.mci += 1

    def _update_possession(self):
        liv = self._state.stats["liv"].passes
        mci = self._state.stats["mci"].passes
        total = liv + mci
        if total > 0:
            self._state.stats["liv"].possession = round((liv / total) * 100, 1)
            self._state.stats["mci"].possession = round(100 - self._state.stats["liv"].possession, 1)

    # ------------------------------------------------------------------
    # Pub/Sub — multiple clients can subscribe
    # ------------------------------------------------------------------
    def subscribe(self) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers.append(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        if queue in self._subscribers:
            self._subscribers.remove(queue)

    async def _broadcast(self, event: MatchEvent):
        payload = json.dumps({
            **event.dict(),
            "score": self._state.score.dict(),
            "stats": {k: v.dict() for k, v in self._state.stats.items()}
        })
        for queue in self._subscribers:
            await queue.put(payload)

    # ------------------------------------------------------------------
    # Main stream runner — called once on startup
    # ------------------------------------------------------------------
    async def run(self, events: list[dict], commentary_fn, delay: float = 4.0):
        for raw in events:
            try:
                event = MatchEvent(**raw)
            except Exception as e:
                print(f"Event parse error: {e}")
                continue

            self._update_directions(event.period)
            event.calculatedZone = self.get_zone(
                event.location.x,
                event.location.y,
                event.teamId
            ) if event.teamId else "midfield"

            commentable = {
                "goal", "shot", "foul", "pass", "var",
                "tackle", "interception", "card",
                "substitution", "corner", "free_kick"
            }
            if event.type in commentable:
                event.commentary = await commentary_fn(event.dict(), event.calculatedZone)
            else:
                event.commentary = ""

            self._update_stats(event)
            self._state.events.append(event)
            self._state.current_minute = event.matchTime

            await self._broadcast(event)
            await asyncio.sleep(delay)

    def get_state(self) -> MatchState:
        return self._state


# Single shared instance
processor = MatchProcessor()
