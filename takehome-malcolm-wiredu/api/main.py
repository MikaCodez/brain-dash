import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from commentary import get_ai_commentary
from processor import MatchProcessor

app = FastAPI()
processor = MatchProcessor()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("match_events.json") as f:
    match_data = json.load(f)

@app.get("/stream")
async def stream_match():
    async def event_generator():
        for event in match_data['events']:
            zone = processor.get_zone(event['location']['x'], event['location']['y'], event['teamId']) if event['teamId'] else 'midfield'

            if event['type'] in ['goal', 'shot', 'foul', 'pass', 'var', 'tackle', 'interception', 'card', 'substitution', 'corner', 'free_kick']:
                ai_text = await get_ai_commentary(event, zone)
            else:
                ai_text = ''

            event['calculatedZone'] = zone
            event['commentary'] = ai_text

            yield {'data': json.dumps(event)}
            await asyncio.sleep(4)

    return EventSourceResponse(event_generator())
