type TeamStats = {
  passes: number; shots: number; shots_on_target: number;
  shots_off_target: number; shots_blocked: number;
  tackles: number; interceptions: number;
  fouls: number; corners: number; saves: number;
  possession: number;
};

function StatRow({ left, right, label, max, dark }: any) {
  const trackBg = dark ? '#374151' : '#f3f4f6';
  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', fontWeight:700, marginBottom:'4px'}}>
        <span style={{color:'#C8102E'}}>{left}</span>
        <span style={{color: dark ? '#9ca3af' : '#6b7280'}}>{label}</span>
        <span style={{color:'#1d4ed8'}}>{right}</span>
      </div>
      <div style={{display:'flex', gap:'4px', height:'6px', borderRadius:'999px', overflow:'hidden', background:trackBg}}>
        <div style={{flex:1, display:'flex', justifyContent:'flex-end'}}>
          <div style={{width:`${(left/Math.max(left+right,1))*100}%`, background:'#C8102E', transition:'width 0.5s'}} />
        </div>
        <div style={{flex:1}}>
          <div style={{width:`${(right/Math.max(left+right,1))*100}%`, background:'#6CABDD', transition:'width 0.5s'}} />
        </div>
      </div>
    </div>
  );
}

export function PossessionBar({ stats, dark = false }: { stats: { [key: string]: TeamStats }, dark?: boolean }) {
  const livPoss = stats?.liv?.possession ?? 50;
  const mciPoss = stats?.mci?.possession ?? 50;
  const card = dark ? '#1a1d27' : 'white';
  const border = dark ? '#2d3148' : '#f3f4f6';
  const label = dark ? '#9ca3af' : '#6b7280';
  return (
    <div style={{borderRadius:'16px', padding:'16px', background:card, border:`1px solid ${border}`, transition:'background 0.3s'}}>
      <h3 style={{fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:label, marginBottom:'12px'}}>Possession</h3>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.875rem', fontWeight:700, marginBottom:'8px'}}>
        <span style={{color:'#C8102E'}}>{livPoss}% LIV</span>
        <span style={{color:'#1d4ed8'}}>{mciPoss}% MCI</span>
      </div>
      <div style={{display:'flex', borderRadius:'999px', overflow:'hidden', height:'10px', background: dark ? '#374151' : '#f3f4f6'}}>
        <div style={{width:`${livPoss}%`, background:'#C8102E', transition:'width 0.5s'}} />
        <div style={{width:`${mciPoss}%`, background:'#6CABDD', transition:'width 0.5s'}} />
      </div>
    </div>
  );
}

export function ShotChart({ stats, dark = false }: { stats: { [key: string]: TeamStats }, dark?: boolean }) {
  const card = dark ? '#1a1d27' : 'white';
  const border = dark ? '#2d3148' : '#f3f4f6';
  const label = dark ? '#9ca3af' : '#6b7280';
  const s = stats;

  const rows = [
    { label: 'Shots',         left: s?.liv?.shots ?? 0,              right: s?.mci?.shots ?? 0 },
    { label: 'On Target',     left: s?.liv?.shots_on_target ?? 0,    right: s?.mci?.shots_on_target ?? 0 },
    { label: 'Passes',        left: s?.liv?.passes ?? 0,             right: s?.mci?.passes ?? 0 },
    { label: 'Tackles',       left: s?.liv?.tackles ?? 0,            right: s?.mci?.tackles ?? 0 },
    { label: 'Interceptions', left: s?.liv?.interceptions ?? 0,      right: s?.mci?.interceptions ?? 0 },
    { label: 'Fouls',         left: s?.liv?.fouls ?? 0,              right: s?.mci?.fouls ?? 0 },
    { label: 'Corners',       left: s?.liv?.corners ?? 0,            right: s?.mci?.corners ?? 0 },
    { label: 'Saves',         left: s?.liv?.saves ?? 0,              right: s?.mci?.saves ?? 0 },
  ];

  return (
    <div style={{borderRadius:'16px', padding:'16px', background:card, border:`1px solid ${border}`, transition:'background 0.3s'}}>
      <h3 style={{fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:label, marginBottom:'16px'}}>Match Stats</h3>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {rows.map(row => (
          <StatRow key={row.label} left={row.left} right={row.right} label={row.label} dark={dark} />
        ))}
      </div>
    </div>
  );
}
