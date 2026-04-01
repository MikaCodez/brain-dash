'use client';

import { useState } from 'react';
import { useMatchStream } from '../hooks/useMatchStream';
import Scoreboard from '../components/Scoreboard';
import CommentaryFeed from '../components/Feed';
import TacticalPitch from '../components/Pitch';
import { PossessionBar, ShotChart } from '../components/Stats';

export default function MatchDashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const { events, score, stats } = useMatchStream(`${apiUrl}/stream`);
  const [dark, setDark] = useState(false);

  const t = {
    bg:         dark ? '#0f1117' : '#f0f2f5',
    nav:        dark ? '#1a1d27' : '#ffffff',
    navBorder:  dark ? '#2d3148' : '#e5e7eb',
    card:       dark ? '#1a1d27' : '#ffffff',
    cardBorder: dark ? '#2d3148' : '#f3f4f6',
    heading:    dark ? '#f9fafb' : '#111827',
    subtext:    dark ? '#9ca3af' : '#6b7280',
    label:      dark ? '#e5e7eb' : '#374151',
    divider:    dark ? '#2d3148' : '#f3f4f6',
    toggleBg:   dark ? '#2d3148' : '#f3f4f6',
    toggleText: dark ? '#f9fafb' : '#374151',
  };

  return (
    <div style={{minHeight:'100vh', background:t.bg, fontFamily:'Inter, system-ui, sans-serif', transition:'background 0.3s'}}>

      {/* Navbar */}
      <nav style={{background:t.nav, borderBottom:`1px solid ${t.navBorder}`, padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', transition:'background 0.3s'}}>

        {/* Left */}
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:'38px', height:'38px', borderRadius:'10px', background:'linear-gradient(135deg, #7c3aed 0%, #2563eb 25%, #f59e0b 50%, #ef4444 75%, #f97316 100%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, fontSize:'0.85rem', boxShadow:'0 2px 8px rgba(124,58,237,0.3)'}}>ML</div>
          <div>
            <p style={{margin:0, fontWeight:700, fontSize:'0.9rem', color:t.heading}}>Malcolm Leagues</p>
            <p style={{margin:0, fontSize:'0.7rem', color:t.subtext}}>Live Match Centre</p>
          </div>
        </div>

        {/* Center: Branding */}
        <div style={{position:'absolute', left:'50%', transform:'translateX(-50%)'}}>
          <p style={{margin:0, fontWeight:700, fontSize:'0.75rem', color:t.subtext, letterSpacing:'0.05em'}}>MAKZ+CODE47</p>
        </div>

        {/* Right */}
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              display:'flex', alignItems:'center', gap:'6px',
              background: t.toggleBg,
              border: `1px solid ${t.navBorder}`,
              borderRadius:'999px',
              padding:'6px 14px',
              cursor:'pointer',
              fontSize:'0.8rem',
              fontWeight:600,
              color: t.toggleText,
              transition:'all 0.2s',
            }}
          >
            <span style={{fontSize:'1rem'}}>{dark ? '☀️' : '🌙'}</span>
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Live Now */}
          <div style={{display:'flex', alignItems:'center', gap:'8px', background: dark ? 'rgba(239,68,68,0.15)' : '#fef2f2', border:'1px solid #fecaca', padding:'6px 14px', borderRadius:'999px'}}>
            <span style={{width:'8px', height:'8px', borderRadius:'50%', background:'#ef4444', display:'inline-block', animation:'pulse 1.5s infinite'}}/>
            <span style={{fontSize:'0.75rem', fontWeight:700, color:'#dc2626'}}>Live Now</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{padding:'20px 24px', maxWidth:'1400px', margin:'0 auto'}}>

        <div style={{marginBottom:'20px'}}>
          <Scoreboard score={score} />
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr 0.8fr', gap:'16px', alignItems:'start'}}>

          {/* Commentary */}
          <div style={{background:t.card, borderRadius:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', border:`1px solid ${t.cardBorder}`, overflow:'hidden', transition:'background 0.3s'}}>
            <div style={{padding:'14px 16px', borderBottom:`1px solid ${t.divider}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span style={{fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', color:t.label}}>Live Commentary</span>
              <span style={{fontSize:'0.7rem', color:'#ef4444', fontWeight:700}}>● Live</span>
            </div>
            <div style={{overflowY:'auto', maxHeight:'68vh', padding:'12px'}}>
              <CommentaryFeed events={events} dark={dark} />
            </div>
          </div>

          {/* Pitch */}
          <div style={{background:t.card, borderRadius:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', border:`1px solid ${t.cardBorder}`, overflow:'hidden', transition:'background 0.3s'}}>
            <div style={{padding:'14px 16px', borderBottom:`1px solid ${t.divider}`, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span style={{fontWeight:700, fontSize:'0.75rem', letterSpacing:'0.1em', textTransform:'uppercase', color:t.label}}>Tactical View</span>
              {events[0] && (
                <span style={{fontSize:'0.7rem', background: dark ? 'rgba(251,191,36,0.15)' : '#fffbeb', color: dark ? '#fbbf24' : '#92400e', border: dark ? '1px solid rgba(251,191,36,0.3)' : '1px solid #fcd34d', padding:'3px 10px', borderRadius:'999px', fontWeight:600, textTransform:'capitalize'}}>
                  {events[0]?.type?.replace(/_/g,' ')}
                </span>
              )}
            </div>
            <div style={{padding:'12px'}}>
              <TacticalPitch currentEvent={events[0]} />
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
            <PossessionBar stats={stats} dark={dark} />
            <ShotChart stats={stats} dark={dark} />
          </div>

        </div>
      </div>
    </div>
  );
}
