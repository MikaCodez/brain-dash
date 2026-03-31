'use client';
import { PLAYER_NAMES } from '../hooks/useMatchStream';

const EVENT_CONFIG: {[key: string]: {light: {color:string, bg:string, border:string}, dark: {color:string, bg:string, border:string}, icon: string, label: string}} = {
  goal:         { light:{color:'#92400e',bg:'linear-gradient(135deg,#fffbeb,#fef3c7)',border:'#f59e0b'}, dark:{color:'#fbbf24',bg:'rgba(251,191,36,0.1)',border:'rgba(251,191,36,0.4)'}, icon:'⚽', label:'GOAL' },
  shot:         { light:{color:'#9a3412',bg:'linear-gradient(135deg,#fff7ed,#ffedd5)',border:'#f97316'}, dark:{color:'#fb923c',bg:'rgba(249,115,22,0.1)',border:'rgba(249,115,22,0.4)'}, icon:'🎯', label:'SHOT' },
  foul:         { light:{color:'#991b1b',bg:'linear-gradient(135deg,#fef2f2,#fee2e2)',border:'#ef4444'}, dark:{color:'#f87171',bg:'rgba(239,68,68,0.1)',border:'rgba(239,68,68,0.4)'}, icon:'🟨', label:'FOUL' },
  card:         { light:{color:'#991b1b',bg:'linear-gradient(135deg,#fef2f2,#fee2e2)',border:'#ef4444'}, dark:{color:'#f87171',bg:'rgba(239,68,68,0.1)',border:'rgba(239,68,68,0.4)'}, icon:'🟥', label:'CARD' },
  var:          { light:{color:'#5b21b6',bg:'linear-gradient(135deg,#f5f3ff,#ede9fe)',border:'#8b5cf6'}, dark:{color:'#a78bfa',bg:'rgba(139,92,246,0.1)',border:'rgba(139,92,246,0.4)'}, icon:'📺', label:'VAR' },
  pass:         { light:{color:'#065f46',bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'#22c55e'}, dark:{color:'#4ade80',bg:'rgba(34,197,94,0.08)',border:'rgba(34,197,94,0.25)'}, icon:'→',  label:'PASS' },
  tackle:       { light:{color:'#1e40af',bg:'linear-gradient(135deg,#eff6ff,#dbeafe)',border:'#3b82f6'}, dark:{color:'#60a5fa',bg:'rgba(59,130,246,0.1)',border:'rgba(59,130,246,0.4)'}, icon:'⚡', label:'TACKLE' },
  interception: { light:{color:'#065f46',bg:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'#16a34a'}, dark:{color:'#34d399',bg:'rgba(52,211,153,0.1)',border:'rgba(52,211,153,0.4)'}, icon:'✋', label:'INTERCEPTION' },
  substitution: { light:{color:'#92400e',bg:'linear-gradient(135deg,#fffbeb,#fef3c7)',border:'#eab308'}, dark:{color:'#facc15',bg:'rgba(234,179,8,0.1)',border:'rgba(234,179,8,0.4)'},  icon:'🔄', label:'SUB' },
  corner:       { light:{color:'#0e7490',bg:'linear-gradient(135deg,#ecfeff,#cffafe)',border:'#06b6d4'}, dark:{color:'#22d3ee',bg:'rgba(6,182,212,0.1)',border:'rgba(6,182,212,0.4)'},  icon:'⚑',  label:'CORNER' },
  free_kick:    { light:{color:'#9a3412',bg:'linear-gradient(135deg,#fff7ed,#ffedd5)',border:'#f97316'}, dark:{color:'#fb923c',bg:'rgba(249,115,22,0.1)',border:'rgba(249,115,22,0.4)'}, icon:'🦵', label:'FREE KICK' },
  save:         { light:{color:'#1e40af',bg:'linear-gradient(135deg,#eff6ff,#dbeafe)',border:'#3b82f6'}, dark:{color:'#60a5fa',bg:'rgba(59,130,246,0.1)',border:'rgba(59,130,246,0.4)'}, icon:'🧤', label:'SAVE' },
  offside:      { light:{color:'#6b21a8',bg:'linear-gradient(135deg,#faf5ff,#f3e8ff)',border:'#a855f7'}, dark:{color:'#c084fc',bg:'rgba(168,85,247,0.1)',border:'rgba(168,85,247,0.4)'}, icon:'🚩', label:'OFFSIDE' },
  dribble:      { light:{color:'#0e7490',bg:'linear-gradient(135deg,#ecfeff,#cffafe)',border:'#06b6d4'}, dark:{color:'#22d3ee',bg:'rgba(6,182,212,0.1)',border:'rgba(6,182,212,0.4)'},  icon:'🏃', label:'DRIBBLE' },
  kickoff:      { light:{color:'#374151',bg:'linear-gradient(135deg,#f9fafb,#f3f4f6)',border:'#6b7280'}, dark:{color:'#9ca3af',bg:'rgba(107,114,128,0.1)',border:'rgba(107,114,128,0.4)'}, icon:'🟢', label:'KICK OFF' },
};

const TEAM_NAMES: {[key:string]:string} = { liv:'Liverpool', mci:'Man City' };

export default function CommentaryFeed({ events, dark = false }: { events: any[], dark?: boolean }) {
  if (!events.length) {
    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 0', gap:'12px'}}>
        <span style={{fontSize:'2.5rem'}}>⏳</span>
        <p style={{color: dark ? '#6b7280' : '#9ca3af', fontSize:'0.875rem', fontWeight:500}}>Waiting for kick off...</p>
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
      {events.map((event, i) => {
        const cfg = EVENT_CONFIG[event.type];
        const theme = cfg ? (dark ? cfg.dark : cfg.light) : (dark ? {color:'#9ca3af', bg:'rgba(107,114,128,0.1)', border:'rgba(107,114,128,0.3)'} : {color:'#374151', bg:'#f9fafb', border:'#d1d5db'});
        const icon = cfg?.icon || '•';
        const label = cfg?.label || event.type.toUpperCase();
        const isGoal = event.type === 'goal';
        const isLatest = i === 0;
        const playerName = event.playerId ? (PLAYER_NAMES[event.playerId] || event.playerId) : null;
        const teamName = event.teamId ? TEAM_NAMES[event.teamId] || event.teamId.toUpperCase() : null;

        return (
          <div
            key={i}
            style={{
              background: theme.bg,
              border: `1px solid ${isLatest ? theme.border : dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              borderLeft: `4px solid ${theme.border}`,
              borderRadius:'12px',
              padding: isGoal ? '14px' : '10px 12px',
              display:'flex', gap:'12px', alignItems:'flex-start',
              opacity: i > 12 ? Math.max(0.4, 1-(i-12)*0.05) : 1,
              boxShadow: isLatest ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transform: isGoal ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', minWidth:'40px'}}>
              <span style={{fontSize: isGoal ? '1.5rem' : '1.1rem'}}>{icon}</span>
              <span style={{color: dark ? '#6b7280' : '#9ca3af', fontSize:'0.7rem', fontFamily:'monospace', fontWeight:600}}>{event.matchTime}'</span>
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px', flexWrap:'wrap'}}>
                <span style={{fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.1em', color:theme.color, textTransform:'uppercase'}}>{label}</span>
                {playerName && (
                  <span style={{fontSize:'0.7rem', fontWeight:700, color: event.teamId === 'liv' ? '#ef4444' : '#3b82f6', background: event.teamId === 'liv' ? (dark ? 'rgba(239,68,68,0.15)' : 'rgba(200,16,46,0.08)') : (dark ? 'rgba(59,130,246,0.15)' : 'rgba(29,78,216,0.08)'), padding:'1px 7px', borderRadius:'999px', border: `1px solid ${event.teamId === 'liv' ? (dark ? 'rgba(239,68,68,0.3)' : 'rgba(200,16,46,0.2)') : (dark ? 'rgba(59,130,246,0.3)' : 'rgba(29,78,216,0.2)')}`}}>
                    {playerName}
                  </span>
                )}
                {teamName && (
                  <span style={{fontSize:'0.65rem', fontWeight:700, color:'white', background: event.teamId === 'liv' ? '#C8102E' : '#1d4ed8', padding:'1px 7px', borderRadius:'999px'}}>
                    {teamName}
                  </span>
                )}
                {isGoal && <span style={{fontSize:'0.7rem', fontWeight:800, color: dark ? '#fbbf24' : '#d97706'}}>⭐ GOAL!</span>}
              </div>
              <p style={{color: dark ? '#e5e7eb' : '#1f2937', fontSize: isGoal ? '0.9rem' : '0.82rem', lineHeight:1.5, fontWeight: isGoal ? 700 : 400}}>
                {event.commentary || `${event.type.replace(/_/g,' ')}${playerName ? ' by '+playerName : ''}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
