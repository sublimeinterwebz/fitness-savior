import { useState, useEffect } from "react";

const R="#fb545b",BG="#0a0a0a",S1="#111115",S2="#18181d",BD="#252530";
const TX="#eeeef2",MT="#64646e",GN="#34d399",YW="#fbbf24",PL="#a855f7",CY="#06b6d4";

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${BG};font-family:'DM Sans',sans-serif;color:${TX};-webkit-tap-highlight-color:transparent}
input,button{font-family:'DM Sans',sans-serif}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${BD};border-radius:2px}
@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes pop{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
.fade{animation:fadeIn 0.2s ease}
.slide{animation:slideIn 0.22s ease}
.pop{animation:pop 0.18s ease}
`;

// ── Icons ────────────────────────────────────────────────────────

const Ic=({n,size=18,color="currentColor",sw=1.6})=>{
  const s={width:size,height:size,flexShrink:0,display:"block"};
  const p={fill:"none",stroke:color,strokeWidth:sw,strokeLinecap:"round",strokeLinejoin:"round"};
  const m={
    home:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path {...p} d="M9 21V12h6v9"/></svg>,
    users:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="9" cy="7" r="4"/><path {...p} d="M2 21v-1a7 7 0 0114 0v1"/><path {...p} d="M22 21v-1a5 5 0 00-4-4.9M19 7a3 3 0 010 6"/></svg>,
    clip:<svg style={s} viewBox="0 0 24 24"><rect {...p} x="8" y="2" width="8" height="4" rx="1"/><path {...p} d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><line {...p} x1="9" y1="12" x2="15" y2="12"/><line {...p} x1="9" y1="16" x2="13" y2="16"/></svg>,
    chart:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M3 3v18h18"/><path {...p} d="M7 16l4-5 4 3 4-6"/></svg>,
    dumb:<svg style={s} viewBox="0 0 24 24"><rect {...p} x="2" y="10" width="4" height="4" rx="1"/><rect {...p} x="18" y="10" width="4" height="4" rx="1"/><line {...p} x1="6" y1="12" x2="18" y2="12"/><rect {...p} x="5" y="8" width="2" height="8" rx="1"/><rect {...p} x="17" y="8" width="2" height="8" rx="1"/></svg>,
    leaf:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 2C8 2 4 6 4 12c0 5 4 10 8 10s8-5 8-10V4C17 2 14 2 12 2z"/><line {...p} x1="12" y1="22" x2="12" y2="12"/></svg>,
    cal:<svg style={s} viewBox="0 0 24 24"><rect {...p} x="3" y="4" width="18" height="18" rx="2"/><line {...p} x1="3" y1="10" x2="21" y2="10"/><line {...p} x1="8" y1="2" x2="8" y2="6"/><line {...p} x1="16" y1="2" x2="16" y2="6"/></svg>,
    menu:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="3" y1="6" x2="21" y2="6"/><line {...p} x1="3" y1="12" x2="21" y2="12"/><line {...p} x1="3" y1="18" x2="21" y2="18"/></svg>,
    x:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="18" y1="6" x2="6" y2="18"/><line {...p} x1="6" y1="6" x2="18" y2="18"/></svg>,
    cl:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="15 18 9 12 15 6"/></svg>,
    cr:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="9 18 15 12 9 6"/></svg>,
    cd:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="6 9 12 15 18 9"/></svg>,
    cu:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="18 15 12 9 6 15"/></svg>,
    back:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="19" y1="12" x2="5" y2="12"/><polyline {...p} points="12 19 5 12 12 5"/></svg>,
    chk:<svg style={s} viewBox="0 0 24 24"><polyline {...p} points="20 6 9 17 4 12"/></svg>,
    fire:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M12 2c0 4-4 6-4 10a4 4 0 008 0C16 8 12 6 12 2z"/><path {...p} d="M12 14a2 2 0 00-2 2c0 1.5 2 3 2 3s2-1.5 2-3a2 2 0 00-2-2z"/></svg>,
    play:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="10"/><polygon fill={color} strokeWidth="0" points="10 8 16 12 10 16 10 8"/></svg>,
    plus:<svg style={s} viewBox="0 0 24 24"><line {...p} x1="12" y1="5" x2="12" y2="19"/><line {...p} x1="5" y1="12" x2="19" y2="12"/></svg>,
    out:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline {...p} points="16 17 21 12 16 7"/><line {...p} x1="21" y1="12" x2="9" y2="12"/></svg>,
    bell:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path {...p} d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    tim:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="13" r="8"/><polyline {...p} points="12 9 12 13 15 16"/><line {...p} x1="9" y1="2" x2="15" y2="2"/></svg>,
    troph:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M6 2h12v8a6 6 0 01-12 0V2z"/><path {...p} d="M6 7H3a2 2 0 002 2h1M18 7h3a2 2 0 01-2 2h-1"/><line {...p} x1="12" y1="16" x2="12" y2="20"/><line {...p} x1="8" y1="20" x2="16" y2="20"/></svg>,
    srch:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="11" cy="11" r="8"/><line {...p} x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    edit:<svg style={s} viewBox="0 0 24 24"><path {...p} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path {...p} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/></svg>,
    warn:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="10"/><line {...p} x1="12" y1="8" x2="12" y2="12"/><line {...p} x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5"/></svg>,
    tgt:<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="10"/><circle {...p} cx="12" cy="12" r="6"/><circle {...p} cx="12" cy="12" r="2"/></svg>,
    skip:<svg style={s} viewBox="0 0 24 24"><polygon {...p} points="5 4 15 12 5 20 5 4"/><line {...p} x1="19" y1="5" x2="19" y2="19"/></svg>,
  };
  return m[n]||<svg style={s} viewBox="0 0 24 24"><circle {...p} cx="12" cy="12" r="8"/></svg>;
};

// ── Primitives ───────────────────────────────────────────────────

const Ring=({val,max,color,size=50})=>{
  const r=(size-6)/2,c=2*Math.PI*r,d=Math.min(val/max,1)*c;
  return <svg width={size} height={size} style={{transform:"rotate(-90deg)",flexShrink:0}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={BD} strokeWidth={5}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5} strokeDasharray={`${d} ${c}`} strokeLinecap="round"/></svg>;
};

const Av=({name,color,size=36})=>{
  const init=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:size,height:size,borderRadius:Math.round(size*0.28),background:`${color}22`,color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(size*0.33),fontFamily:"Syne,sans-serif",fontWeight:700,flexShrink:0}}>{init}</div>;
};

const Bar=({pct,color,h=3})=><div style={{height:h,background:BD,borderRadius:h,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color||(pct>70?GN:pct>40?YW:R),borderRadius:h,transition:"width 0.4s"}}/></div>;

const Pill=({ok})=><span style={{fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600,background:ok?`${GN}18`:`${R}18`,color:ok?GN:R,display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}><Ic n={ok?"chk":"warn"} size={10} color={ok?GN:R} sw={2.5}/>{ok?"On Track":"Behind"}</span>;

// ── Data ─────────────────────────────────────────────────────────

const CL=[
  {id:1,name:"Mohamed Al-Omari",age:28,goal:"Muscle Gain",pct:87,streak:14,ok:true,prog:"Hypertrophy Block A",c:R,kg:82,ses:18},
  {id:2,name:"Fatima Al-Zahra",age:24,goal:"Weight Loss",pct:45,streak:3,ok:false,prog:"Fat Loss Phase 2",c:PL,kg:65,ses:9},
  {id:3,name:"Ahmed Al-Sayed",age:32,goal:"Strength",pct:92,streak:21,ok:true,prog:"Powerlifting Prep",c:"#3b82f6",kg:95,ses:22},
  {id:4,name:"Sara Al-Khaled",age:26,goal:"Endurance",pct:68,streak:7,ok:true,prog:"Cardio & Tone",c:GN,kg:58,ses:14},
  {id:5,name:"Omar Al-Sharif",age:35,goal:"Muscle Gain",pct:23,streak:1,ok:false,prog:"Beginner Strength",c:YW,kg:78,ses:4},
  {id:6,name:"Nour Al-Din",age:22,goal:"Athletic",pct:95,streak:30,ok:true,prog:"Athletic Performance",c:CY,kg:70,ses:24},
];
const EX=[
  {id:1,name:"Barbell Bench Press",sets:4,reps:8,kg:80,rest:90,mu:"Chest"},
  {id:2,name:"Overhead Press",sets:3,reps:10,kg:50,rest:75,mu:"Shoulders"},
  {id:3,name:"Incline DB Press",sets:3,reps:12,kg:30,rest:60,mu:"Upper Chest"},
  {id:4,name:"Lateral Raises",sets:4,reps:15,kg:12,rest:45,mu:"Shoulders"},
  {id:5,name:"Tricep Pushdown",sets:3,reps:12,kg:25,rest:45,mu:"Triceps"},
];
const MEALS=[
  {name:"Breakfast",time:"8:00 AM",kcal:520,foods:["Oatmeal 100g — 68g carbs","Whey Protein 30g — 24g protein","Banana — 27g carbs","Almond Butter 15g — 9g fat"]},
  {name:"Lunch",time:"1:00 PM",kcal:680,foods:["Grilled Chicken 200g — 46g protein","Brown Rice 150g — 48g carbs","Mixed Salad — 5g carbs","Olive Oil 10ml — 14g fat"]},
  {name:"Pre-Workout",time:"4:30 PM",kcal:320,foods:["Greek Yogurt 200g — 20g protein","Berries 100g — 14g carbs","Honey 10g — 8g carbs"]},
  {name:"Dinner",time:"8:00 PM",kcal:580,foods:["Salmon 180g — 38g protein","Sweet Potato 200g — 41g carbs","Broccoli 150g — 9g carbs"]},
];
const DAYS=[
  {day:"Day 1 — Monday",focus:"Lower Body Strength",exs:[{n:"Back Squat",p:"4×6 @ 100kg",m:"Quads"},{n:"Romanian Deadlift",p:"3×10 @ 80kg",m:"Hamstrings"},{n:"Leg Press",p:"3×12 @ 160kg",m:"Quads"},{n:"Calf Raises",p:"4×15 @ 60kg",m:"Calves"}]},
  {day:"Day 2 — Wednesday",focus:"Upper Body Push",exs:[{n:"Bench Press",p:"4×8 @ 80kg",m:"Chest"},{n:"Overhead Press",p:"3×10 @ 50kg",m:"Shoulders"},{n:"Tricep Dips",p:"3×12 @ BW",m:"Triceps"}]},
  {day:"Day 3 — Friday",focus:"Upper Body Pull",exs:[{n:"Pull-Ups",p:"4×8 @ BW+10",m:"Back"},{n:"Barbell Row",p:"4×8 @ 70kg",m:"Back"},{n:"Hammer Curls",p:"3×12 @ 18kg",m:"Biceps"}]},
];
const CAL=["done","done","rest","missed","done","done","rest","done","done","rest","done","done","rest","done","done","rest","done","done","rest","done","done","rest","done","done","rest","done","today","future","future","future","future"];

// ── Login ────────────────────────────────────────────────────────

function Login({goCoach,goClient}){
  const [form,setForm]=useState(false);
  const inp={width:"100%",padding:"11px 14px",borderRadius:10,background:S2,border:`1px solid ${BD}`,color:TX,fontSize:13,outline:"none",marginBottom:12,display:"block"};
  return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,backgroundImage:`radial-gradient(ellipse 70% 40% at 50% -5%,${R}14,transparent)`}}>
      <div style={{textAlign:"center",marginBottom:30}}>
        <div style={{width:52,height:52,borderRadius:14,background:R,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:`0 0 40px ${R}50`}}>
          <Ic n="dumb" size={24} color="#fff" sw={2}/>
        </div>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,color:TX}}>Fitness <span style={{color:R}}>Savior</span></div>
        <div style={{fontSize:12,color:MT,marginTop:4}}>Your coaching platform, elevated.</div>
      </div>
      <div style={{width:"100%",maxWidth:340,background:S1,border:`1px solid ${BD}`,borderRadius:20,padding:"24px 22px"}} className="pop">
        {!form?(
          <>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,marginBottom:3,color:TX}}>Welcome back</div>
            <div style={{fontSize:12,color:MT,marginBottom:20}}>Sign in to continue</div>
            <button onClick={goClient} style={{width:"100%",padding:"12px 16px",borderRadius:12,background:S2,border:`1px solid ${BD}`,color:TX,fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google (Client)
            </button>
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"10px 0"}}>
              <div style={{flex:1,height:1,background:BD}}/><span style={{fontSize:11,color:MT}}>or</span><div style={{flex:1,height:1,background:BD}}/>
            </div>
            <button onClick={()=>setForm(true)} style={{width:"100%",padding:"12px 16px",borderRadius:12,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 20px ${R}30`}}>
              <Ic n="troph" size={15} color="#fff" sw={2}/> Enter as Coach
            </button>
          </>
        ):(
          <>
            <button onClick={()=>setForm(false)} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",marginBottom:14,padding:0,display:"flex",alignItems:"center",gap:6}}>
              <Ic n="back" size={14} color={MT}/> Back
            </button>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,marginBottom:3,color:TX}}>Coach Login</div>
            <div style={{fontSize:12,color:MT,marginBottom:16}}>Access your coaching dashboard</div>
            <div style={{fontSize:11,color:MT,marginBottom:5,fontWeight:500}}>Email</div>
            <input style={inp} defaultValue="pola@fitnesssavior.com" type="email"/>
            <div style={{fontSize:11,color:MT,marginBottom:5,fontWeight:500}}>Password</div>
            <input style={{...inp,marginBottom:16}} type="password" defaultValue="password"/>
            <button onClick={goCoach} style={{width:"100%",padding:12,borderRadius:10,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Sign In as Coach</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Coach Shell ──────────────────────────────────────────────────

const CNAV=[{id:"dash",ic:"chart",lb:"Dashboard"},{id:"clients",ic:"users",lb:"Clients"},{id:"programs",ic:"clip",lb:"Programs"}];

function CoachApp({logout}){
  const [page,setPage]=useState("dash");
  const [sel,setSel]=useState(null);
  const [col,setCol]=useState(false);
  const [drawer,setDrawer]=useState(false);
  const [mob,setMob]=useState(window.innerWidth<=768);

  useEffect(()=>{
    const fn=()=>setMob(window.innerWidth<=768);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);

  const go=(id)=>{setPage(id);setSel(null);if(mob)setDrawer(false);};

  const Sidebar=(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",padding:"16px 14px",marginBottom:6,gap:10,justifyContent:col&&!mob?"center":"flex-start"}}>
        <div style={{width:30,height:30,borderRadius:8,background:R,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic n="dumb" size={15} color="#fff" sw={2.2}/></div>
        {(!col||mob)&&<span style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:800,color:TX,whiteSpace:"nowrap"}}>Fitness <span style={{color:R}}>Savior</span></span>}
      </div>
      {(!col||mob)&&<div style={{fontSize:9,color:MT,textTransform:"uppercase",letterSpacing:"0.12em",padding:"0 14px",marginBottom:6,fontWeight:600}}>Menu</div>}
      <div style={{flex:1,padding:"0 8px"}}>
        {CNAV.map(n=>(
          <button key={n.id} onClick={()=>go(n.id)} title={col&&!mob?n.lb:""} style={{display:"flex",alignItems:"center",gap:10,padding:(col&&!mob)?"10px 0":"9px 10px",borderRadius:10,border:"none",background:page===n.id?`${R}18`:"transparent",color:page===n.id?R:MT,fontSize:13,fontWeight:page===n.id?600:400,cursor:"pointer",marginBottom:2,width:"100%",textAlign:"left",justifyContent:(col&&!mob)?"center":"flex-start",transition:"all 0.15s"}}>
            <Ic n={n.ic} size={17} color={page===n.id?R:MT} sw={page===n.id?2:1.6}/>
            {(!col||mob)&&<span style={{whiteSpace:"nowrap"}}>{n.lb}</span>}
          </button>
        ))}
      </div>
      <div style={{padding:"6px 8px 14px"}}>
        <div style={{height:1,background:BD,margin:"6px 0"}}/>
        <button onClick={logout} style={{display:"flex",alignItems:"center",gap:10,padding:(col&&!mob)?"10px 0":"9px 10px",borderRadius:10,border:"none",background:"transparent",color:MT,fontSize:13,cursor:"pointer",width:"100%",justifyContent:(col&&!mob)?"center":"flex-start",marginBottom:6}}>
          <Ic n="out" size={17} color={MT}/>{(!col||mob)&&<span>Sign Out</span>}
        </button>
        {(!col||mob)?(
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px",borderRadius:10,background:S2}}>
            <div style={{width:30,height:30,borderRadius:8,background:R,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>P</div>
            <div><div style={{fontSize:13,fontWeight:600,color:TX}}>Pola</div><div style={{fontSize:10,color:MT}}>Head Coach</div></div>
          </div>
        ):(
          <div style={{display:"flex",justifyContent:"center"}}><div style={{width:32,height:32,borderRadius:9,background:R,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:"#fff"}}>P</div></div>
        )}
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:BG}}>
      {!mob&&(
        <div style={{width:col?58:200,background:S1,borderRight:`1px solid ${BD}`,flexShrink:0,position:"relative",transition:"width 0.22s ease",overflow:"hidden"}}>
          {Sidebar}
          <button onClick={()=>setCol(v=>!v)} style={{position:"absolute",top:18,right:-11,width:22,height:22,borderRadius:"50%",background:S2,border:`1px solid ${BD}`,color:MT,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,padding:0}}>
            <Ic n={col?"cr":"cl"} size={11} color={MT} sw={2}/>
          </button>
        </div>
      )}
      {mob&&drawer&&(
        <div style={{position:"fixed",inset:0,zIndex:50,display:"flex"}}>
          <div onClick={()=>setDrawer(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)"}}/>
          <div style={{width:216,background:S1,borderRight:`1px solid ${BD}`,position:"relative",zIndex:51}} className="slide">
            <button onClick={()=>setDrawer(false)} style={{position:"absolute",top:14,right:12,background:"none",border:"none",color:MT,cursor:"pointer",padding:4,display:"flex"}}><Ic n="x" size={18} color={MT}/></button>
            {Sidebar}
          </div>
        </div>
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {mob&&(
          <div style={{height:52,background:S1,borderBottom:`1px solid ${BD}`,display:"flex",alignItems:"center",padding:"0 16px",gap:12,flexShrink:0}}>
            <button onClick={()=>setDrawer(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}><Ic n="menu" size={20} color={TX}/></button>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:800,color:TX,flex:1}}>Fitness <span style={{color:R}}>Savior</span></div>
            <button style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}><Ic n="bell" size={18} color={MT}/></button>
  
