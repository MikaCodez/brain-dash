from pydantic import BaseModel
from typing import Optional, Literal
from enum import Enum

class EventType(str, Enum):
    whistle = "whistle"
    kickoff = "kickoff"
    pass_ = "pass"
    shot = "shot"
    goal = "goal"
    tackle = "tackle"
    foul = "foul"
    card = "card"
    var = "var"
    corner = "corner"
    free_kick = "free_kick"
    interception = "interception"
    substitution = "substitution"
    save = "save"
    offside = "offside"
    dribble = "dribble"
    block = "block"
    ball_recovery = "ball_recovery"
    goal_kick = "goal_kick"
    throw_in = "throw_in"
    out_of_play = "out_of_play"

class Location(BaseModel):
    x: float
    y: float

class MatchEvent(BaseModel):
    id: str
    type: str
    timestamp: str
    matchTime: str
    period: int
    teamId: Optional[str] = None
    playerId: Optional[str] = None
    location: Location
    outcome: Optional[str] = None
    details: dict = {}
    calculatedZone: Optional[str] = None
    commentary: Optional[str] = ""

class TeamStats(BaseModel):
    passes: int = 0
    shots: int = 0
    shots_on_target: int = 0
    shots_off_target: int = 0
    shots_blocked: int = 0
    goals: int = 0
    tackles: int = 0
    interceptions: int = 0
    fouls: int = 0
    cards: int = 0
    corners: int = 0
    saves: int = 0
    possession: float = 50.0

class MatchScore(BaseModel):
    liv: int = 0
    mci: int = 0

class MatchState(BaseModel):
    score: MatchScore = MatchScore()
    stats: dict[str, TeamStats] = {
        "liv": TeamStats(),
        "mci": TeamStats()
    }
    events: list[MatchEvent] = []
    current_minute: str = "00:00"
    period: int = 1
