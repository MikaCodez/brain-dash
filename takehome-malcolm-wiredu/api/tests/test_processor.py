import pytest
from processor import MatchProcessor

@pytest.fixture
def proc():
    return MatchProcessor()

# --- Offensive zones ---
def test_offensive_box_left_to_right(proc):
    assert proc.get_zone(85, 50, "liv") == "offensive_box"

def test_offensive_third_left_to_right(proc):
    assert proc.get_zone(70, 10, "liv") == "offensive_third"

# --- Defensive zones ---
def test_defensive_box_left_to_right(proc):
    assert proc.get_zone(10, 50, "liv") == "defensive_box"

def test_defensive_third_left_to_right(proc):
    assert proc.get_zone(20, 10, "liv") == "defensive_third"

# --- Midfield ---
def test_midfield(proc):
    assert proc.get_zone(50, 50, "liv") == "midfield"

# --- Man City play right to left ---
def test_offensive_box_right_to_left(proc):
    assert proc.get_zone(10, 50, "mci") == "offensive_box"

def test_defensive_box_right_to_left(proc):
    assert proc.get_zone(85, 50, "mci") == "defensive_box"

# --- Second half direction swap ---
def test_directions_swap_second_half(proc):
    proc._update_directions(2)
    # Liverpool now attacks right to left
    assert proc.get_zone(10, 50, "liv") == "offensive_box"
    assert proc.get_zone(85, 50, "liv") == "defensive_box"

# --- Edge cases ---
def test_corner_flag_position(proc):
    result = proc.get_zone(100, 0, "liv")
    assert result in ["offensive_third", "offensive_box", "midfield"]

def test_unknown_team_defaults(proc):
    result = proc.get_zone(50, 50, "unknown")
    assert result == "midfield"

# --- Stats calculation ---
def test_shot_on_target_increments(proc):
    from models import MatchEvent, Location
    event = MatchEvent(
        id="test-1", type="shot", timestamp="2024-01-01T00:00:00Z",
        matchTime="10:00", period=1, teamId="liv", playerId="liv_11",
        location=Location(x=85, y=50), outcome="saved",
        details={"outcome": "saved"}
    )
    proc._update_stats(event)
    assert proc._state.stats["liv"].shots == 1
    assert proc._state.stats["liv"].shots_on_target == 1

def test_goal_updates_score(proc):
    from models import MatchEvent, Location
    event = MatchEvent(
        id="test-2", type="goal", timestamp="2024-01-01T00:00:00Z",
        matchTime="15:00", period=1, teamId="mci", playerId="mci_9",
        location=Location(x=5, y=50), outcome="successful", details={}
    )
    proc._update_stats(event)
    assert proc._state.score.mci == 1
    assert proc._state.score.liv == 0

def test_possession_updates_with_passes(proc):
    from models import MatchEvent, Location
    for _ in range(3):
        proc._update_stats(MatchEvent(
            id="p1", type="pass", timestamp="T", matchTime="01:00",
            period=1, teamId="liv", playerId="liv_3",
            location=Location(x=50, y=50), details={}
        ))
    for _ in range(1):
        proc._update_stats(MatchEvent(
            id="p2", type="pass", timestamp="T", matchTime="01:00",
            period=1, teamId="mci", playerId="mci_16",
            location=Location(x=50, y=50), details={}
        ))
    assert proc._state.stats["liv"].possession == 75.0
    assert proc._state.stats["mci"].possession == 25.0
