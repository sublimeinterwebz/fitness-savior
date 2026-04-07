import { useState, useEffect, useRef } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; font-family: 'Plus Jakarta Sans', sans-serif; }
  ::-webkit-scrollbar { display: none; }
  * { scrollbar-width: none; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideRight { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
  @keyframes celebPop { 0%{transform:scale(0.55);opacity:0} 65%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  .anim-up { animation: fadeUp 0.32s ease both; }
  .d1{animation-delay:.04s} .d2{animation-delay:.08s} .d3{animation-delay:.12s} .d4{animation-delay:.16s} .d5{animation-delay:.20s}
  input[type=number]{-moz-appearance:textfield}
  input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
`;

const T = {
  bg:'#F5F2EE', surface:'#FFFFFF', primary:'#1E4D3A',
  accent:'#C8A96E',
  onTrack:'#2D7A35', onTrackBg:'#E8F2E9',
  offTrack:'#C85A3A', offTrackBg:'#FAEAE6',
  text:'#1A1A1A', muted:'#8A8580', subtle:'#C4BFB9',
  border:'rgba(0,0,0,0.07)',
  shadow:'0 2px 16px rgba(0,0,0,0.07)',
};

const CLIENTS = [
  {id:1,name:'Karim Hassan',initials:'KH',status:'on-track',phase:'Beginner Strength',lastActivity:'2 hrs ago',streak:5,completion:87,color:'#1E4D3A'},
  {id:2,name:'Sara Ahmed',initials:'SA',status:'off-track',phase:'Cardio & Tone',lastActivity:'3 days ago',streak:0,completion:42,color:'#8A6A4A'},
  {id:3,name:'Omar Khalil',initials:'OK',status:'on-track',phase:'Powerlifting Prep',lastActivity:'Yesterday',streak:12,completion:94,color:'#3A5A7A'},
  {id:4,name:'Nadia Mostafa',initials:'NM',status:'on-track',phase:'Beginner Strength',lastActivity:'Today',streak:3,completion:71,color:'#5A4A7A'},
  {id:5,name:'Youssef Emad',initials:'YE',status:'off-track',phase:'Cardio & Tone',lastActivity:'5 days ago',streak:0,completion:28,color:'#7A4A4A'},
];

const PROGRAMS = [
  {id:1,name:'Beginner Strength Foundation',phase:'Beginner Strength',weeks:4,assigned:2,schedule:['Sun','Tue','Thu'],
    workouts:[
      {id:1,name:'Push Day',day:'Sunday',exercises:[{name:'Bench Press',sets:4,reps:'8–10',rest:'90s'},{name:'Overhead Press',sets:3,reps:'8–10',rest:'90s'},{name:'Incline DB Press',sets:3,reps:'10–12',rest:'60s'},{name:'Tricep Pushdown',sets:3,reps:'12–15',rest:'45s'},{name:'Lateral Raises',sets:3,reps:'12–15',rest:'45s'}]},
      {id:2,name:'Pull Day',day:'Tuesday',exercises:[{name:'Deadlift',sets:4,reps:'5–6',rest:'120s'},{name:'Barbell Row',sets:3,reps:'8–10',rest:'90s'},{name:'Pull-ups',sets:3,reps:'6–8',rest:'90s'},{name:'Face Pulls',sets:3,reps:'15–20',rest:'45s'},{name:'Bicep Curls',sets:3,reps:'12–15',rest:'45s'}]},
      {id:3,name:'Leg Day',day:'Thursday',exercises:[{name:'Back Squat',sets:4,reps:'6–8',rest:'120s'},{name:'Romanian Deadlift',sets:3,reps:'10–12',rest:'90s'},{name:'Leg Press',sets:3,reps:'12–15',rest:'60s'},{name:'Leg Curl',sets:3,reps:'12–15',rest:'45s'},{name:'Calf Raises',sets:4,reps:'15–20',rest:'30s'}]},
    ]},
  {id:2,name:'Cardio & Tone',phase:'Cardio & Tone',weeks:6,assigned:2,schedule:['Mon','Wed','Fri','Sat'],
    workouts:[
      {id:4,name:'Upper Tone',day:'Monday',exercises:[{name:'Push-ups',sets:3,reps:'15–20',rest:'45s'},{name:'Dumbbell Row',sets:3,reps:'12–15',rest:'45s'},{name:'Shoulder Press',sets:3,reps:'12–15',rest:'45s'},{name:'Plank',sets:3,reps:'30s',rest:'30s'}]},
      {id:5,name:'HIIT Circuit',day:'Wednesday',exercises:[{name:'Burpees',sets:4,reps:'10',rest:'30s'},{name:'Jump Squats',sets:4,reps:'15',rest:'30s'},{name:'Mountain Climbers',sets:4,reps:'20',rest:'30s'},{name:'High Knees',sets:4,reps:'30s',rest:'30s'}]},
    ]},
  {id:3,name:'Powerlifting Prep',phase:'Powerlifting Prep',weeks:8,assigned:1,schedule:['Sun','Mon','Wed','Fri'],
    workouts:[
      {id:6,name:'Squat Focus',day:'Sunday',exercises:[{name:'Back Squat',sets:5,reps:'5',rest:'3 min'},{name:'Front Squat',sets:3,reps:'3',rest:'2 min'},{name:'Pause Squat',sets:3,reps:'3',rest:'2 min'},{name:'Leg Press',sets:3,reps:'8–10',rest:'90s'}]},
    ]},
];

const TODAY_WO = {
  name:'Push Day',program:'Beginner Strength Foundation',
  exercises:[
    {id:1,name:'Bench Press',sets:4,reps:'8–10',rest:90,muscle:'Chest'},
    {id:2,name:'Overhead Press',sets:3,reps:'8–10',rest:90,muscle:'Shoulders'},
    {id:3,name:'Incline DB Press',sets:3,reps:'10–12',rest:60,muscle:'Chest'},
    {id:4,name:'Tricep Pushdown',sets:3,reps:'12–15',rest:45,muscle:'Triceps'},
  ]
};

const ACTIVITY = [
  {id:1,client:'Karim Hassan',initials:'KH',action:'Completed Pull Day',time:'2 hrs ago',type:'done',color:'#1E4D3A'},
  {id:2,client:'Omar Khalil',initials:'OK',action:'New PR — Squat 140kg',time:'5 hrs ago',type:'pr',color:'#3A5A7A'},
  {id:3,client:'Nadia Mostafa',initials:'NM',action:'Completed Push Day',time:'9:14 AM',type:'done',color:'#5A4A7A'},
  {id:4,client:'Sara Ahmed',initials:'SA',action:'Missed scheduled workout',time:'Yesterday',type:'missed',color:'#8A6A4A'},
];

function fmtTime(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}

function IHome({s=22,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;}
function IUsers({s=22,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9"cy="7"r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;}
function ILayers({s=22,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;}
function IHistory({s=22,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5L1 4"/><polyline points="1 9 1 4 6 4"/></svg>;}
function IUser({s=22,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12"cy="7"r="4"/></svg>;}
function IChevR({s=16,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;}
function IChevL({s=16,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;}
function IBell({s=18,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="1.8"strokeLinecap="round"strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;}
function IPlay({s=16,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill={c}stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>;}
function ISearch({s=15,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"><circle cx="11"cy="11"r="8"/><line x1="21"y1="21"x2="16.65"y2="16.65"/></svg>;}
function IPlus({s=13,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="2.5"strokeLinecap="round"><line x1="12"y1="5"x2="12"y2="19"/><line x1="5"y1="12"x2="19"y2="12"/></svg>;}
function ICheck({s=13,c='currentColor'}){return<svg width={s}height={s}viewBox="0 0 24 24"fill="none"stroke={c}strokeWidth="2.5"strokeLinecap="round"strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;}

function Avatar({initials,color,size=40}){
  return<div style={{width:size,height:size,borderRadius:'50%',background:color,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:Math.round(size*0.33),fontWeight:700,flexShrink:0,letterSpacing:'0.02em'}}>{initials}</div>;
}

function StatusPill({status}){
  const on=status==='on-track';
  return<span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:100,background:on?T.onTrackBg:T.offTrackBg,color:on?T.onTrack:T.offTrack,fontSize:11,fontWeight:700,flexShrink:0}}><span style={{width:5,height:5,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/>{on?'On Track':'Off Track'}</span>;
}

function PhasePill({children}){
  return<span style={{display:'inline-block',padding:'3px 10px',borderRadius:100,background:'#EDE9E3',color:'#6A6560',fontSize:11,fontWeight:600,flexShrink:0}}>{children}</span>;
}

function Card({children,style={},onClick,className=''}){
  return<div onClick={onClick} className={className} style={{background:T.surface,borderRadius:16,boxShadow:T.shadow,overflow:'hidden',cursor:onClick?'pointer':'default',...style}} onMouseDown={onClick?e=>{e.currentTarget.style.transform='scale(0.99)'}:undefined} onMouseUp={onClick?e=>{e.currentTarget.style.transform='scale(1)'}:undefined} onMouseLeave={onClick?e=>{e.currentTarget.style.transform='scale(1)'}:undefined}>{children}</div>;
}

function ProgressBar({value,color=T.primary,h=5}){
  return<div style={{height:h,background:'#EDE9E3',borderRadius:100,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.min(100,Math.max(0,value))}%`,background:color,borderRadius:100,transition:'width 0.6s cubic-bezier(0.22,1,0.36,1)'}}/></div>;
}

function BackBtn({onClick}){
  return<button onClick={onClick} style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.13)',border:'1px solid rgba(255,255,255,0.17)',borderRadius:10,padding:'8px 14px',cursor:'pointer',color:'rgba(255,255,255,0.82)',fontSize:13,fontWeight:600,fontFamily:'Plus Jakarta Sans, sans-serif'}}><IChevL s={12} c="rgba(255,255,255,0.82)"/>Back</button>;
}

function GridTex(){
  return<div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:0.06,backgroundImage:'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',backgroundSize:'30px 30px'}}/>;
}

function LoginScreen({onRole}){
  return(
    <div style={{width:'100%',height:'100%',background:T.primary,position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 32px'}}>
      <GridTex/>
      <div style={{position:'absolute',top:-80,right:-60,width:240,height:240,borderRadius:'50%',background:'rgba(200,169,110,0.14)'}}/>
      <div style={{position:'absolute',bottom:-100,left:-70,width:260,height:260,borderRadius:'50%',background:'rgba(200,169,110,0.09)'}}/>
      <div style={{position:'relative',zIndex:1,width:'100%'}}>
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{width:76,height:76,margin:'0 auto 22px',background:'rgba(255,255,255,0.1)',borderRadius:22,border:'1px solid rgba(255,255,255,0.16)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width={34}height={34}viewBox="0 0 24 24"fill="none"stroke="white"strokeWidth="1.6"strokeLinecap="round"strokeLinejoin="round"><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4"/></svg>
          </div>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:36,color:'#fff',marginBottom:10,lineHeight:1}}>Fitness Savior</div>
          <div style={{color:'rgba(255,255,255,0.42)',fontSize:14,lineHeight:1.7}}>The coaching platform that replaces<br/>the PDF and the group chat.</div>
        </div>
        <div style={{color:'rgba(255,255,255,0.3)',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',textAlign:'center',marginBottom:18}}>Continue as</div>
        <div onClick={()=>onRole('coach')} style={{background:'#fff',borderRadius:18,padding:'18px 20px',display:'flex',alignItems:'center',gap:14,marginBottom:12,cursor:'pointer',boxShadow:'0 8px 32px rgba(0,0,0,0.2)'}}>
          <div style={{width:50,height:50,background:T.bg,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>🎯</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:T.text,marginBottom:2}}>Coach</div><div style={{fontSize:13,color:T.muted}}>Manage clients & programs</div></div>
          <IChevR s={16} c={T.muted}/>
        </div>
        <div onClick={()=>onRole('client')} style={{background:'rgba(255,255,255,0.1)',borderRadius:18,padding:'18px 20px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',border:'1px solid rgba(255,255,255,0.14)'}}>
          <div style={{width:50,height:50,background:'rgba(255,255,255,0.12)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0}}>💪</div>
          <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:'#fff',marginBottom:2}}>Client</div><div style={{fontSize:13,color:'rgba(255,255,255,0.42)'}}>View workouts & track progress</div></div>
          <IChevR s={16} c="rgba(255,255,255,0.35)"/>
        </div>
      </div>
    </div>
  );
}

function BottomNav({role,tab,onTab}){
  const coachTabs=[{id:'dashboard',label:'Dashboard',Icon:IHome},{id:'clients',label:'Clients',Icon:IUsers},{id:'programs',label:'Programs',Icon:ILayers}];
  const clientTabs=[{id:'home',label:'Home',Icon:IHome},{id:'history',label:'History',Icon:IHistory},{id:'profile',label:'Profile',Icon:IUser}];
  const tabs=role==='coach'?coachTabs:clientTabs;
  return(
    <div style={{height:76,background:T.surface,borderTop:`1px solid ${T.border}`,display:'flex',alignItems:'center',justifyContent:'space-around',padding:'0 8px 10px',flexShrink:0}}>
      {tabs.map(t=>{const active=t.id===tab;return(
        <div key={t.id} onClick={()=>onTab(t.id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'8px 20px',borderRadius:12,cursor:'pointer',color:active?T.primary:T.muted,background:active?`${T.primary}0E`:'transparent',transition:'all 0.18s'}}>
          <t.Icon s={22} c={active?T.primary:T.muted}/>
          <span style={{fontSize:10,fontWeight:active?700:400,letterSpacing:'0.02em'}}>{t.label}</span>
        </div>
      );})}
    </div>
  );
}

function CoachDashboard(){
  const today=new Date();
  const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DNAMES=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()-3+i);return{date:d.getDate(),day:DNAMES[d.getDay()],isToday:i===3};});
  const onTrack=CLIENTS.filter(c=>c.status==='on-track').length;
  const avgComp=Math.round(CLIENTS.reduce((a,c)=>a+c.completion,0)/CLIENTS.length);
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg}}>
      <div style={{background:T.primary,paddingTop:52,position:'relative',overflow:'hidden'}}>
        <GridTex/>
        <div style={{position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:'rgba(200,169,110,0.13)'}}/>
        <div style={{position:'relative',zIndex:1,padding:'0 22px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22}}>
            <div>
              <div style={{color:'rgba(255,255,255,0.42)',fontSize:13,marginBottom:4}}>{MONTHS[today.getMonth()]} {today.getFullYear()}</div>
              <div style={{fontFamily:'DM Serif Display, serif',fontSize:27,color:'#fff',lineHeight:1.2}}>Good morning,<br/>Coach Ahmed 👋</div>
            </div>
            <div style={{width:40,height:40,background:'rgba(255,255,255,0.1)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:'1px solid rgba(255,255,255,0.12)'}}><IBell s={17} c="rgba(255,255,255,0.7)"/></div>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',paddingBottom:22}}>
            {weekDays.map((d,i)=>(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:7,cursor:'pointer'}}>
                <span style={{fontSize:9,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:d.isToday?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.28)'}}>{d.day}</span>
                <div style={{width:33,height:33,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',background:d.isToday?T.accent:'transparent',border:d.isToday?'none':'1.5px solid rgba(255,255,255,0.1)'}}>
                  <span style={{fontSize:13,fontWeight:d.isToday?700:400,color:d.isToday?'#fff':'rgba(255,255,255,0.38)'}}>{d.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{height:26,background:T.bg,borderRadius:'22px 22px 0 0'}}/>
      </div>
      <div style={{padding:'2px 22px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:22}}>
          {[{label:'Clients',value:String(CLIENTS.length)},{label:'On Track',value:`${onTrack}/${CLIENTS.length}`},{label:'Completion',value:`${avgComp}%`}].map((s,i)=>(
            <Card key={i} style={{padding:'13px 10px',textAlign:'center'}}>
              <div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:T.primary,lineHeight:1,marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:10,color:T.muted,fontWeight:600,letterSpacing:'0.4px'}}>{s.label}</div>
            </Card>
          ))}
        </div>
        <div style={{marginBottom:22}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:T.text}}>Clients</div>
            <span style={{fontSize:12,color:T.primary,fontWeight:700,cursor:'pointer'}}>See all →</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:9}}>
            {CLIENTS.slice(0,4).map((c,i)=>(
              <Card key={c.id} style={{padding:'14px 15px'}} className={`anim-up d${i+1}`}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <Avatar initials={c.initials} color={c.color} size={42}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}><span style={{fontWeight:700,fontSize:14,color:T.text}}>{c.name}</span><StatusPill status={c.status}/></div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}><PhasePill>{c.phase}</PhasePill><span style={{fontSize:11,color:T.muted}}>{c.lastActivity}</span></div>
                    <ProgressBar value={c.completion} color={c.status==='on-track'?T.primary:T.offTrack}/>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:T.text,marginBottom:14}}>Recent Activity</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {ACTIVITY.map(a=>(
              <div key={a.id} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:T.surface,borderRadius:14,boxShadow:'0 1px 8px rgba(0,0,0,0.05)'}}>
                <Avatar initials={a.initials} color={a.color} size={36}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>{a.client}</div>
                  <div style={{fontSize:12,color:a.type==='missed'?T.offTrack:T.muted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.action}</div>
                </div>
                <span style={{fontSize:11,color:T.muted,flexShrink:0}}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoachClients(){
  const [detail,setDetail]=useState(null);
  if(detail)return<ClientDetailView client={detail} onBack={()=>setDetail(null)}/>;
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg,padding:'52px 22px 24px'}}>
      <div style={{fontFamily:'DM Serif Display, serif',fontSize:28,color:T.text,marginBottom:4}}>Clients</div>
      <div style={{fontSize:13,color:T.muted,marginBottom:20}}>{CLIENTS.length} active · {CLIENTS.filter(c=>c.status==='on-track').length} on track</div>
      <div style={{display:'flex',alignItems:'center',gap:10,background:T.surface,borderRadius:14,padding:'12px 15px',marginBottom:20,boxShadow:T.shadow}}><ISearch s={14} c={T.muted}/><span style={{fontSize:14,color:T.subtle}}>Search clients…</span></div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {CLIENTS.map((c,i)=>(
          <Card key={c.id} onClick={()=>setDetail(c)} style={{padding:'16px'}} className={`anim-up d${Math.min(i+1,5)}`}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:11}}>
              <Avatar initials={c.initials} color={c.color} size={48}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:700,fontSize:15,color:T.text}}>{c.name}</div><IChevR s={15} c={T.subtle}/></div>
                <div style={{display:'flex',alignItems:'center',gap:7,marginTop:4}}><StatusPill status={c.status}/><span style={{fontSize:11,color:T.muted}}>{c.lastActivity}</span></div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}><PhasePill>{c.phase}</PhasePill><div style={{display:'flex',alignItems:'center',gap:5}}><span style={{fontSize:16}}>🔥</span><span style={{fontSize:13,fontWeight:700,color:T.text}}>{c.streak}d</span></div></div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}><span style={{fontSize:11,color:T.muted}}>Completion rate</span><span style={{fontSize:11,fontWeight:700,color:T.text}}>{c.completion}%</span></div>
              <ProgressBar value={c.completion} color={c.status==='on-track'?T.primary:T.offTrack}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClientDetailView({client,onBack}){
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg,animation:'slideRight 0.22s ease both'}}>
      <div style={{background:T.primary,paddingTop:52,position:'relative',overflow:'hidden'}}>
        <GridTex/>
        <div style={{position:'relative',zIndex:1,padding:'0 22px'}}>
          <BackBtn onClick={onBack}/>
          <div style={{display:'flex',alignItems:'center',gap:16,marginTop:20,paddingBottom:28}}>
            <Avatar initials={client.initials} color={client.color} size={64}/>
            <div><div style={{fontFamily:'DM Serif Display, serif',fontSize:24,color:'#fff'}}>{client.name}</div><div style={{color:'rgba(255,255,255,0.5)',fontSize:13,marginTop:4,marginBottom:8}}>{client.phase}</div><StatusPill status={client.status}/></div>
          </div>
        </div>
        <div style={{height:24,background:T.bg,borderRadius:'20px 20px 0 0'}}/>
      </div>
      <div style={{padding:'4px 22px 24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:22}}>
          {[{label:'Streak',value:`${client.streak} 🔥`},{label:'Completion',value:`${client.completion}%`},{label:'Workouts',value:'23'}].map((s,i)=>(
            <Card key={i} style={{padding:'14px 10px',textAlign:'center'}}><div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:T.primary,lineHeight:1,marginBottom:4}}>{s.value}</div><div style={{fontSize:10,color:T.muted,fontWeight:600}}>{s.label}</div></Card>
          ))}
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:T.text,marginBottom:13}}>Active Program</div>
          <Card style={{padding:'16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div><div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:6}}>Beginner Strength Foundation</div><PhasePill>4 weeks</PhasePill></div>
              <span style={{background:T.onTrackBg,color:T.onTrack,fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:8}}>Active</span>
            </div>
            <div style={{display:'flex',gap:7}}>{['Sun','Tue','Thu'].map(d=><div key={d} style={{padding:'4px 12px',borderRadius:8,background:`${T.primary}12`,color:T.primary,fontSize:12,fontWeight:700}}>{d}</div>)}</div>
          </Card>
        </div>
        <div style={{display:'flex',gap:11}}>
          <button style={{flex:1,padding:'14px',background:T.primary,border:'none',borderRadius:14,color:'#fff',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif'}}>Reassign Program</button>
          <button style={{flex:1,padding:'14px',background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:14,color:T.text,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif',boxShadow:T.shadow}}>Message</button>
        </div>
      </div>
    </div>
  );
}

function CoachPrograms(){
  const [detail,setDetail]=useState(null);
  if(detail)return<ProgramDetailView program={detail} onBack={()=>setDetail(null)}/>;
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg,padding:'52px 22px 24px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:28,color:T.text}}>Programs</div>
        <div style={{display:'flex',alignItems:'center',gap:6,background:T.primary,color:'#fff',borderRadius:12,padding:'9px 15px',fontSize:13,fontWeight:700,cursor:'pointer'}}><IPlus s={12} c="#fff"/>New</div>
      </div>
      <div style={{fontSize:13,color:T.muted,marginBottom:22}}>{PROGRAMS.length} programs · {PROGRAMS.reduce((s,p)=>s+p.assigned,0)} assigned</div>
      <div style={{display:'flex',flexDirection:'column',gap:13}}>
        {PROGRAMS.map((p,i)=>(
          <Card key={p.id} onClick={()=>setDetail(p)} style={{padding:'18px'}} className={`anim-up d${i+1}`}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:T.text,marginBottom:6}}>{p.name}</div><PhasePill>{p.phase}</PhasePill></div>
              <IChevR s={15} c={T.subtle}/>
            </div>
            <div style={{display:'flex',gap:6,marginBottom:13,flexWrap:'wrap'}}>{p.schedule.map(d=><div key={d} style={{padding:'4px 10px',borderRadius:8,background:`${T.primary}11`,color:T.primary,fontSize:12,fontWeight:700}}>{d}</div>)}</div>
            <div style={{display:'flex',justifyContent:'space-between',paddingTop:12,borderTop:`1px solid ${T.border}`,fontSize:12,color:T.muted}}>
              <span><strong style={{color:T.text}}>{p.workouts.length}</strong> workouts</span>
              <span><strong style={{color:T.text}}>{p.weeks}</strong> weeks</span>
              <span><strong style={{color:T.text}}>{p.assigned}</strong> assigned</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProgramDetailView({program,onBack}){
  const [expanded,setExpanded]=useState(null);
  const ALL=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg,animation:'slideRight 0.22s ease both'}}>
      <div style={{background:T.primary,paddingTop:52,position:'relative',overflow:'hidden'}}>
        <GridTex/>
        <div style={{position:'relative',zIndex:1,padding:'0 22px'}}>
          <BackBtn onClick={onBack}/>
          <div style={{marginTop:20,paddingBottom:28}}>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:26,color:'#fff',lineHeight:1.2,marginBottom:10}}>{program.name}</div>
            <div style={{display:'flex',gap:10,alignItems:'center'}}><span style={{background:'rgba(255,255,255,0.13)',color:'rgba(255,255,255,0.82)',padding:'4px 12px',borderRadius:8,fontSize:12,fontWeight:600}}>{program.weeks} weeks</span><span style={{color:'rgba(255,255,255,0.38)',fontSize:13}}>{program.assigned} clients assigned</span></div>
          </div>
        </div>
        <div style={{height:24,background:T.bg,borderRadius:'20px 20px 0 0'}}/>
      </div>
      <div style={{padding:'4px 22px 24px'}}>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:12}}>Schedule</div>
          <div style={{display:'flex',gap:5}}>{ALL.map(d=>{const active=program.schedule.includes(d);return<div key={d} style={{flex:1,padding:'9px 0',textAlign:'center',borderRadius:10,background:active?T.primary:T.surface,color:active?'#fff':T.muted,fontSize:10,fontWeight:700,boxShadow:active?`0 4px 14px ${T.primary}40`:T.shadow}}>{d}</div>;})}</div>
        </div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:T.text,marginBottom:13}}>Workouts</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {program.workouts.map(w=>(
            <Card key={w.id}>
              <div onClick={()=>setExpanded(expanded===w.id?null:w.id)} style={{padding:'15px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}}>
                <div><div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:3}}>{w.name}</div><div style={{fontSize:12,color:T.muted}}>{w.day} · {w.exercises.length} exercises</div></div>
                <div style={{transform:expanded===w.id?'rotate(90deg)':'rotate(0)',transition:'transform 0.2s'}}><IChevR s={15} c={T.muted}/></div>
              </div>
              {expanded===w.id&&(
                <div style={{padding:'0 15px 15px',borderTop:`1px solid ${T.border}`}}>
                  <div style={{paddingTop:12,display:'flex',flexDirection:'column',gap:7}}>
                    {w.exercises.map((ex,j)=>(
                      <div key={j} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 13px',background:T.bg,borderRadius:10}}>
                        <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:22,height:22,borderRadius:6,background:`${T.primary}14`,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:10,fontWeight:800,color:T.primary}}>{j+1}</span></div><span style={{fontSize:13,fontWeight:600,color:T.text}}>{ex.name}</span></div>
                        <div style={{display:'flex',gap:12,fontSize:12}}><span style={{fontWeight:700,color:T.text}}>{ex.sets}×{ex.reps}</span><span style={{color:T.muted}}>{ex.rest}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
        <button style={{width:'100%',padding:'16px',background:T.primary,border:'none',borderRadius:14,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif',marginTop:20,marginBottom:24,boxShadow:`0 8px 24px ${T.primary}40`}}>Assign to Client</button>
      </div>
    </div>
  );
}

function ClientHome({onStart}){
  const WEEK=[
    {name:'Push Day',day:'Today',status:'today'},
    {name:'Rest',day:'Monday',status:'rest'},
    {name:'Pull Day',day:'Tuesday',status:'upcoming'},
    {name:'Rest',day:'Wednesday',status:'rest'},
    {name:'Leg Day',day:'Thursday',status:'upcoming'},
  ];
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg}}>
      <div style={{background:T.primary,paddingTop:50,position:'relative',overflow:'hidden'}}>
        <GridTex/>
        <div style={{position:'absolute',top:-30,right:-40,width:160,height:160,borderRadius:'50%',background:'rgba(200,169,110,0.14)'}}/>
        <div style={{position:'relative',zIndex:1,padding:'0 22px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <div><div style={{color:'rgba(255,255,255,0.42)',fontSize:13,marginBottom:3}}>Welcome back,</div><div style={{fontFamily:'DM Serif Display, serif',fontSize:26,color:'#fff'}}>Karim Hassan</div></div>
            <Avatar initials="KH" color="rgba(255,255,255,0.14)" size={44}/>
          </div>
          <div style={{background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.11)',borderRadius:20,padding:'20px 20px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:15}}>
              <div>
                <div style={{color:'rgba(255,255,255,0.35)',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:8}}>Current Streak</div>
                <div style={{display:'flex',alignItems:'baseline',gap:8}}><div style={{fontFamily:'DM Serif Display, serif',fontSize:62,color:'#fff',lineHeight:0.9}}>5</div><div style={{color:'rgba(255,255,255,0.52)',fontSize:17,fontWeight:500,marginBottom:2}}>days</div></div>
                <div style={{color:'rgba(255,255,255,0.32)',fontSize:12,marginTop:5}}>Personal best: 9 days</div>
              </div>
              <div style={{fontSize:54,filter:'drop-shadow(0 6px 14px rgba(0,0,0,0.25))'}}>🔥</div>
            </div>
            <div style={{display:'flex',gap:5}}>
              {['M','T','W','T','F','S','S'].map((d,i)=>(
                <div key={i} style={{flex:1}}><div style={{height:5,borderRadius:100,background:i<5?T.accent:'rgba(255,255,255,0.1)',marginBottom:4}}/><div style={{fontSize:9,color:'rgba(255,255,255,0.26)',textAlign:'center',fontWeight:600}}>{d}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{height:26,background:T.bg,borderRadius:'22px 22px 0 0'}}/>
      </div>
      <div style={{padding:'2px 22px 24px'}}>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:T.text,marginBottom:13}}>Today's Workout</div>
        <div onClick={onStart} style={{background:T.primary,borderRadius:20,padding:'20px',cursor:'pointer',position:'relative',overflow:'hidden',marginBottom:22,boxShadow:`0 12px 32px ${T.primary}45`}}>
          <div style={{position:'absolute',top:-28,right:-28,width:140,height:140,borderRadius:'50%',background:'rgba(200,169,110,0.18)'}}/>
          <div style={{position:'absolute',bottom:-30,left:50,width:100,height:100,borderRadius:'50%',background:'rgba(200,169,110,0.09)'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <div><div style={{color:'rgba(255,255,255,0.42)',fontSize:12,marginBottom:6}}>{TODAY_WO.program}</div><div style={{fontFamily:'DM Serif Display, serif',fontSize:26,color:'#fff'}}>{TODAY_WO.name}</div></div>
              <div style={{background:T.accent,width:44,height:44,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IPlay s={16} c="#fff"/></div>
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
              {TODAY_WO.exercises.map((e,i)=><span key={i} style={{background:'rgba(255,255,255,0.11)',color:'rgba(255,255,255,0.7)',padding:'4px 10px',borderRadius:8,fontSize:11,fontWeight:500}}>{e.name}</span>)}
            </div>
            <div style={{display:'flex',gap:20,paddingTop:14,borderTop:'1px solid rgba(255,255,255,0.1)'}}>
              <div style={{color:'rgba(255,255,255,0.52)',fontSize:13}}><span style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:'#fff'}}>{TODAY_WO.exercises.length}</span> exercises</div>
              <div style={{color:'rgba(255,255,255,0.52)',fontSize:13}}><span style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:'#fff'}}>~45</span> min</div>
            </div>
          </div>
        </div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:T.text,marginBottom:13}}>This Week</div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {WEEK.map((w,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'13px 15px',background:T.surface,borderRadius:14,boxShadow:'0 1px 8px rgba(0,0,0,0.05)',opacity:w.status==='rest'?0.52:1}}>
              <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:w.status==='today'?T.primary:w.status==='rest'?T.bg:'#EDE9E3',display:'flex',alignItems:'center',justifyContent:'center',border:w.status==='today'?'none':`1.5px solid ${T.border}`}}>
                <span style={{fontSize:13,color:w.status==='today'?'#fff':T.muted}}>{w.status==='today'?'▶':w.status==='rest'?'–':'○'}</span>
              </div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:w.status==='rest'?T.muted:T.text}}>{w.name}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{w.day}</div></div>
              {w.status==='today'&&<span style={{fontSize:11,fontWeight:800,color:T.accent,letterSpacing:'0.5px'}}>TODAY</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActiveWorkout({onExit}){
  const [exIdx,setExIdx]=useState(0);
  const [setNum,setSetNum]=useState(1);
  const [logs,setLogs]=useState({});
  const [done,setDone]=useState(false);
  const [inputW,setInputW]=useState('');
  const [inputR,setInputR]=useState('');
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

  function startRest(dur){setResting(true);setRestLeft(dur);restRef.current=setInterval(()=>setRestLeft(r=>{if(r<=1){clearInterval(restRef.current);setResting(false);return 0;}return r-1;}),1000);}

  function logSet(){
    if(!inputR)return;
    const key=`${exIdx}-${setNum}`;
    setLogs(prev=>({...prev,[key]:{weight:inputW||'BW',reps:inputR}}));
    setInputW('');setInputR('');
    if(isLastSet&&isLastEx){clearInterval(elRef.current);setDone(true);}
    else if(isLastSet){startRest(ex.rest);setExIdx(i=>i+1);setSetNum(1);}
    else{startRest(ex.rest);setSetNum(s=>s+1);}
  }

  const EX_GRADS=['linear-gradient(148deg,#15312B 0%,#0A1C17 100%)','linear-gradient(148deg,#162535 0%,#0A1620 100%)','linear-gradient(148deg,#261530 0%,#150B1C 100%)','linear-gradient(148deg,#30210A 0%,#1C1305 100%)'];

  if(done)return<WorkoutComplete elapsed={elapsed} totalSets={totalSets} onDone={onExit}/>;

  return(
    <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',background:'#0F0F0F'}}>
      <div style={{height:'44%',background:EX_GRADS[exIdx%4],position:'relative',overflow:'hidden',flexShrink:0}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:'rgba(255,255,255,0.07)',zIndex:10}}>
          <div style={{height:'100%',width:`${(doneSets/totalSets)*100}%`,background:T.accent,transition:'width 0.5s ease'}}/>
        </div>
        <div style={{position:'absolute',top:0,left:0,right:0,padding:'22px 20px',zIndex:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button onClick={onExit} style={{background:'rgba(0,0,0,0.28)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'8px 14px',cursor:'pointer',color:'rgba(255,255,255,0.65)',fontSize:13,fontWeight:600,fontFamily:'Plus Jakarta Sans, sans-serif',display:'flex',alignItems:'center',gap:5}}><IChevL s={12} c="rgba(255,255,255,0.65)"/>Exit</button>
          <div style={{background:'rgba(0,0,0,0.28)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'8px 16px',fontFamily:'DM Serif Display, serif',fontSize:20,color:'rgba(255,255,255,0.75)',letterSpacing:'1px'}}>{fmtTime(elapsed)}</div>
        </div>
        <div style={{position:'absolute',top:'44%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:'DM Serif Display, serif',fontSize:160,color:'rgba(255,255,255,0.03)',lineHeight:1,userSelect:'none',pointerEvents:'none'}}>{String(exIdx+1).padStart(2,'0')}</div>
        <div style={{position:'absolute',bottom:42,left:24,right:24,zIndex:5}}>
          <div style={{display:'inline-block',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:7,padding:'3px 11px',fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.42)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:10}}>{ex.muscle}</div>
          <div style={{fontFamily:'DM Serif Display, serif',fontSize:33,color:'#fff',lineHeight:1.15}}>{ex.name}</div>
          <div style={{color:'rgba(255,255,255,0.32)',fontSize:12,marginTop:6}}>{exIdx+1} of {TODAY_WO.exercises.length} exercises</div>
        </div>
        <div style={{position:'absolute',bottom:-2,left:-16,right:-16,height:54,background:T.bg,borderRadius:'54% 54% 0 0 / 100% 100% 0 0'}}/>
      </div>
      <div style={{flex:1,background:T.bg,overflowY:'auto',padding:'8px 22px 24px',position:'relative'}}>
        {resting&&(
          <div style={{position:'absolute',inset:0,background:`${T.primary}F4`,zIndex:60,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <div style={{color:'rgba(255,255,255,0.35)',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',marginBottom:10}}>Rest</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:90,color:'#fff',lineHeight:0.9,marginBottom:14}}>{fmtTime(restLeft)}</div>
            <div style={{color:'rgba(255,255,255,0.35)',fontSize:13,marginBottom:32}}>Up next: {isLastSet&&!isLastEx?TODAY_WO.exercises[exIdx+1]?.name:`Set ${setNum}`}</div>
            <button onClick={()=>{clearInterval(restRef.current);setResting(false);}} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.16)',color:'#fff',borderRadius:14,padding:'13px 32px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif'}}>Skip Rest</button>
          </div>
        )}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,paddingTop:14}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:5}}>Set</div>
            <div style={{fontFamily:'DM Serif Display, serif',lineHeight:1}}><span style={{fontSize:46,color:T.primary}}>{setNum}</span><span style={{fontSize:22,color:T.subtle}}>&thinsp;/&thinsp;{ex.sets}</span></div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:5}}>Target</div>
            <div style={{fontFamily:'DM Serif Display, serif',fontSize:46,color:T.text,lineHeight:1}}>{ex.reps}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:9,fontWeight:700,color:T.muted,letterSpacing:'2.5px',textTransform:'uppercase',marginBottom:5}}>Rest</div>
            <div style={{fontFamily:'DM Serif Display, serif',lineHeight:1}}><span style={{fontSize:46,color:T.text}}>{ex.rest}</span><span style={{fontSize:18,color:T.subtle}}>s</span></div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11,marginBottom:13}}>
          {[{label:'Weight (kg)',val:inputW,set:setInputW},{label:'Reps done',val:inputR,set:setInputR}].map((inp,i)=>(
            <div key={i}>
              <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:7}}>{inp.label}</div>
              <input type="number" value={inp.val} placeholder="0" inputMode="numeric" onChange={e=>inp.set(e.target.value)}
                style={{width:'100%',padding:'14px',background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:13,fontSize:30,fontWeight:800,color:T.text,fontFamily:'Plus Jakarta Sans, sans-serif',outline:'none',textAlign:'center',transition:'border-color 0.2s',boxShadow:T.shadow}}
                onFocus={e=>e.target.style.borderColor=T.primary} onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
          ))}
        </div>
        <button onClick={logSet} style={{width:'100%',padding:'17px',background:inputR?T.primary:'#CAC7C1',border:'none',borderRadius:14,color:'#fff',fontSize:15,fontWeight:700,cursor:inputR?'pointer':'not-allowed',fontFamily:'Plus Jakarta Sans, sans-serif',boxShadow:inputR?`0 8px 26px ${T.primary}45`:'none',transition:'all 0.2s',marginBottom:15}}>
          {isLastSet&&isLastEx?'🏆  Complete Workout':'Log Set  →'}
        </button>
        {Object.entries(logs).filter(([k])=>k.startsWith(`${exIdx}-`)).length>0&&(
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:'1.5px',textTransform:'uppercase',marginBottom:8}}>Logged</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {Object.entries(logs).filter(([k])=>k.startsWith(`${exIdx}-`)).map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 13px',background:T.surface,borderRadius:11,boxShadow:'0 1px 6px rgba(0,0,0,0.04)'}}>
                  <span style={{fontSize:12,color:T.muted}}>Set {k.split('-')[1]}</span>
                  <span style={{fontSize:14,fontWeight:700,color:T.text}}>{v.weight}kg × {v.reps} reps</span>
                  <ICheck s={13} c={T.onTrack}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function WorkoutComplete({elapsed,totalSets,onDone}){
  return(
    <div style={{position:'absolute',inset:0,background:T.primary,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 30px',overflow:'hidden'}}>
      <GridTex/>
      <div style={{position:'absolute',top:-80,right:-60,width:260,height:260,borderRadius:'50%',background:'rgba(200,169,110,0.14)'}}/>
      <div style={{position:'absolute',bottom:-80,left:-60,width:220,height:220,borderRadius:'50%',background:'rgba(200,169,110,0.09)'}}/>
      <div style={{position:'relative',zIndex:1,textAlign:'center',width:'100%'}}>
        <div style={{fontSize:72,marginBottom:20,display:'inline-block',animation:'celebPop 0.65s cubic-bezier(0.34,1.56,0.64,1) forwards'}}>🏆</div>
        <div style={{fontFamily:'DM Serif Display, serif',fontSize:42,color:'#fff',lineHeight:1.1,marginBottom:8}}>Workout<br/>Complete</div>
        <div style={{color:'rgba(255,255,255,0.38)',fontSize:14,marginBottom:36}}>Push Day · Beginner Strength Foundation</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:11,marginBottom:22}}>
          {[{label:'Duration',value:fmtTime(elapsed)},{label:'Sets Done',value:String(totalSets)},{label:'New Streak',value:'6 🔥'}].map((s,i)=>(
            <div key={i} style={{background:'rgba(255,255,255,0.07)',borderRadius:16,padding:'15px 8px',border:'1px solid rgba(255,255,255,0.09)'}}>
              <div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:'#fff',lineHeight:1,marginBottom:4}}>{s.value}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.38)',fontWeight:600,letterSpacing:'0.5px'}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{background:'rgba(200,169,110,0.16)',border:'1px solid rgba(200,169,110,0.28)',borderRadius:16,padding:'16px 20px',marginBottom:28,display:'flex',alignItems:'center',gap:14}}>
          <span style={{fontSize:28}}>🔥</span>
          <div style={{textAlign:'left'}}><div style={{color:'rgba(255,255,255,0.35)',fontSize:11,marginBottom:2}}>Streak extended</div><div style={{fontFamily:'DM Serif Display, serif',fontSize:20,color:'#fff'}}>5 → 6 days</div></div>
        </div>
        <button onClick={onDone} style={{width:'100%',padding:'17px',background:'#fff',border:'none',borderRadius:14,color:T.primary,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif'}}>Back to Home</button>
      </div>
    </div>
  );
}

function ClientHistory(){
  const HIST=[
    {name:'Pull Day',date:'Yesterday',duration:'38 min',sets:15,done:true},
    {name:'Push Day',date:'2 days ago',duration:'44 min',sets:17,done:true},
    {name:'Leg Day',date:'3 days ago',duration:'51 min',sets:18,done:true},
    {name:'Rest Day',date:'4 days ago',duration:null,sets:0,done:false},
    {name:'Pull Day',date:'5 days ago',duration:'40 min',sets:15,done:true},
  ];
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg,padding:'52px 22px 24px'}}>
      <div style={{fontFamily:'DM Serif Display, serif',fontSize:28,color:T.text,marginBottom:4}}>History</div>
      <div style={{fontSize:13,color:T.muted,marginBottom:22}}>Last 7 days</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {HIST.map((w,i)=>(
          <Card key={i} style={{padding:'16px'}} className={`anim-up d${Math.min(i+1,5)}`}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,flexShrink:0,background:w.done?T.primary:'#EDE9E3',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:15}}>
                {w.done?<ICheck s={16} c="#fff"/>:'–'}
              </div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:3}}>{w.name}</div><div style={{fontSize:12,color:T.muted}}>{w.date}</div></div>
              {w.duration&&<div style={{textAlign:'right'}}><div style={{fontWeight:700,fontSize:14,color:T.text}}>{w.duration}</div><div style={{fontSize:11,color:T.muted}}>{w.sets} sets</div></div>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ClientProfile({onLogout}){
  return(
    <div style={{position:'absolute',inset:0,overflowY:'auto',background:T.bg,padding:'52px 22px 24px'}}>
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
        <Avatar initials="KH" color={T.primary} size={72}/>
        <div><div style={{fontFamily:'DM Serif Display, serif',fontSize:24,color:T.text}}>Karim Hassan</div><div style={{fontSize:12,color:T.muted,marginTop:3,marginBottom:8}}>Member since March 2024</div><PhasePill>Beginner Strength</PhasePill></div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:26}}>
        {[{label:'Total Workouts',value:'23'},{label:'Best Streak',value:'9 🔥'},{label:'Avg Duration',value:'44 min'},{label:'Coach',value:'Ahmed S.'}].map((s,i)=>(
          <Card key={i} style={{padding:'16px'}}><div style={{fontFamily:'DM Serif Display, serif',fontSize:22,color:T.primary,marginBottom:4}}>{s.value}</div><div style={{fontSize:12,color:T.muted}}>{s.label}</div></Card>
        ))}
      </div>
      <div style={{fontFamily:'DM Serif Display, serif',fontSize:18,color:T.text,marginBottom:13}}>Settings</div>
      {['Notifications','Weight Units (kg)','Language (English)','Help & Support'].map((item,i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'15px 15px',background:T.surface,borderRadius:14,marginBottom:9,boxShadow:T.shadow,cursor:'pointer'}}>
          <span style={{fontSize:14,fontWeight:500,color:T.text}}>{item}</span><IChevR s={15} c={T.subtle}/>
        </div>
      ))}
      <button onClick={onLogout} style={{width:'100%',marginTop:8,padding:'14px',background:T.offTrackBg,color:T.offTrack,border:'none',borderRadius:14,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif'}}>Sign Out</button>
    </div>
  );
}

export default function FitnessSavior(){
  const [role,setRole]=useState(null);
  const [tab,setTab]=useState('home');
  const [workout,setWorkout]=useState(false);
  function handleRole(r){setRole(r);setTab(r==='coach'?'dashboard':'home');}
  function handleLogout(){setRole(null);setTab('home');setWorkout(false);}
  return(
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#C2BEB8',padding:20}}>
        <div style={{width:390,height:844,borderRadius:44,overflow:'hidden',position:'relative',boxShadow:'0 36px 72px rgba(0,0,0,0.32),0 0 0 1px rgba(0,0,0,0.1)',display:'flex',flexDirection:'column',background:T.bg}}>
          {!role?<LoginScreen onRole={handleRole}/>:(
            <>
              <div style={{flex:1,overflow:'hidden',position:'relative'}}>
                {role==='coach'?(
                  <>{tab==='dashboard'&&<CoachDashboard/>}{tab==='clients'&&<CoachClients/>}{tab==='programs'&&<CoachPrograms/>}</>
                ):workout?<ActiveWorkout onExit={()=>setWorkout(false)}/>:(
                  <>{tab==='home'&&<ClientHome onStart={()=>setWorkout(true)}/>}{tab==='history'&&<ClientHistory/>}{tab==='profile'&&<ClientProfile onLogout={handleLogout}/>}</>
                )}
              </div>
              {!workout&&<BottomNav role={role} tab={tab} onTab={setTab}/>}
            </>
          )}
        </div>
        {role&&<div style={{position:'fixed',bottom:24,right:24}}><button onClick={handleLogout} style={{background:T.primary,color:'#fff',border:'none',borderRadius:14,padding:'12px 20px',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:'Plus Jakarta Sans, sans-serif',boxShadow:`0 4px 18px ${T.primary}55`}}>← Switch Role</button></div>}
      </div>
    </>
  );
}
