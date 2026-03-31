'use client';

export default function TacticalPitch({ currentEvent }: { currentEvent: any }) {
  const hasLocation = currentEvent?.location?.x !== undefined;
  const x = hasLocation ? currentEvent.location.x : null;
  const y = hasLocation ? (currentEvent.location.y * 0.65) : null;

  return (
    <div style={{position:'relative', width:'100%', paddingBottom:'62%', borderRadius:'12px', overflow:'hidden', boxShadow:'inset 0 0 20px rgba(0,0,0,0.2)'}}>
      {/* Real pitch background */}
      <img
        src="/assets/bevofp.webp"
        alt="pitch"
        style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover'}}
      />

      {/* Ripple effect behind ball */}
      {hasLocation && (
        <div style={{
          position:'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform:'translate(-50%, -50%)',
          width:'40px',
          height:'40px',
          borderRadius:'50%',
          background:'rgba(255,255,255,0.2)',
          animation:'pulse 1s infinite',
          zIndex:1
        }} />
      )}

      {/* Football emoji marker */}
      {hasLocation && (
        <div style={{
          position:'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform:'translate(-50%, -50%)',
          fontSize:'1.8rem',
          zIndex:2,
          filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          transition:'all 0.5s ease',
        }}>
          ⚽
        </div>
      )}

      {/* Event label */}
      {currentEvent && (
        <div style={{
          position:'absolute',
          bottom:'10px',
          left:'50%',
          transform:'translateX(-50%)',
          background:'rgba(0,0,0,0.75)',
          color:'white',
          fontSize:'0.75rem',
          padding:'5px 14px',
          borderRadius:'999px',
          whiteSpace:'nowrap',
          fontWeight:600,
          backdropFilter:'blur(4px)',
          zIndex:3
        }}>
          {currentEvent.type.replace(/_/g,' ')} {currentEvent.playerId ? '· ' + currentEvent.playerId : ''}
        </div>
      )}
    </div>
  );
}
