import { useState, useEffect, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow: hidden; }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; -ms-overflow-style: none; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)} }
  @keyframes popIn { 0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.07)}100%{transform:scale(1);opacity:1} }
  .fade-up { animation: fadeUp 0.28s ease both; }
  .slide-in { animation: slideIn 0.2s ease both; }
  .d1{animation-delay:.05s}.d2{animation-delay:.1s}.d3{animation-delay:.15s}.d4{animation-delay:.2s}.d5{animation-delay:.25s}
  input,button { font-family: 'Plus Jakarta Sans', sans-serif; }
  input[type=number]{-moz-appearance:textfield}
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
`;

const C = {
  bg:'#F5F2EE', surface:'#FFFFFF', primary:'#1E4D3A',
  accent:'#C8A96E',
  onTrack:'#2D7A35', onTrackBg:'#E5EFE6',
  offTrack:'#C85A3A', offTrackBg:'#F5E8E4',
  text:'#1A1A1A', muted:'#7A7570', subtle:'#B8B3AD',
  rule:'#D8D4CE', border:'#1A1A1A',
};

// ─── DATA ──────────────────────────────────────────────────────────────────

const CLIENTS = [
  {id:1,name:'Karim Hassan',  initials:'KH',status:'on-track', phase:'Beginner Strength',last:'2h ago',    streak:5, pct:87,color:'#1E4D3A'},
  {id:2,name:'Sara Ahmed',    initials:'SA',status:'off-track',phase:'Cardio & Tone',    last:'3 days ago',streak:0, pct:42,color:'#5C4A3A'},
  {id:3,name:'Omar Khalil',   initials:'OK',status:'on-track', phase:'Powerlifting Prep',last:'Yesterday', streak:12,pct:94,color:'#2A3D5C'},
  {id:4,name:'Nadia Mostafa', initials:'NM',status:'on-track', phase:'Beginner Strength',last:'Today',     streak:3, pct:71,color:'#4A3A5C'},
  {id:5,name:'Youssef Emad',  initials:'YE',status:'off-track',phase:'Cardio & Tone',    last:'5 days ago',streak:0, pct:28,color:'#5C3A3A'},
];

const PROGRAMS = [
  {id:1,name:'Beginner Strength Foundation',weeks:4,assigned:2,schedule:['Sun','Tue','Thu'],
   workouts:[
     {id:1,name:'Push Day', day:'Sunday',  exercises:[{n:'Bench Press',s:4,r:'8–10',rest:'90s'},{n:'Overhead Press',s:3,r:'8–10',rest:'90s'},{n:'Incline DB Press',s:3,r:'10–12',rest:'60s'},{n:'Tricep Pushdown',s:3,r:'12–15',rest:'45s'}]},
     {id:2,name:'Pull Day', day:'Tuesday', exercises:[{n:'Deadlift',s:4,r:'5–6',rest:'120s'},{n:'Barbell Row',s:3,r:'8–10',rest:'90s'},{n:'Pull-ups',s:3,r:'6–8',rest:'90s'},{n:'Face Pulls',s:3,r:'15–20',rest:'45s'}]},
     {id:3,name:'Leg Day',  day:'Thursday',exercises:[{n:'Back Squat',s:4,r:'6–8',rest:'120s'},{n:'Romanian DL',s:3,r:'10–12',rest:'90s'},{n:'Leg Press',s:3,r:'12–15',rest:'60s'},{n:'Calf Raises',s:4,r:'15–20',rest:'30s'}]},
   ]},
  {id:2,name:'Cardio & Tone',weeks:6,assigned:2,schedule:['Mon','Wed','Fri','Sat'],
   workouts:[
     {id:4,name:'Upper Tone', day:'Monday',   exercises:[{n:'Push-ups',s:3,r:'15–20',rest:'45s'},{n:'DB Row',s:3,r:'12–15',rest:'45s'},{n:'Shoulder Press',s:3,r:'12–15',rest:'45s'}]},
     {id:5,name:'HIIT Circuit',day:'Wednesday',exercises:[{n:'Burpees',s:4,r:'10',rest:'30s'},{n:'Jump Squats',s:4,r:'15',rest:'30s'},{n:'Mountain Climbers',s:4,r:'20',rest:'30s'}]},
   ]},
  {id:3,name:'Powerlifting Prep',weeks:8,assigned:1,schedule:['Sun','Mon','Wed','Fri'],
   workouts:[
     {id:6,name:'Squat Focus',day:'Sunday',exercises:[{n:'Back Squat',s:5,r:'5',rest:'3 min'},{n:'Front Squat',s:3,r:'3',rest:'2 min'},{n:'Pause Squat',s:3,r:'3',rest:'2 min'}]},
   ]},
];

const TODAY_WO = {
  name:'Push Day', program:'Beginner Strength Foundation',
  exercises:[
    {id:1,name:'Bench Press',    sets:4,reps:'8–10', rest:90, muscle:'Chest'},
    {id:2,name:'Overhead Press', sets:3,reps:'8–10', rest:90, muscle:'Shoulders'},
    {id:3,name:'Incline DB Press',sets:3,reps:'10–12',rest:60,muscle:'Chest'},
    {id:4,name:'Tricep Pushdown',sets:3,reps:'12–15',rest:45, muscle:'Triceps'},
  ]
};

const ACTIVITY = [
  {id:1,client:'Karim Hassan', action:'Completed Pull Day',        time:'2h ago',   type:'done',  color:'#1E4D3A'},
  {id:2,client:'Omar Khalil',  action:'New PR — Squat 140 kg',     time:'5h ago',   type:'pr',    color:'#2A3D5C'},
  {id:3,client:'Nadia Mostafa',action:'Completed Push Day',        time:'9:14 AM',  type:'done',  color:'#4A3A5C'},
  {id:4,client:'Sara Ahmed',   action:'Missed scheduled workout',  time:'Yesterday',type:'missed',color:'#5C4A3A'},
];

// ─── HELPERS ───────────────────────────────────────────────────────────────

const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

// ─── ICONS ─────────────────────────────────────────────────────────────────

const Ico = {
  home:  ({s=20,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  users: ({s=20,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  layers:({s=20,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  hist:  ({s=20,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5L1 4"/><polyline points="1 9 1 4 6 4"/></svg>,
  user:  ({s=20,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  chevR: ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevL: ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  check: ({s=11,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:  ({s=12,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  eye:   ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  mail:  ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  lock:  ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  play:  ({s=14,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  signal:({s=16,c='currentColor'})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

// ─── SHARED ────────────────────────────────────────────────────────────────

function StatusBadge({status}){
  const on=status==='on-track';
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,padding:'2px 7px',borderRadius:3,background:on?C.onTrackBg:C.offTrackBg,color:on?C.onTrack:C.offTrack,fontSize:10,fontWeight:700,letterSpacing:'0.3px',textTransform:'uppercase',whiteSpace:'nowrap'}}><span style={{width:4,height:4,borderRadius:'50%',background:'currentColor'}}/>{on?'On Track':'Off Track'}</span>;
}

function Tag({children}){
  return <span style={{display:'inline-block',padding:'2px 7px',borderRadius:3,background:C.bg,color:C.muted,fontSize:10,fontWeight:600,letterSpacing:'0.3px',border:`1px solid ${C.rule}`,whiteSpace:'nowrap'}}>{children}</span>;
}

function Bar({value,color=C.primary,h=3}){
  return <div style={{height:h,background:C.rule,borderRadius:0,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,Math.max(0,value))}%`,background:color,transition:'width 0.5s ease'}}/></div>;
}

function Rule({style={}}){
  return <div style={{height:1,background:C.rule,...style}}/>;
}

function BackBtn({onClick}){
  return <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:5,background:'transparent',border:'1px solid rgba(255,255,255,0.28)',borderRadius:6,padding:'7px 12px',cursor:'pointer',color:'rgba(255,255,255,0.72)',fontSize:12,fontWeight:600}}><Ico.chevL s={11} c="rgba(255,255,255,0.72)"/>Back</button>;
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────

function Login({onRole}){
  const [role,setRole]=useState('client');
  const [showPw,setShowPw]=useState(false);

  const isClient=role==='client';

  return(
    <div style={{width:'100%',height:'100%',background:C.bg,display:'flex',flexDirection:'column',overflowY:'auto'}}>
      {/* Green header block */}
      <div style={{background:C.primary,padding:'52px 24px 28px',borderBottom:`3px solid ${C.accent}`,flexShrink:0}}>
        <div style={{width:42,height:42,borderRadius:9,background:'rgba(255,255,255,0.11)',border:'1px solid rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4"/></svg>
        </div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:30,color:'#fff',lineHeight:1.1}}>Fitness Savior</div>
      </div>

      {/* Form area */}
      <div style={{padding:'28px 24px 32px',flex:1}}>
        {/* Role label */}
        <div style={{marginBottom:22}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:'0.5px',color:C.text,marginBottom:2}}>
            {isClient?'Client Login':'Coach Login'}
          </div>
          <div style={{fontSize:12,color:C.muted}}>
            {isClient?'Enter your credentials to access your program.':'Enter your credentials to access your dashboard.'}
          </div>
        </div>

        {/* Email */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.muted,marginBottom:7}}>Email Address</div>
          <div style={{display:'flex',alignItems:'center',gap:10,background:C.surface,border:`1.5px solid ${C.rule}`,borderRadius:8,padding:'13px 14px'}}>
            <Ico.mail s={14} c={C.muted}/>
            <input type="email"
              key={role}
              defaultValue={isClient?'karim@example.com':'ahmed@fitnesssavior.co'}
              style={{flex:1,border:'none',outline:'none',background:'transparent',fontSize:14,color:C.text}}/>
          </div>
        </div>

        {/* Password */}
        <div style={{marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.muted,marginBottom:7}}>Password</div>
          <div style={{display:'flex',alignItems:'center',gap:10,background:C.surface,border:`1.5px solid ${C.rule}`,borderRadius:8,padding:'13px 14px'}}>
            <Ico.lock s={14} c={C.muted}/>
            <input type={showPw?'text':'password'} defaultValue="password123"
              style={{flex:1,border:'none',outline:'none',background:'transparent',fontSize:14,color:C.text}}/>
            <button onClick={()=>setShowPw(p=>!p)} style={{background:'none',border:'none',cursor:'pointer',padding:0,lineHeight:1}}><Ico.eye s={14} c={C.muted}/></button>
          </div>
        </div>

        <div style={{textAlign:'right',marginBottom:26}}>
          <span style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:'0.5px',textTransform:'uppercase',cursor:'pointer'}}>Forgot Password?</span>
        </div>

        {/* CTA */}
        <button onClick={()=>onRole(role)} style={{width:'100%',padding:'16px',background:C.primary,color:'#fff',border:`2px solid ${C.primary}`,borderRadius:8,fontSize:14,fontWeight:800,cursor:'pointer',letterSpacing:'0.3px',marginBottom:16}}>
          Login
        </button>

        {/* Role switcher */}
        <div style={{textAlign:'center'}}>
          <span style={{fontSize:13,color:C.muted}}>
            {isClient?'Are you a coach?':'Are you a client?'}{' '}
            <span onClick={()=>setRole(isClient?'coach':'client')} style={{color:C.primary,fontWeight:700,cursor:'pointer',textDecoration:'underline'}}>
              Sign in here
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────────────

function Nav({role,tab,onTab}){
  const tabs=role==='coach'
    ?[{id:'dashboard',label:'Dashboard',I:Ico.home},{id:'clients',label:'Clients',I:Ico.users},{id:'programs',label:'Programs',I:Ico.layers}]
    :[{id:'home',label:'Home',I:Ico.home},{id:'history',label:'History',I:Ico.hist},{id:'profile',label:'Profile',I:Ico.user}];
  return(
    <div style={{height:68,background:C.surface,borderTop:`2px solid ${C.border}`,display:'flex',alignItems:'stretch',flexShrink:0}}>
      {tabs.map((t,i)=>{
        const active=t.id===tab;
        return(
          <div key={t.id} onClick={()=>onTab(t.id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,cursor:'pointer',borderRight:i<tabs.length-1?`1px solid ${C.rule}`:'none',background:active?`${C.primary}08`:'transparent',borderBottom:active?`2px solid ${C.primary}`:'none',marginBottom:active?-2:0}}>
            <t.I s={19} c={active?C.primary:C.muted}/>
            <span style={{fontSize:9,fontWeight:active?800:500,color:active?C.primary:C.muted,letterSpacing:'1px',textTransform:'uppercase'}}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── COACH: DASHBOARD ──────────────────────────────────────────────────────

function CoachDashboard(){
  const today=new Date();
  const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const week=Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()-3+i);return{date:d.getDate(),day:DAYS[d.getDay()].slice(0,2),isToday:i===3};});
  const onTrackN=CLIENTS.filter(c=>c.status==='on-track').length;
  const avgPct=Math.round(CLIENTS.reduce((a,c)=>a+c.pct,0)/CLIENTS.length);

  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,WebkitOverflowScrolling:'touch'}}>
      {/* Green header */}
      <div style={{background:C.primary,padding:'52px 20px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:22}}>
          <div>
            <div style={{color:'rgba(255,255,255,0.38)',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:5}}>{DAYS[today.getDay()]}, {MONTHS[today.getMonth()]} {today.getDate()}</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:24,color:'#fff',lineHeight:1.2}}>Good morning,<br/>Coach Ahmed</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',fontWeight:700,letterSpacing:'1.5px',marginBottom:2}}>ACTIVE</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:36,color:C.accent,lineHeight:1}}>{CLIENTS.length}</div>
          </div>
        </div>

        {/* Date strip */}
        <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:12,paddingBottom:0}}>
          {week.map((d,i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer',paddingBottom:12,flex:1}}>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:'0.5px',textTransform:'uppercase',color:d.isToday?'rgba(255,255,255,0.78)':'rgba(255,255,255,0.22)'}}>{d.day}</span>
              <div style={{width:28,height:28,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',background:d.isToday?C.accent:'transparent',border:d.isToday?'none':'1px solid rgba(255,255,255,0.13)'}}>
                <span style={{fontSize:12,fontWeight:d.isToday?700:400,color:d.isToday?'#fff':'rgba(255,255,255,0.28)'}}>{d.date}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Zone continuity */}
        <div style={{height:18,background:C.bg,borderRadius:'14px 14px 0 0'}}/>
      </div>

      <div style={{padding:'0 18px 28px'}}>
        {/* ── Stat row — FIXED: centered numbers, no overflow ── */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',marginBottom:22}}>
          {[{label:'On Track',value:`${onTrackN}/${CLIENTS.length}`},{label:'Avg Completion',value:`${avgPct}%`},{label:'This Week',value:'14'}].map((s,i)=>(
            <div key={i} style={{
              padding:'14px 6px',
              textAlign:'center',
              borderRight:i<2?`1px solid ${C.rule}`:'none',
              borderBottom:`1px solid ${C.rule}`,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
              minWidth:0,
            }}>
              <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:C.primary,lineHeight:1,marginBottom:4,whiteSpace:'nowrap'}}>{s.value}</div>
              <div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:'0.3px',textAlign:'center',lineHeight:1.3}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Client list */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:12}}>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:C.text}}>Clients</div>
          <span style={{fontSize:11,color:C.primary,fontWeight:700,cursor:'pointer'}}>All →</span>
        </div>
        <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden',marginBottom:24}}>
          {CLIENTS.slice(0,4).map((cl,i)=>(
            <div key={cl.id} className={`fade-up d${i+1}`} style={{padding:'12px 13px',borderBottom:i<3?`1px solid ${C.rule}`:'none',background:C.surface}}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:7}}>
                <div style={{display:'flex',alignItems:'center',gap:9,flex:1,minWidth:0}}>
                  <div style={{width:32,height:32,borderRadius:6,flexShrink:0,background:cl.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:10,fontWeight:800}}>{cl.initials}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cl.name}</div>
                    <div style={{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}}><Tag>{cl.phase}</Tag><span style={{fontSize:10,color:C.muted}}>{cl.last}</span></div>
                  </div>
                </div>
                <div style={{flexShrink:0,marginLeft:8}}><StatusBadge status={cl.status}/></div>
              </div>
              <Bar value={cl.pct} color={cl.status==='on-track'?C.primary:C.offTrack} h={3}/>
            </div>
          ))}
        </div>

        {/* Activity */}
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:C.text,marginBottom:12}}>Activity</div>
        <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
          {ACTIVITY.map((a,i)=>(
            <div key={a.id} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 13px',borderBottom:i<ACTIVITY.length-1?`1px solid ${C.rule}`:'none',background:C.surface}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:a.type==='missed'?C.offTrack:a.type==='pr'?C.accent:C.onTrack,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <span style={{fontWeight:700,fontSize:12,color:C.text}}>{a.client}</span>
                <span style={{fontSize:12,color:a.type==='missed'?C.offTrack:C.muted}}> — {a.action}</span>
              </div>
              <span style={{fontSize:10,color:C.muted,flexShrink:0}}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COACH: CLIENTS ────────────────────────────────────────────────────────

function CoachClients(){
  const [detail,setDetail]=useState(null);
  if(detail)return<ClientDetail client={detail} onBack={()=>setDetail(null)}/>;
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,padding:'52px 18px 24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:4}}>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:26,color:C.text}}>Clients</div>
        <div style={{fontSize:12,color:C.muted}}>{CLIENTS.length} active</div>
      </div>
      <Rule style={{marginBottom:18}}/>
      <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
        {CLIENTS.map((cl,i)=>(
          <div key={cl.id} onClick={()=>setDetail(cl)} className={`fade-up d${Math.min(i+1,5)}`} style={{padding:'13px',background:C.surface,borderBottom:i<CLIENTS.length-1?`1px solid ${C.rule}`:'none',cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <div style={{width:38,height:38,borderRadius:8,background:cl.color,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:11,fontWeight:800}}>{cl.initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontWeight:700,fontSize:13,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cl.name}</span>
                  <Ico.chevR s={12} c={C.subtle}/>
                </div>
                <div style={{display:'flex',gap:5,alignItems:'center',marginTop:3,flexWrap:'wrap'}}><StatusBadge status={cl.status}/><span style={{fontSize:10,color:C.muted}}>{cl.last}</span></div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
              <Tag>{cl.phase}</Tag>
              <div style={{fontSize:10,color:C.muted}}>Streak <strong style={{color:C.text}}>{cl.streak}d</strong> &nbsp; {cl.pct}%</div>
            </div>
            <Bar value={cl.pct} color={cl.status==='on-track'?C.primary:C.offTrack}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientDetail({client,onBack}){
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,animation:'slideIn 0.2s ease both'}}>
      <div style={{background:C.primary,padding:'52px 18px 0'}}>
        <BackBtn onClick={onBack}/>
        <div style={{display:'flex',alignItems:'center',gap:13,marginTop:16,paddingBottom:22}}>
          <div style={{width:52,height:52,borderRadius:10,background:client.color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:15,fontWeight:800,flexShrink:0}}>{client.initials}</div>
          <div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:'#fff'}}>{client.name}</div>
            <div style={{color:'rgba(255,255,255,0.42)',fontSize:12,marginTop:2,marginBottom:6}}>{client.phase}</div>
            <StatusBadge status={client.status}/>
          </div>
        </div>
        <div style={{height:16,background:C.bg,borderRadius:'12px 12px 0 0'}}/>
      </div>
      <div style={{padding:'4px 18px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden',marginBottom:18}}>
          {[{l:'Streak',v:`${client.streak}d`},{l:'Done',v:`${client.pct}%`},{l:'Workouts',v:'23'}].map((s,i)=>(
            <div key={i} style={{padding:'13px 8px',textAlign:'center',borderRight:i<2?`1px solid ${C.rule}`:'none',background:C.surface}}>
              <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:C.primary,marginBottom:3}}>{s.v}</div>
              <div style={{fontSize:9,color:C.muted,fontWeight:600,letterSpacing:'0.5px'}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:C.text,marginBottom:11}}>Active Program</div>
        <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden',marginBottom:18}}>
          <div style={{background:C.surface,padding:'13px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:9}}>
              <div><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:5}}>Beginner Strength Foundation</div><Tag>4 weeks</Tag></div>
              <span style={{background:C.onTrackBg,color:C.onTrack,fontSize:9,fontWeight:800,padding:'3px 7px',borderRadius:3,letterSpacing:'0.5px',textTransform:'uppercase'}}>Active</span>
            </div>
            <div style={{display:'flex',gap:5}}>{['Sun','Tue','Thu'].map(d=><span key={d} style={{padding:'3px 8px',borderRadius:3,background:`${C.primary}12`,color:C.primary,fontSize:10,fontWeight:700}}>{d}</span>)}</div>
          </div>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button style={{flex:1,padding:'13px',background:C.primary,border:`2px solid ${C.primary}`,borderRadius:8,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>Reassign Program</button>
          <button style={{flex:1,padding:'13px',background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:13,fontWeight:600,cursor:'pointer'}}>Message</button>
        </div>
      </div>
    </div>
  );
}

// ─── COACH: PROGRAMS ───────────────────────────────────────────────────────

function CoachPrograms(){
  const [detail,setDetail]=useState(null);
  if(detail)return<ProgramDetail program={detail} onBack={()=>setDetail(null)}/>;
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,padding:'52px 18px 24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:4}}>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:26,color:C.text}}>Programs</div>
        <button style={{display:'flex',alignItems:'center',gap:5,background:C.primary,color:'#fff',border:'none',borderRadius:6,padding:'8px 12px',fontSize:12,fontWeight:700,cursor:'pointer'}}><Ico.plus s={11} c="#fff"/>New</button>
      </div>
      <Rule style={{marginBottom:18}}/>
      <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
        {PROGRAMS.map((p,i)=>(
          <div key={p.id} onClick={()=>setDetail(p)} className={`fade-up d${i+1}`} style={{padding:'15px 13px',background:C.surface,cursor:'pointer',borderBottom:i<PROGRAMS.length-1?`1px solid ${C.rule}`:'none'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:9}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:6,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name}</div><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{p.schedule.map(d=><span key={d} style={{padding:'2px 7px',borderRadius:3,background:`${C.primary}12`,color:C.primary,fontSize:10,fontWeight:700}}>{d}</span>)}</div></div>
              <Ico.chevR s={12} c={C.subtle}/>
            </div>
            <Rule style={{marginBottom:9}}/>
            <div style={{display:'flex',gap:14,fontSize:11,color:C.muted}}>
              <span><strong style={{color:C.text}}>{p.workouts.length}</strong> workouts</span>
              <span><strong style={{color:C.text}}>{p.weeks}</strong> weeks</span>
              <span><strong style={{color:C.text}}>{p.assigned}</strong> assigned</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramDetail({program,onBack}){
  const [expanded,setExpanded]=useState(null);
  const ALL=['S','M','T','W','T','F','S'];
  const FULL=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,animation:'slideIn 0.2s ease both'}}>
      <div style={{background:C.primary,padding:'52px 18px 0'}}>
        <BackBtn onClick={onBack}/>
        <div style={{marginTop:14,paddingBottom:22}}>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:'#fff',lineHeight:1.2,marginBottom:8}}>{program.name}</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.7)',padding:'3px 10px',borderRadius:3,fontSize:11,fontWeight:600,border:'1px solid rgba(255,255,255,0.15)'}}>{program.weeks} weeks</span>
            <span style={{fontSize:11,color:'rgba(255,255,255,0.32)'}}>{program.assigned} clients</span>
          </div>
        </div>
        <div style={{height:16,background:C.bg,borderRadius:'12px 12px 0 0'}}/>
      </div>
      <div style={{padding:'4px 18px 24px'}}>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.muted,marginBottom:9}}>Schedule</div>
          <div style={{display:'flex',gap:3,border:`1.5px solid ${C.border}`,borderRadius:8,overflow:'hidden'}}>
            {ALL.map((d,i)=>{const active=program.schedule.includes(FULL[i]);return <div key={i} style={{flex:1,padding:'9px 0',textAlign:'center',background:active?C.primary:C.surface,borderRight:i<6?`1px solid ${C.rule}`:'none'}}><div style={{fontSize:10,fontWeight:700,color:active?'#fff':C.muted}}>{d}</div></div>;})}
          </div>
        </div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:C.text,marginBottom:11}}>Workouts</div>
        <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden',marginBottom:18}}>
          {program.workouts.map((w,i)=>(
            <div key={w.id} style={{borderBottom:i<program.workouts.length-1?`1px solid ${C.rule}`:'none'}}>
              <div onClick={()=>setExpanded(expanded===w.id?null:w.id)} style={{padding:'13px',background:C.surface,display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}}>
                <div><div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:2}}>{w.name}</div><div style={{fontSize:11,color:C.muted}}>{w.day} · {w.exercises.length} exercises</div></div>
                <div style={{transform:expanded===w.id?'rotate(90deg)':'none',transition:'transform 0.18s'}}><Ico.chevR s={12} c={C.muted}/></div>
              </div>
              {expanded===w.id&&(
                <div style={{background:C.bg,borderTop:`1px solid ${C.rule}`}}>
                  {w.exercises.map((ex,j)=>(
                    <div key={j} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 13px',borderBottom:j<w.exercises.length-1?`1px solid ${C.rule}`:'none'}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{fontSize:10,fontWeight:800,color:C.muted,width:14}}>{j+1}</span><span style={{fontSize:12,fontWeight:600,color:C.text}}>{ex.n}</span></div>
                      <div style={{display:'flex',gap:10,fontSize:11}}><span style={{fontWeight:700,color:C.text}}>{ex.s}×{ex.r}</span><span style={{color:C.muted}}>{ex.rest}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button style={{width:'100%',padding:'14px',background:C.primary,border:`2px solid ${C.primary}`,borderRadius:8,color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer'}}>Assign to Client</button>
      </div>
    </div>
  );
}

// ─── CLIENT: HOME ──────────────────────────────────────────────────────────

function ClientHome({onStart}){
  const WEEK=[
    {name:'Push Day',day:'Today',    status:'today'},
    {name:'Rest',    day:'Monday',   status:'rest'},
    {name:'Pull Day',day:'Tuesday',  status:'upcoming'},
    {name:'Rest',    day:'Wednesday',status:'rest'},
    {name:'Leg Day', day:'Thursday', status:'upcoming'},
  ];
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg}}>
      <div style={{background:C.primary,padding:'52px 18px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:18}}>
          <div>
            <div style={{color:'rgba(255,255,255,0.38)',fontSize:10,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',marginBottom:5}}>Welcome back</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:24,color:'#fff'}}>Karim Hassan</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',fontWeight:700,letterSpacing:'1.5px',marginBottom:2}}>STREAK</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:34,color:C.accent,lineHeight:1}}>5</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',fontWeight:600}}>days</div>
          </div>
        </div>
        {/* Compact streak strip */}
        <div style={{display:'flex',gap:3,paddingBottom:16}}>
          {['M','T','W','T','F','S','S'].map((d,i)=>(
            <div key={i} style={{flex:1}}>
              <div style={{height:3,borderRadius:2,background:i<5?C.accent:'rgba(255,255,255,0.13)',marginBottom:4}}/>
              <div style={{fontSize:8,color:'rgba(255,255,255,0.25)',textAlign:'center',fontWeight:700}}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{height:16,background:C.bg,borderRadius:'14px 14px 0 0'}}/>
      </div>

      <div style={{padding:'4px 18px 28px'}}>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:C.text,marginBottom:11}}>Today's Workout</div>
        <div onClick={onStart} style={{background:C.primary,borderRadius:10,cursor:'pointer',border:`2px solid ${C.primary}`,overflow:'hidden',marginBottom:22}}>
          <div style={{padding:'16px 16px 13px',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontSize:9,color:'rgba(255,255,255,0.32)',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',marginBottom:5}}>{TODAY_WO.program}</div>
                <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:'#fff',lineHeight:1.1}}>{TODAY_WO.name}</div>
              </div>
              <div style={{background:C.accent,width:38,height:38,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginLeft:10}}><Ico.play s={13} c="#fff"/></div>
            </div>
          </div>
          <div style={{padding:'11px 16px',display:'flex',justifyContent:'space-between'}}>
            {[{v:TODAY_WO.exercises.length,l:'exercises'},{v:'~45',l:'min'},{v:'4',l:'sets avg'}].map((s,i)=>(
              <div key={i} style={{fontSize:11,color:'rgba(255,255,255,0.42)'}}><span style={{fontFamily:'DM Serif Display, serif',fontSize:16,color:'#fff'}}>{s.v}</span> {s.l}</div>
            ))}
          </div>
        </div>

        <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:C.text,marginBottom:11}}>This Week</div>
        <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
          {WEEK.map((w,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:11,padding:'11px 13px',background:C.surface,borderBottom:i<WEEK.length-1?`1px solid ${C.rule}`:'none',opacity:w.status==='rest'?0.48:1}}>
              <div style={{width:6,height:6,borderRadius:'50%',flexShrink:0,background:w.status==='today'?C.primary:w.status==='rest'?C.rule:C.subtle}}/>
              <div style={{flex:1}}><span style={{fontWeight:w.status==='today'?700:500,fontSize:13,color:C.text}}>{w.name}</span></div>
              <span style={{fontSize:11,color:w.status==='today'?C.primary:C.muted,fontWeight:w.status==='today'?700:400}}>{w.day}</span>
              {w.status==='today'&&<div style={{width:5,height:5,borderRadius:'50%',background:C.accent}}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ACTIVE WORKOUT ────────────────────────────────────────────────────────

function ActiveWorkout({onExit}){
  const [exIdx,setExIdx]=useState(0);
  const [setNum,setSetNum]=useState(1);
  const [logs,setLogs]=useState({});
  const [done,setDone]=useState(false);
  const [wt,setWt]=useState('');
  const [reps,setReps]=useState('');
  const [elapsed,setElapsed]=useState(0);
  const [restLeft,setRestLeft]=useState(0);
  const [resting,setResting]=useState(false);
  const elRef=useRef(null);
  const restRef=useRef(null);

  const ex=TODAY_WO.exercises[exIdx];
  const totalSets=TODAY_WO.exercises.reduce((s,e)=>s+e.sets,0);
  const doneSets=Object.keys(logs).length;
  const isLastEx=exIdx>=TODAY_WO.exercises.length-1;
  const isLastSet=setNum>=ex.sets;

  useEffect(()=>{elRef.current=setInterval(()=>setElapsed(e=>e+1),1000);return()=>clearInterval(elRef.current);},[]);

  const startRest=dur=>{
    setResting(true);setRestLeft(dur);
    restRef.current=setInterval(()=>setRestLeft(r=>{
      if(r<=1){clearInterval(restRef.current);setResting(false);return 0;}
      return r-1;
    }),1000);
  };

  const logSet=()=>{
    if(!reps)return;
    const key=`${exIdx}-${setNum}`;
    setLogs(p=>({...p,[key]:{wt:wt||'BW',reps}}));
    setWt('');setReps('');
    if(isLastSet&&isLastEx){clearInterval(elRef.current);setDone(true);}
    else if(isLastSet){startRest(ex.rest);setExIdx(i=>i+1);setSetNum(1);}
    else{startRest(ex.rest);setSetNum(s=>s+1);}
  };

  const TOPS=['#12302A','#131E2E','#1E1228','#261A08'];
  if(done)return<WorkoutComplete elapsed={elapsed} totalSets={totalSets} onDone={onExit}/>;

  const loggedThisEx=Object.entries(logs).filter(([k])=>k.startsWith(`${exIdx}-`));

  return(
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',background:'#0D0D0D'}}>
      {/* ── Dark top section — FIXED: title clear of curve ── */}
      <div style={{
        /* Use a fixed px height tall enough to show title above the curve */
        minHeight: 260,
        height:'44%',
        background:`linear-gradient(155deg,${TOPS[exIdx%4]} 0%,#0A0A0A 100%)`,
        position:'relative',overflow:'hidden',flexShrink:0,
        display:'flex',flexDirection:'column',
      }}>
        {/* Progress strip */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'rgba(255,255,255,0.06)'}}>
          <div style={{height:'100%',width:`${(doneSets/totalSets)*100}%`,background:C.accent,transition:'width 0.4s ease'}}/>
        </div>

        {/* Controls */}
        <div style={{position:'absolute',top:0,left:0,right:0,padding:'20px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:10}}>
          <button onClick={onExit} style={{display:'flex',alignItems:'center',gap:4,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:6,padding:'7px 11px',cursor:'pointer',color:'rgba(255,255,255,0.52)',fontSize:12,fontWeight:600}}>
            <Ico.chevL s={11} c="rgba(255,255,255,0.52)"/>Exit
          </button>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:'rgba(255,255,255,0.6)',letterSpacing:'2px'}}>{fmt(elapsed)}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.28)',fontWeight:600}}>{exIdx+1}/{TODAY_WO.exercises.length}</div>
        </div>

        {/* Ghost number — pushed left, won't interfere with title */}
        <div style={{
          position:'absolute',bottom:52,left:-8,
          fontFamily:'DM Serif Display, serif',fontSize:'min(160px, 38vw)',
          color:'rgba(255,255,255,0.025)',lineHeight:1,
          userSelect:'none',pointerEvents:'none',
        }}>
          {String(exIdx+1).padStart(2,'0')}
        </div>

        {/* ── Exercise title — FIXED: sits above the curve ── */}
        <div style={{
          position:'absolute',
          /* Keep title above the organic curve (curve is ~48px tall, so bottom:56px clears it) */
          bottom:58,
          left:20,right:20,zIndex:5
        }}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:'3px',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:7}}>{ex.muscle}</div>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:28,color:'#fff',lineHeight:1.15}}>{ex.name}</div>
        </div>

        {/* Organic edge */}
        <div style={{position:'absolute',bottom:-2,left:-20,right:-20,height:50,background:C.bg,borderRadius:'50% 50% 0 0 / 100% 100% 0 0'}}/>
      </div>

      {/* ── Log sheet ── */}
      <div style={{flex:1,background:C.bg,overflowY:'auto',display:'flex',flexDirection:'column',position:'relative'}}>

        {/* Rest overlay */}
        {resting&&(
          <div style={{position:'absolute',inset:0,background:`${C.primary}F5`,zIndex:60,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:'4px',textTransform:'uppercase',color:'rgba(255,255,255,0.28)',marginBottom:8}}>Rest</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:80,color:'#fff',lineHeight:0.9,marginBottom:10}}>{fmt(restLeft)}</div>
            <div style={{fontSize:12,color:'rgba(255,255,255,0.28)',marginBottom:28}}>Next: {isLastSet&&!isLastEx?TODAY_WO.exercises[exIdx+1]?.name:`Set ${setNum}`}</div>
            <button onClick={()=>{clearInterval(restRef.current);setResting(false);}} style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.14)',color:'#fff',borderRadius:8,padding:'11px 28px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Skip Rest</button>
          </div>
        )}

        <div style={{padding:'4px 18px 20px',flex:1,display:'flex',flexDirection:'column'}}>
          {/* Scoreboard */}
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:12,paddingBottom:12,borderBottom:`1px solid ${C.rule}`,marginBottom:14}}>
            {[{label:'Set',value:`${setNum}`,unit:`/${ex.sets}`,color:C.primary},{label:'Target',value:ex.reps,unit:'',color:C.text},{label:'Rest',value:`${ex.rest}`,unit:'s',color:C.text}].map((s,i)=>(
              <div key={i} style={{textAlign:i===0?'left':i===1?'center':'right'}}>
                <div style={{fontSize:8,fontWeight:800,letterSpacing:'2.5px',textTransform:'uppercase',color:C.muted,marginBottom:3}}>{s.label}</div>
                <div style={{fontFamily:'DM Serif Display, serif',lineHeight:1}}>
                  <span style={{fontSize:40,color:s.color}}>{s.value}</span>
                  {s.unit&&<span style={{fontSize:16,color:C.subtle}}>{s.unit}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Inputs */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:11}}>
            {[{label:'Weight (kg)',val:wt,set:setWt},{label:'Reps done',val:reps,set:setReps}].map((inp,i)=>(
              <div key={i}>
                <div style={{fontSize:9,fontWeight:800,letterSpacing:'2px',textTransform:'uppercase',color:C.muted,marginBottom:6}}>{inp.label}</div>
                <input type="number" value={inp.val} placeholder="—" inputMode="numeric" onChange={e=>inp.set(e.target.value)}
                  style={{width:'100%',padding:'11px',textAlign:'center',background:C.surface,border:`1.5px solid ${C.rule}`,borderRadius:8,fontSize:26,fontWeight:800,color:C.text,outline:'none',transition:'border-color 0.15s'}}
                  onFocus={e=>e.target.style.borderColor=C.primary}
                  onBlur={e=>e.target.style.borderColor=C.rule}/>
              </div>
            ))}
          </div>

          <button onClick={logSet} style={{width:'100%',padding:'14px',background:reps?C.primary:C.rule,border:`2px solid ${reps?C.primary:C.rule}`,borderRadius:8,color:reps?'#fff':C.muted,fontSize:13,fontWeight:800,cursor:reps?'pointer':'default',letterSpacing:'0.3px',marginBottom:12,transition:'all 0.2s'}}>
            {isLastSet&&isLastEx?'Complete Workout':'Log Set'}
          </button>

          {/* ── Logged sets — FIXED: compact display ── */}
          {loggedThisEx.length>0&&(
            <div style={{flex:1}}>
              <div style={{fontSize:9,fontWeight:800,letterSpacing:'2px',textTransform:'uppercase',color:C.muted,marginBottom:6}}>Logged</div>
              <div style={{border:`1px solid ${C.rule}`,borderRadius:7,overflow:'hidden'}}>
                {loggedThisEx.map(([k,v],i,arr)=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 10px',background:C.surface,borderBottom:i<arr.length-1?`1px solid ${C.rule}`:'none'}}>
                    <span style={{fontSize:10,color:C.muted,fontWeight:600}}>Set {k.split('-')[1]}</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.text}}>{v.wt} kg × {v.reps}</span>
                    <Ico.check s={10} c={C.onTrack}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WORKOUT COMPLETE ──────────────────────────────────────────────────────

function WorkoutComplete({elapsed,totalSets,onDone}){
  return(
    <div style={{position:'absolute',inset:0,background:C.primary,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'36px 24px',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:C.accent}}/>
      <div style={{position:'relative',zIndex:1,textAlign:'center',width:'100%'}}>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:13,color:'rgba(255,255,255,0.28)',fontStyle:'italic',letterSpacing:'1px',marginBottom:12}}>Workout complete</div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:44,color:'#fff',lineHeight:1.1,marginBottom:5}}>Push Day</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.28)',marginBottom:32,letterSpacing:'0.5px'}}>Beginner Strength Foundation</div>
        <div style={{border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,overflow:'hidden',marginBottom:14}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)'}}>
            {[{label:'Duration',value:fmt(elapsed)},{label:'Sets',value:String(totalSets)},{label:'Streak',value:'6d'}].map((s,i)=>(
              <div key={i} style={{padding:'14px 8px',textAlign:'center',background:'rgba(255,255,255,0.06)',borderRight:i<2?'1px solid rgba(255,255,255,0.08)':'none'}}>
                <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:'#fff',marginBottom:3}}>{s.value}</div>
                <div style={{fontSize:9,color:'rgba(255,255,255,0.32)',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{border:`1px solid ${C.accent}38`,background:`${C.accent}15`,borderRadius:10,padding:'14px 16px',display:'flex',alignItems:'center',gap:13,marginBottom:28,textAlign:'left'}}>
          <div style={{width:38,height:38,borderRadius:8,background:`${C.accent}22`,border:`1px solid ${C.accent}45`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Ico.signal s={16} c={C.accent}/>
          </div>
          <div>
            <div style={{fontSize:9,color:'rgba(255,255,255,0.28)',fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:3}}>Streak extended</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:'#fff'}}>5 <span style={{color:'rgba(255,255,255,0.28)',fontSize:15}}>—</span> 6 days</div>
          </div>
        </div>
        <button onClick={onDone} style={{width:'100%',padding:'15px',background:'#fff',border:'2px solid #fff',borderRadius:8,color:C.primary,fontSize:14,fontWeight:800,cursor:'pointer',letterSpacing:'0.3px'}}>Back to Home</button>
      </div>
    </div>
  );
}

// ─── CLIENT: HISTORY ───────────────────────────────────────────────────────

function ClientHistory(){
  const HIST=[
    {name:'Pull Day', date:'Yesterday',  dur:'38 min',sets:15,done:true},
    {name:'Push Day', date:'2 days ago', dur:'44 min',sets:17,done:true},
    {name:'Leg Day',  date:'3 days ago', dur:'51 min',sets:18,done:true},
    {name:'Rest Day', date:'4 days ago', dur:null,    sets:0, done:false},
    {name:'Pull Day', date:'5 days ago', dur:'40 min',sets:15,done:true},
  ];
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,padding:'52px 18px 24px'}}>
      <div style={{fontFamily:'DM Serif Display, serif',fontSize:26,color:C.text,marginBottom:4}}>History</div>
      <Rule style={{marginBottom:18}}/>
      <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
        {HIST.map((w,i)=>(
          <div key={i} className={`fade-up d${Math.min(i+1,5)}`} style={{display:'flex',alignItems:'center',gap:11,padding:'12px 13px',background:C.surface,borderBottom:i<HIST.length-1?`1px solid ${C.rule}`:'none'}}>
            <div style={{width:8,height:8,borderRadius:2,flexShrink:0,background:w.done?C.primary:C.rule}}/>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:w.done?C.text:C.muted}}>{w.name}</div><div style={{fontSize:10,color:C.muted,marginTop:1}}>{w.date}</div></div>
            {w.dur&&<div style={{textAlign:'right'}}><div style={{fontWeight:700,fontSize:12,color:C.text}}>{w.dur}</div><div style={{fontSize:10,color:C.muted}}>{w.sets} sets</div></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENT: PROFILE ───────────────────────────────────────────────────────

function ClientProfile({onLogout}){
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:C.bg,padding:'52px 18px 24px'}}>
      <div style={{display:'flex',alignItems:'center',gap:13,marginBottom:20,paddingBottom:18,borderBottom:`1.5px solid ${C.border}`}}>
        <div style={{width:56,height:56,borderRadius:10,background:C.primary,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:18,fontWeight:800,flexShrink:0}}>KH</div>
        <div><div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:C.text}}>Karim Hassan</div><div style={{fontSize:11,color:C.muted,marginTop:2,marginBottom:7}}>Member since March 2024</div><Tag>Beginner Strength</Tag></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden',marginBottom:22}}>
        {[{l:'Workouts',v:'23'},{l:'Best Streak',v:'9 days'},{l:'Avg Duration',v:'44 min'},{l:'Coach',v:'Ahmed S.'}].map((s,i)=>(
          <div key={i} style={{padding:'13px',background:C.surface,borderRight:i%2===0?`1px solid ${C.rule}`:'none',borderBottom:i<2?`1px solid ${C.rule}`:'none'}}>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:C.primary,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:10,color:C.muted,fontWeight:600}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:C.text,marginBottom:11}}>Settings</div>
      <div style={{border:`1.5px solid ${C.border}`,borderRadius:10,overflow:'hidden',marginBottom:18}}>
        {['Notifications','Weight Units','Language','Help & Support'].map((item,i,arr)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 13px',background:C.surface,borderBottom:i<arr.length-1?`1px solid ${C.rule}`:'none',cursor:'pointer'}}>
            <span style={{fontSize:13,fontWeight:500,color:C.text}}>{item}</span><Ico.chevR s={12} c={C.subtle}/>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{width:'100%',padding:'13px',background:C.offTrackBg,color:C.offTrack,border:`1.5px solid ${C.offTrack}28`,borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',letterSpacing:'0.3px'}}>Sign Out</button>
    </div>
  );
}

// ─── ROOT — RESPONSIVE ─────────────────────────────────────────────────────

export default function FitnessSavior(){
  const [role,setRole]=useState(null);
  const [tab,setTab]=useState('home');
  const [workout,setWorkout]=useState(false);

  const handleRole=r=>{setRole(r);setTab(r==='coach'?'dashboard':'home');};
  const handleLogout=()=>{setRole(null);setTab('home');setWorkout(false);};

  return(
    <>
      <style>{CSS}</style>
      {/*
        Responsive wrapper:
        - On mobile: fills full viewport
        - On desktop: centered column, max 480px, phone-like
      */}
      <div style={{
        display:'flex',alignItems:'flex-start',justifyContent:'center',
        minHeight:'100dvh',background:'#8E8A84',
      }}>
        <div style={{
          width:'100%',maxWidth:480,
          height:'100dvh',
          display:'flex',flexDirection:'column',
          background:C.bg,
          boxShadow:'0 0 60px rgba(0,0,0,0.35)',
          position:'relative',overflow:'hidden',
        }}>
          {!role
            ?<Login onRole={handleRole}/>
            :(
              <>
                <div style={{flex:1,overflow:'hidden',position:'relative'}}>
                  {role==='coach'?(
                    <>{tab==='dashboard'&&<CoachDashboard/>}{tab==='clients'&&<CoachClients/>}{tab==='programs'&&<CoachPrograms/>}</>
                  ):workout
                    ?<ActiveWorkout onExit={()=>setWorkout(false)}/>
                    :(
                      <>{tab==='home'&&<ClientHome onStart={()=>setWorkout(true)}/>}{tab==='history'&&<ClientHistory/>}{tab==='profile'&&<ClientProfile onLogout={handleLogout}/>}</>
                    )
                  }
                </div>
                {!workout&&<Nav role={role} tab={tab} onTab={setTab}/>}
              </>
            )
          }
        </div>


      </div>
    </>
  );
}
