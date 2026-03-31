export default function Scoreboard({ score }: { score: { [key: string]: number } }) {
  return (
    <div style={{position:'relative', borderRadius:'16px', overflow:'hidden', minHeight:'160px', background:'#1a1a2e'}}>
      
      {/* Stadium background */}
      <img src="/assets/bevofp.webp" alt="" style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center'}} />
      <div style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'rgba(10,10,20,0.55)'}} />

      {/* Liverpool team photo - bottom left */}
      <img 
        src="/assets/Liverpoolteam.avif" 
        alt="Liverpool Team" 
        style={{position:'absolute', bottom:0, left:0, height:'100%', width:'22%', objectFit:'cover', objectPosition:'top center', maskImage:'linear-gradient(to right, rgba(0,0,0,0.8) 60%, transparent 100%)', WebkitMaskImage:'linear-gradient(to right, rgba(0,0,0,0.8) 60%, transparent 100%)'}} 
      />

      {/* Man City team photo - bottom right */}
      <img 
        src="/assets/mancitayteam.webp" 
        alt="Man City Team" 
        style={{position:'absolute', bottom:0, right:0, height:'100%', width:'22%', objectFit:'cover', objectPosition:'top center', maskImage:'linear-gradient(to left, rgba(0,0,0,0.8) 60%, transparent 100%)', WebkitMaskImage:'linear-gradient(to left, rgba(0,0,0,0.8) 60%, transparent 100%)'}} 
      />

      {/* Content */}
      <div style={{position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 40px', gap:'16px'}}>

        {/* Liverpool */}
        <div style={{display:'flex', alignItems:'center', gap:'12px', flex:1}}>
          <img src="/assets/Liverpool_FC.svg.png" alt="LFC" style={{width:'56px', height:'56px', objectFit:'contain', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'}} />
          <div>
            <p style={{color:'white', fontWeight:900, fontSize:'1.1rem', margin:0}}>Liverpool</p>
            <span style={{fontSize:'0.7rem', color:'white', background:'rgba(200,16,46,0.7)', padding:'2px 8px', borderRadius:'999px', fontWeight:700}}>Home</span>
          </div>
        </div>

        {/* Score */}
        <div style={{textAlign:'center', minWidth:'200px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'16px'}}>
            <span style={{color:'white', fontWeight:900, fontSize:'3.5rem', lineHeight:1, textShadow:'0 2px 12px rgba(0,0,0,0.6)'}}>{score?.liv ?? 0}</span>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px'}}>
              <span style={{color:'white', fontSize:'1.5rem', opacity:0.5}}>:</span>
              <span style={{color:'white', background:'#ef4444', fontSize:'0.65rem', fontWeight:900, padding:'2px 8px', borderRadius:'999px', letterSpacing:'0.1em'}}>LIVE</span>
            </div>
            <span style={{color:'white', fontWeight:900, fontSize:'3.5rem', lineHeight:1, textShadow:'0 2px 12px rgba(0,0,0,0.6)'}}>{score?.mci ?? 0}</span>
          </div>
          <p style={{color:'white', opacity:0.6, fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', margin:'8px 0 0'}}>Premier League · Anfield</p>
        </div>

        {/* Man City */}
        <div style={{display:'flex', alignItems:'center', gap:'12px', flex:1, justifyContent:'flex-end'}}>
          <div style={{textAlign:'right'}}>
            <p style={{color:'white', fontWeight:900, fontSize:'1.1rem', margin:0}}>Man City</p>
            <span style={{fontSize:'0.7rem', color:'white', background:'rgba(108,171,221,0.7)', padding:'2px 8px', borderRadius:'999px', fontWeight:700}}>Away</span>
          </div>
          <img src="/assets/Manchester_City_FC_badge.svg.png" alt="MCFC" style={{width:'56px', height:'56px', objectFit:'contain', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'}} />
        </div>

      </div>
    </div>
  );
}
