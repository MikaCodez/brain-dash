import { useEffect, useReducer } from 'react';

export const PLAYER_NAMES: {[key: string]: string} = {
  // Liverpool
  'liv_1':  'Alisson Becker',
  'liv_66': 'Trent Alexander-Arnold',
  'liv_4':  'Virgil van Dijk',
  'liv_5':  'Ibrahima Konaté',
  'liv_26': 'Andrew Robertson',
  'liv_3':  'Wataru Endō',
  'liv_10': 'Alexis Mac Allister',
  'liv_8':  'Dominik Szoboszlai',
  'liv_11': 'Mohamed Salah',
  'liv_9':  'Darwin Núñez',
  'liv_7':  'Luis Díaz',
  'liv_62': 'Caoimhin Kelleher',
  'liv_2':  'Joe Gomez',
  'liv_19': 'Harvey Elliott',
  'liv_18': 'Cody Gakpo',
  'liv_20': 'Diogo Jota',
  // Man City
  'mci_31': 'Ederson',
  'mci_2':  'Kyle Walker',
  'mci_3':  'Rúben Dias',
  'mci_25': 'Manuel Akanji',
  'mci_24': 'Joško Gvardiol',
  'mci_16': 'Rodri',
  'mci_17': 'Kevin De Bruyne',
  'mci_20': 'Bernardo Silva',
  'mci_47': 'Phil Foden',
  'mci_9':  'Erling Haaland',
  'mci_11': 'Jérémy Doku',
  'mci_18': 'Stefan Ortega',
  'mci_6':  'Nathan Aké',
  'mci_8':  'Mateo Kovačić',
  'mci_19': 'Julián Álvarez',
  'mci_10': 'Jack Grealish',
};

interface MatchState {
  events: any[];
  score: { [key: string]: number };
  stats: {
    [key: string]: { passes: number; shots: number; possession: number };
  };
}

const initialState: MatchState = {
  events: [],
  score: { liv: 0, mci: 0 },
  stats: {
    liv: { passes: 0, shots: 0, possession: 50 },
    mci: { passes: 0, shots: 0, possession: 50 },
  },
};

function matchReducer(state: MatchState, action: { type: string; payload: any }): MatchState {
  switch (action.type) {
    case 'ADD_EVENT':
      const newEvent = action.payload;
      const teamId = newEvent.teamId;
      const newScore = { ...state.score };
      if (newEvent.type === 'goal' && teamId) {
        newScore[teamId] = (newScore[teamId] || 0) + 1;
      }
      const newStats = {
        liv: { ...state.stats.liv },
        mci: { ...state.stats.mci },
      };
      if (teamId) {
        if (newEvent.type === 'pass') newStats[teamId].passes++;
        if (newEvent.type === 'shot') newStats[teamId].shots++;
      }
      const totalPasses = newStats.liv.passes + newStats.mci.passes;
      if (totalPasses > 0) {
        newStats.liv.possession = Math.round((newStats.liv.passes / totalPasses) * 100);
        newStats.mci.possession = 100 - newStats.liv.possession;
      }
      return {
        ...state,
        events: [newEvent, ...state.events],
        score: newScore,
        stats: newStats,
      };
    default:
      return state;
  }
}

export const useMatchStream = (url: string) => {
  const [state, dispatch] = useReducer(matchReducer, initialState);
  useEffect(() => {
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch({ type: 'ADD_EVENT', payload: data });
      } catch (e) {
        console.error('Failed to parse event:', e);
      }
    };
    eventSource.onerror = (err) => {
      console.error('SSE Connection Failed:', err);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [url]);
  return state;
};
