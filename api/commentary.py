import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

event_context_buffer = []

PLAYER_NAMES = {
    'liv_1': 'Alisson Becker', 'liv_66': 'Trent Alexander-Arnold',
    'liv_4': 'Virgil van Dijk', 'liv_5': 'Ibrahima Konaté',
    'liv_26': 'Andrew Robertson', 'liv_3': 'Wataru Endō',
    'liv_10': 'Alexis Mac Allister', 'liv_8': 'Dominik Szoboszlai',
    'liv_11': 'Mohamed Salah', 'liv_9': 'Darwin Núñez',
    'liv_7': 'Luis Díaz', 'liv_62': 'Caoimhin Kelleher',
    'liv_2': 'Joe Gomez', 'liv_19': 'Harvey Elliott',
    'liv_18': 'Cody Gakpo', 'liv_20': 'Diogo Jota',
    'mci_31': 'Ederson', 'mci_2': 'Kyle Walker',
    'mci_3': 'Rúben Dias', 'mci_25': 'Manuel Akanji',
    'mci_24': 'Joško Gvardiol', 'mci_16': 'Rodri',
    'mci_17': 'Kevin De Bruyne', 'mci_20': 'Bernardo Silva',
    'mci_47': 'Phil Foden', 'mci_9': 'Erling Haaland',
    'mci_11': 'Jérémy Doku', 'mci_18': 'Stefan Ortega',
    'mci_6': 'Nathan Aké', 'mci_8': 'Mateo Kovačić',
    'mci_19': 'Julián Álvarez', 'mci_10': 'Jack Grealish',
}

TEAM_NAMES = {'liv': 'Liverpool', 'mci': 'Manchester City'}

async def get_ai_commentary(current_event, zone):
    global event_context_buffer

    player_name = PLAYER_NAMES.get(current_event.get('playerId', ''), current_event.get('playerId', 'Unknown'))
    team_name = TEAM_NAMES.get(current_event.get('teamId', ''), current_event.get('teamId', ''))

    event_summary = (
        f"Event: {current_event['type'].replace('_', ' ')}, "
        f"Player: {player_name}, "
        f"Team: {team_name}, "
        f"Zone: {zone}, "
        f"Time: {current_event['matchTime']}"
    )

    context_str = " | ".join(event_context_buffer[-3:])

    prompt = f"""You are a world-class CBS Sports Golazo football commentator covering Liverpool vs Manchester City.
Give exactly ONE punchy sentence of live commentary for this event.
Use the real player name naturally in the sentence.
CURRENT EVENT: {event_summary}
RECENT CONTEXT: {context_str}
Rules: Be energetic for goals, suspenseful for VAR, sharp for tackles. Always use the real player name, never an ID."""

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional football commentator. Always use real player names, never IDs like liv_3 or mci_17."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=80,
            temperature=0.75
        )
        commentary = response.choices[0].message.content.strip()
        event_context_buffer.append(f"{player_name} {current_event['type']}")
        if len(event_context_buffer) > 5:
            event_context_buffer.pop(0)
        return commentary
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return f"{current_event['type'].replace('_', ' ').capitalize()} by {player_name}."
