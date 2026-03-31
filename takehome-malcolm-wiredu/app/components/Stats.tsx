type TeamStats = { passes: number; shots: number; possession: number };

export function PossessionBar({ stats, dark = false }: { stats: { [key: string]: TeamStats }, dark?: boolean }) {
  const livPoss = stats?.liv?.possession ?? 50;
  const mciPoss = stats?.mci?.possession ?? 50;
  const card = dark ? '#1a1d27' : 'white';
  const border = dark ? '#2d3148' : '#f3f4f6';
  const label = dark ? '#9ca3af' : '#6b7280';
  const text = dark ? '#f9fafb' : '#111827';
  return (
    <div style={{borderRadius:'16px', padding:'16px', background:card, border:`1px solid ${border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', transition:'background 0.3s'}}>
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
  const livShots = stats?.liv?.shots ?? 0;
  const mciShots = stats?.mci?.shots ?? 0;
  const livPasses = stats?.liv?.passes ?? 0;
  const mciPasses = stats?.mci?.passes ?? 0;
  const maxShots = Math.max(livShots, mciShots, 1);
  const maxPasses = Math.max(livPasses, mciPasses, 1);
  const card = dark ? '#1a1d27' : 'white';
  const border = dark ? '#2d3148' : '#f3f4f6';
  const label = dark ? '#9ca3af' : '#6b7280';
  const trackBg = dark ? '#374151' : '#f3f4f6';

  const StatRow = ({ leftVal, rightVal, max, label: rowLabel }: any) => (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', fontWeight:700, marginBottom:'4px'}}>
        <span style={{color:'#C8102E'}}>{leftVal}</span>
        <span style={{color:label}}>{rowLabel}</span>
        <span style={{color:'#1d4ed8'}}>{rightVal}</span>
      </div>
      <div style={{display:'flex', gap:'4px', height:'8px', borderRadius:'999px', overflow:'hidden', background:trackBg}}>
        <div style={{flex:1, display:'flex', justifyContent:'flex-end'}}>
          <div style={{width:`${(leftVal/max)*100}%`, background:'#C8102E', borderRadius:'999px', transition:'width 0.5s'}} />
        </div>
        <div style={{flex:1}}>
          <div style={{width:`${(rightVal/max)*100}%`, background:'#6CABDD', borderRadius:'999px', transition:'width 0.5s'}} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{borderRadius:'16px', padding:'16px', background:card, border:`1px solid ${border}`, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', flex:1, transition:'background 0.3s'}}>
      <h3 style={{fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:label, marginBottom:'16px'}}>Match Stats</h3>
      <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
        <StatRow leftVal={livShots} rightVal={mciShots} max={maxShots} label="Shots" />
        <StatRow leftVal={livPasses} rightVal={mciPasses} max={maxPasses} label="Passes" />
      </div>
    </div>
  );
}
