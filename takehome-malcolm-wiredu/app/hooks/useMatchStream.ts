import { useEffect, useReducer, useRef, useCallback } from 'react';

export const PLAYER_NAMES: {[key: string]: string} = {
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
};

interface TeamStats {
  passes: number;
  shots: number;
  shots_on_target: number;
  shots_off_target: number;
  shots_blocked: number;
  goals: number;
  tackles: number;
  interceptions: number;
  fouls: number;
  cards: number;
  corners: number;
  saves: number;
  possession: number;
}

interface MatchState {
  events: any[];
  score: { liv: number; mci: number };
  stats: { [key: string]: TeamStats };
  connected: boolean;
  error: string | null;
}

const initialState: MatchState = {
  events: [],
  score: { liv: 0, mci: 0 },
  stats: {
    liv: { passes:0, shots:0, shots_on_target:0, shots_off_target:0, shots_blocked:0, goals:0, tackles:0, interceptions:0, fouls:0, cards:0, corners:0, saves:0, possession:50 },
    mci: { passes:0, shots:0, shots_on_target:0, shots_off_target:0, shots_blocked:0, goals:0, tackles:0, interceptions:0, fouls:0, cards:0, corners:0, saves:0, possession:50 },
  },
  connected: false,
  error: null,
};

type Action =
  | { type: 'ADD_EVENT'; payload: any }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SYNC_STATE'; payload: any };

function matchReducer(state: MatchState, action: Action): MatchState {
  switch (action.type) {
    case 'ADD_EVENT': {
      const { score, stats, ...event } = action.payload;
      return {
        ...state,
        events: [event, ...state.events],
        score: score ?? state.score,
        stats: stats ?? state.stats,
      };
    }
    case 'SYNC_STATE': {
      // Hydrate from /state endpoint on reconnect
      const { score, stats, recent_events } = action.payload;
      return {
        ...state,
        score: score ?? state.score,
        stats: stats ?? state.stats,
        events: recent_events ? [...recent_events].reverse() : state.events,
      };
    }
    case 'SET_CONNECTED':
      return { ...state, connected: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, connected: false };
    default:
      return state;
  }
}

export const useMatchStream = (url: string) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);
  const retryCount = useRef(0);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    // Close existing connection if any
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = async () => {
      dispatch({ type: 'SET_CONNECTED', payload: true });
      retryCount.current = 0;

      // On reconnect, fetch current state to avoid starting from scratch
      if (retryCount.current > 0) {
        try {
          const res = await fetch('http://localhost:8000/state');
          const data = await res.json();
          dispatch({ type: 'SYNC_STATE', payload: data });
        } catch (e) {
          console.warn('Could not sync state on reconnect');
        }
      }
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch({ type: 'ADD_EVENT', payload: data });
      } catch (e) {
        console.error('Failed to parse event:', e);
      }
    };

    es.onerror = () => {
      es.close();
      esRef.current = null;
      dispatch({ type: 'SET_CONNECTED', payload: false });

      // Exponential backoff: 2s, 4s, 8s, max 30s
      const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
      retryCount.current += 1;
      dispatch({ type: 'SET_ERROR', payload: `Connection lost. Reconnecting in ${delay / 1000}s...` });

      retryTimeout.current = setTimeout(() => {
        connect();
      }, delay);
    };
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, [connect]);

  return state;
};
