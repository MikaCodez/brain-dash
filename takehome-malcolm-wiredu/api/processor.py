class MatchProcessor:
    def __init__(self):
        # We define attacking directions. 
        # Usually, teams swap sides at half-time (Period 2).
        self.directions = {
            "liv": "left_to_right", # Period 1
            "mci": "right_to_left"  # Period 1
        }

    def update_directions(self, period: int):
        """Update attacking directions based on the match period."""
        if period == 2:
            self.directions = {
                "liv": "right_to_left",
                "mci": "left_to_right"
            }

    def get_zone(self, x: float, y: float, team_id: str) -> str:
        """
        Classifies coordinates into zones based on attacking direction.
        X (0-100), Y (0-100)
        """
        direction = self.directions.get(team_id, "left_to_right")
        
        # Penalty Area Y-axis boundaries (18 < Y < 82)
        is_in_box_height = 18 < y < 82

        if direction == "left_to_right":
            # 1. Offensive/Defensive Boxes
            if x > 82 and is_in_box_height: return "offensive_box"
            if x < 18 and is_in_box_height: return "defensive_box"
            
            # 2. Thirds
            if x > 65: return "offensive_third"
            if x < 35: return "defensive_third"
            
        else: # right_to_left
            # 1. Offensive/Defensive Boxes
            if x < 18 and is_in_box_height: return "offensive_box"
            if x > 82 and is_in_box_height: return "defensive_box"
            
            # 2. Thirds
            if x < 35: return "offensive_third"
            if x > 65: return "defensive_third"

        # 3. Default
        return "midfield"

    def calculate_stats(self, events):
        """
        Optional helper to aggregate stats from a list of events.
        """
        stats = {"liv": {"passes": 0, "shots": 0}, "mci": {"passes": 0, "shots": 0}}
        for e in events:
            tid = e['teamId']
            if e['type'] == 'pass': stats[tid]['passes'] += 1
            if e['type'] == 'shot': stats[tid]['shots'] += 1
        return stats
_processor = MatchProcessor()

def get_zone(x, y, team_id):
    return _processor.get_zone(x, y, team_id)
