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
        <div style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,color:TX}}>Bergo's <span style={{color:R}}>Coaching</span></div>
        <div style={{fontSize:12,color:MT,marginTop:4}}>Train harder. Coach smarter.</div>
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
            <input style={inp} defaultValue="bergo@bergoscoaching.com" type="email"/>
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
        {(!col||mob)&&<span style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:800,color:TX,whiteSpace:"nowrap"}}>Bergo's <span style={{color:R}}>Coaching</span></span>}
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
            <div><div style={{fontSize:13,fontWeight:600,color:TX}}>Bergo</div><div style={{fontSize:10,color:MT}}>Head Coach</div></div>
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
            <div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:800,color:TX,flex:1}}>Bergo's <span style={{color:R}}>Coaching</span></div>
            <button style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}><Ic n="bell" size={18} color={MT}/></button>
          </div>
        )}
        <div style={{flex:1,overflowY:"auto",padding:mob?16:24}}>
          <div className="fade" key={page+(sel?sel.id:"")}>
            {page==="dash"&&<Dash goClients={()=>go("clients")} mob={mob}/>}
            {page==="clients"&&!sel&&<Clients onPick={setSel} mob={mob}/>}
            {page==="clients"&&sel&&<Detail client={sel} back={()=>setSel(null)} mob={mob}/>}
            {page==="programs"&&<Programs mob={mob}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Coach: Dashboard ─────────────────────────────────────────────

function Dash({goClients,mob}){
  const on=CL.filter(c=>c.ok).length,off=CL.filter(c=>!c.ok).length;
  const avg=Math.round(CL.reduce((a,c)=>a+c.pct,0)/CL.length);
  const wk=[5,4,6,3,5,2,1],days=["M","T","W","T","F","S","S"];
  const act=[
    {name:"Ahmed Al-Sayed",note:"Completed Powerlifting Day 3 — PR on deadlift",t:"12m ago",c:"#3b82f6"},
    {name:"Nour Al-Din",note:"Finished Athletic session — 100% completion",t:"1h ago",c:CY},
    {name:"Sara Al-Khaled",note:"Logged workout — skipped 2 exercises",t:"2h ago",c:GN},
    {name:"Fatima Al-Zahra",note:"Missed 3rd session this week",t:"3h ago",c:PL},
  ];
  const stats=[
    {ic:"users",v:CL.length,l:"Active Clients",sub:"+2 this month",sc:GN},
    {ic:"chart",v:`${avg}%`,l:"Avg Completion",sub:"Up 8% vs last week",sc:GN},
    {ic:"chk",v:on,l:"On Track",sub:"Consistent this week",sc:GN},
    {ic:"warn",v:off,l:"Need Attention",sub:"Action required",sc:R},
  ];
  const card={background:S1,border:`1px solid ${BD}`,borderRadius:14};
  return(
    <div>
      <div style={{marginBottom:18}}>
        <h1 style={{fontFamily:"Syne,sans-serif",fontSize:mob?18:22,fontWeight:800,color:TX}}>Good morning, Bergo</h1>
        <p style={{fontSize:12,color:MT,marginTop:3}}>Sunday, March 29 · Client overview</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:14}}>
        {stats.map((s,i)=>(
          <div key={i} style={{...card,padding:mob?12:16}}>
            <div style={{marginBottom:8,opacity:0.7}}><Ic n={s.ic} size={15} color={s.sc} sw={1.8}/></div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:mob?20:26,fontWeight:800,color:TX}}>{s.v}</div>
            <div style={{fontSize:10,color:MT,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:2}}>{s.l}</div>
            <div style={{fontSize:11,color:s.sc,marginTop:4}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{...card,padding:16,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX}}>Client Status</div>
          <button onClick={goClients} style={{fontSize:11,color:R,background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>All <Ic n="cr" size={11} color={R} sw={2}/></button>
        </div>
        {CL.map(c=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${BD}`}}>
            <Av name={c.name} color={c.c} size={32}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:TX,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
              <div style={{fontSize:10,color:MT}}>{c.prog}</div>
              <div style={{marginTop:4}}><Bar pct={c.pct}/></div>
            </div>
            <Pill ok={c.ok}/>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:14,marginBottom:14}}>
        <div style={{...card,padding:16}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Ic n="chart" size={13} color={MT}/> Weekly Sessions</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60}}>
            {wk.map((v,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
                <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:i===6?R:`${R}28`,height:`${(v/6)*50}px`}}/>
                <div style={{fontSize:9,color:MT}}>{days[i]}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{...card,padding:16}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Ic n="bell" size={13} color={MT}/> Recent Activity</div>
          {act.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:i<act.length-1?`1px solid ${BD}`:"none"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:a.c,flexShrink:0,marginTop:6}}/>
              <div style={{minWidth:0}}>
                <div style={{fontSize:11,color:TX,lineHeight:1.5}}><strong style={{color:a.c}}>{a.name}</strong> — {a.note}</div>
                <div style={{fontSize:10,color:MT,marginTop:1}}>{a.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <div style={{...card,padding:16}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:TX,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Ic n="troph" size={13} color={YW}/> Top Performer</div>
          <div style={{textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><Av name="Nour Al-Din" color={CY} size={44}/></div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX}}>Nour Al-Din</div>
            <div style={{fontSize:11,color:MT,margin:"3px 0 8px"}}>30-day streak · 95%</div>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:24,fontWeight:800,color:CY}}>24</div>
            <div style={{fontSize:10,color:MT}}>sessions / month</div>
          </div>
        </div>
        <div style={{...card,padding:16}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:TX,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Ic n="warn" size={13} color={R}/> Check-in</div>
          {CL.filter(c=>!c.ok).map(c=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${BD}`}}>
              <Av name={c.name} color={c.c} size={28}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,fontWeight:600,color:TX,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name.split(" ")[0]}</div>
                <div style={{fontSize:10,color:MT}}>{c.pct}%</div>
              </div>
              <button style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:R,border:"none",color:"#fff",cursor:"pointer"}}>Ping</button>
            </div>
          ))}
        </div>
        <div style={{...card,padding:16}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:TX,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Ic n="tgt" size={13} color={MT}/> Completion</div>
          {[{l:"Excellent 80%+",n:3,c:GN},{l:"Moderate 50–80%",n:1,c:YW},{l:"Low under 50%",n:2,c:R}].map((row,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:7,height:7,borderRadius:2,background:row.c,flexShrink:0}}/>
              <div style={{flex:1,fontSize:11,color:MT}}>{row.l}</div>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:row.c}}>{row.n}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Coach: Clients ───────────────────────────────────────────────

function Clients({onPick,mob}){
  const [q,setQ]=useState("");
  const [filt,setFilt]=useState("all");
  const [inv,setInv]=useState(false);
  const chips=["all","on-track","behind","Muscle Gain","Weight Loss","Strength","Athletic","Endurance"];
  const list=CL.filter(c=>{
    const mq=!q||c.name.toLowerCase().includes(q.toLowerCase())||c.goal.toLowerCase().includes(q.toLowerCase());
    const mf=filt==="all"||(filt==="on-track"&&c.ok)||(filt==="behind"&&!c.ok)||c.goal===filt;
    return mq&&mf;
  });
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,gap:10,flexWrap:"wrap"}}>
        <div>
          <h1 style={{fontFamily:"Syne,sans-serif",fontSize:mob?18:22,fontWeight:800,color:TX}}>Clients</h1>
          <p style={{fontSize:12,color:MT,marginTop:3}}>{CL.length} clients · {CL.filter(c=>c.ok).length} on track</p>
        </div>
        <button onClick={()=>setInv(true)} style={{padding:"9px 15px",borderRadius:10,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
          <Ic n="plus" size={14} color="#fff" sw={2.5}/> Invite
        </button>
      </div>
      <div style={{position:"relative",marginBottom:12}}>
        <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Ic n="srch" size={14} color={MT}/></div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or goal..." style={{width:"100%",padding:"10px 14px 10px 36px",borderRadius:11,background:S1,border:`1px solid ${BD}`,color:TX,fontSize:13,outline:"none"}}/>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
        {chips.map(ch=>(
          <button key={ch} onClick={()=>setFilt(ch)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:500,cursor:"pointer",border:`1px solid ${filt===ch?R:BD}`,background:filt===ch?`${R}15`:"transparent",color:filt===ch?R:MT,whiteSpace:"nowrap",flexShrink:0}}>
            {ch}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(3,1fr)",gap:12}}>
        {list.map(c=>(
          <div key={c.id} onClick={()=>onPick(c)} style={{background:S1,border:`1px solid ${BD}`,borderRadius:14,padding:16,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
              <Av name={c.name} color={c.c} size={40}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX}}>{c.name}</div>
                <div style={{fontSize:11,color:MT,marginTop:1}}>{c.goal}</div>
                <div style={{marginTop:6}}><Pill ok={c.ok}/></div>
              </div>
              <Ic n="cr" size={13} color={MT}/>
            </div>
            <div style={{fontSize:11,color:MT,marginBottom:10,padding:"6px 10px",background:S2,borderRadius:7,border:`1px solid ${BD}`}}>{c.prog}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
              {[{v:`${c.pct}%`,l:"Done",c:c.pct>70?GN:R},{v:`${c.streak}d`,l:"Streak",c:YW},{v:c.ses,l:"Sessions",c:TX}].map((m,i)=>(
                <div key={i} style={{textAlign:"center",padding:"8px 4px",background:S2,borderRadius:8,border:`1px solid ${BD}`}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:15,fontWeight:700,color:m.c}}>{m.v}</div>
                  <div style={{fontSize:9,color:MT,marginTop:2}}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {inv&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20}}>
          <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:20,padding:26,width:"100%",maxWidth:320}} className="pop">
            <div style={{fontFamily:"Syne,sans-serif",fontSize:17,fontWeight:800,color:TX,marginBottom:5}}>Invite a Client</div>
            <div style={{fontSize:13,color:MT,marginBottom:18}}>Share this code with your client to link them to your roster.</div>
            <div style={{background:S2,border:`1px dashed ${R}50`,borderRadius:12,padding:18,textAlign:"center",fontFamily:"Syne,sans-serif",fontSize:28,fontWeight:800,color:R,letterSpacing:5,marginBottom:6}}>BC-7X4K</div>
            <div style={{fontSize:11,color:MT,textAlign:"center",marginBottom:18}}>Expires in 48h · Single use</div>
            <div style={{display:"flex",gap:10}}>
              <button style={{flex:1,padding:10,borderRadius:10,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Copy Link</button>
              <button onClick={()=>setInv(false)} style={{flex:1,padding:10,borderRadius:10,background:"transparent",border:`1px solid ${BD}`,color:TX,fontSize:13,cursor:"pointer"}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Coach: Client Detail ─────────────────────────────────────────

function Detail({client,back,mob}){
  const [tab,setTab]=useState("overview");
  const tabS=(t)=>({padding:"6px 15px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",border:`1px solid ${tab===t?R:BD}`,background:tab===t?`${R}15`:"transparent",color:tab===t?R:MT});
  const wkP=[72,85,60,90,78,88,92],wt=[83,82.5,82,81.8,81.2,81,80.5];
  const card={background:S1,border:`1px solid ${BD}`,borderRadius:14};
  return(
    <div>
      <button onClick={back} style={{background:"none",border:"none",color:MT,fontSize:13,cursor:"pointer",marginBottom:14,display:"flex",alignItems:"center",gap:6}}>
        <Ic n="back" size={14} color={MT}/> Back
      </button>
      <div style={{...card,padding:mob?14:18,display:"flex",alignItems:"center",gap:14,marginBottom:16,flexWrap:"wrap"}}>
        <Av name={client.name} color={client.c} size={mob?42:52}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:mob?15:20,fontWeight:800,color:TX}}>{client.name}</div>
          <div style={{fontSize:12,color:MT,marginTop:2}}>{client.age} years · {client.goal}</div>
          <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:10,padding:"3px 9px",borderRadius:6,background:S2,color:MT,border:`1px solid ${BD}`}}>{client.prog}</span>
            <Pill ok={client.ok}/>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:28,fontWeight:800,color:client.pct>70?GN:R}}>{client.pct}%</div>
          <div style={{fontSize:10,color:MT}}>Completion</div>
        </div>
      </div>
      <div style={{display:"flex",gap:7,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
        {["overview","progress","program"].map(t=><button key={t} style={tabS(t)} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>
      {tab==="overview"&&(
        <div className="fade">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[{v:`${client.streak}d`,l:"Streak",c:YW},{v:client.ses,l:"Sessions",c:TX},{v:`${client.kg}kg`,l:"Weight",c:TX}].map((m,i)=>(
              <div key={i} style={{...card,padding:14}}>
                <div style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,color:m.c}}>{m.v}</div>
                <div style={{fontSize:10,color:MT,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:2}}>{m.l}</div>
              </div>
            ))}
          </div>
          <div style={{...card,padding:16}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:12}}>Weekly Completion %</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60}}>
              {wkP.map((v,i)=>{const days=["M","T","W","T","F","S","S"],c=v>80?GN:v>60?YW:R;return(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
                  <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:c,height:`${(v/100)*50}px`}}/>
                  <div style={{fontSize:9,color:MT}}>{days[i]}</div>
                </div>
              );})}
            </div>
          </div>
        </div>
      )}
      {tab==="progress"&&(
        <div className="fade">
          <div style={{...card,padding:16,marginBottom:14}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:12}}>Bodyweight Trend (kg)</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:5,height:60}}>
              {wt.map((v,i)=>{const mn=Math.min(...wt),mx=Math.max(...wt),h=((v-mn)/(mx-mn+0.1))*46+10;return(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
                  <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:R,height:`${h}px`}}/>
                  <div style={{fontSize:9,color:MT}}>W{i+1}</div>
                </div>
              );})}
            </div>
            <div style={{textAlign:"center",marginTop:8,fontSize:12,color:GN}}>{(wt[0]-wt[wt.length-1]).toFixed(1)}kg lost over 7 weeks</div>
          </div>
          <div style={{...card,padding:16}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:14}}>Strength Progress</div>
            {[{ex:"Back Squat",start:80,cur:100},{ex:"Bench Press",start:60,cur:80},{ex:"Deadlift",start:100,cur:130}].map((e,i)=>(
              <div key={i} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,fontWeight:600,color:TX}}>{e.ex}</span>
                  <span style={{fontSize:12,color:GN}}>+{e.cur-e.start}kg</span>
                </div>
                <Bar pct={(e.cur/150)*100} color={GN} h={5}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:MT}}>
                  <span>Start: {e.start}kg</span><span>Now: {e.cur}kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="program"&&(
        <div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <div style={{fontSize:13,color:MT}}>Current: <strong style={{color:TX}}>{client.prog}</strong></div>
            <button style={{padding:"7px 13px",borderRadius:9,background:R,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Ic n="edit" size={13} color="#fff"/> Change</button>
          </div>
          {DAYS.map((d,i)=><DayCard key={i} day={d}/>)}
        </div>
      )}
    </div>
  );
}

// ── Coach: Programs ──────────────────────────────────────────────

function DayCard({day}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:13,marginBottom:10,overflow:"hidden"}}>
      <div onClick={()=>setOpen(v=>!v)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",cursor:"pointer"}}>
        <div>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX}}>{day.day}</div>
          <div style={{fontSize:11,color:MT,marginTop:2}}>{day.focus} · {day.exs.length} exercises</div>
        </div>
        <Ic n={open?"cu":"cd"} size={15} color={MT} sw={2}/>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${BD}`}}>
          {day.exs.map((ex,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:i<day.exs.length-1?`1px solid ${BD}`:"none"}}>
              <div style={{width:30,height:30,borderRadius:7,background:S2,border:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Ic n="dumb" size={13} color={MT}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:TX}}>{ex.n}</div>
                <div style={{fontSize:11,color:MT}}>{ex.p}</div>
              </div>
              <span style={{fontSize:10,padding:"2px 8px",borderRadius:5,background:`${R}12`,color:R}}>{ex.m}</span>
            </div>
          ))}
          <div style={{padding:"10px 16px"}}>
            <button style={{padding:"6px 12px",borderRadius:8,background:"transparent",border:`1px solid ${BD}`,color:MT,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
              <Ic n="plus" size={12} color={MT} sw={2}/> Add Exercise
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Programs({mob}){
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,gap:10,flexWrap:"wrap"}}>
        <div>
          <h1 style={{fontFamily:"Syne,sans-serif",fontSize:mob?18:22,fontWeight:800,color:TX}}>Programs</h1>
          <p style={{fontSize:12,color:MT,marginTop:3}}>Hypertrophy Block A · 3 clients assigned</p>
        </div>
        <button style={{padding:"9px 15px",borderRadius:10,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:7}}>
          <Ic n="chk" size={14} color="#fff" sw={2.5}/> Save
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
        {[{l:"Program Name",v:"Hypertrophy Block A"},{l:"Duration",v:"8 Weeks"}].map((f,i)=>(
          <div key={i}>
            <div style={{fontSize:11,color:MT,marginBottom:5,fontWeight:500}}>{f.l}</div>
            <input defaultValue={f.v} style={{width:"100%",padding:"10px 14px",borderRadius:10,background:S1,border:`1px solid ${BD}`,color:TX,fontSize:13,outline:"none"}}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:700,color:TX,display:"flex",alignItems:"center",gap:6}}><Ic n="clip" size={14} color={MT}/> Workout Days</div>
        <button style={{padding:"6px 12px",borderRadius:8,background:"transparent",border:`1px solid ${BD}`,color:TX,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}><Ic n="plus" size={12} color={TX} sw={2}/> Add Day</button>
      </div>
      {DAYS.map((d,i)=><DayCard key={i} day={d}/>)}
    </div>
  );
}

// ── Client Shell ─────────────────────────────────────────────────

const CNAV2=[{id:"home",ic:"home",lb:"Home"},{id:"workout",ic:"dumb",lb:"Workout"},{id:"meals",ic:"leaf",lb:"Meals"},{id:"calendar",ic:"cal",lb:"Calendar"}];

function ClientApp({logout}){
  const [page,setPage]=useState("home");
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:BG}}>
      <div style={{flex:1,overflowY:"auto"}} className="fade" key={page}>
        {page==="home"&&<ClientHome goWorkout={()=>setPage("workout")}/>}
        {page==="workout"&&<WorkoutTracker goHome={()=>setPage("home")}/>}
        {page==="meals"&&<ClientMeals/>}
        {page==="calendar"&&<ClientCal/>}
      </div>
      <div style={{height:62,background:S1,borderTop:`1px solid ${BD}`,display:"flex",alignItems:"center",flexShrink:0}}>
        {CNAV2.map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 0",border:"none",background:"transparent",color:page===n.id?R:MT,cursor:"pointer",transition:"color 0.15s"}}>
            <Ic n={n.ic} size={20} color={page===n.id?R:MT} sw={page===n.id?2:1.5}/>
            <span style={{fontSize:9,fontWeight:page===n.id?600:400,letterSpacing:"0.02em"}}>{n.lb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Client: Home ─────────────────────────────────────────────────

function ClientHome({goWorkout}){
  const week=[{st:"done",d:"M"},{st:"done",d:"T"},{st:"rest",d:"W"},{st:"done",d:"T"},{st:"done",d:"F"},{st:"rest",d:"S"},{st:"today",d:"S"}];
  const macros=[{l:"Calories",cur:1820,max:2200,c:R,u:"kcal"},{l:"Protein",cur:142,max:180,c:R,u:"g"},{l:"Carbs",cur:198,max:250,c:YW,u:"g"},{l:"Fat",cur:52,max:65,c:PL,u:"g"}];
  const stC={done:GN,rest:MT,today:R};
  return(
    <div style={{padding:20}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:TX}}>Hey, <span style={{color:R}}>Mohamed</span></h1>
        <p style={{fontSize:12,color:MT,marginTop:3}}>Sunday · Keep the chain going</p>
      </div>
      <div style={{background:`${R}10`,border:`1px solid ${R}30`,borderRadius:14,padding:16,display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
        <div><div style={{fontSize:9,color:MT,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3,display:"flex",alignItems:"center",gap:4}}><Ic n="fire" size={10} color={R}/> Streak</div><div style={{fontFamily:"Syne,sans-serif",fontSize:34,fontWeight:800,color:R,lineHeight:1}}>14</div><div style={{fontSize:11,color:MT}}>days</div></div>
        <div style={{flex:1}}><div style={{fontSize:12,color:TX,marginBottom:6}}>Personal best: <strong>21 days</strong></div><Bar pct={67} color={R}/><div style={{fontSize:10,color:MT,marginTop:4}}>7 more to beat your record</div></div>
      </div>
      <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:14,padding:16,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{background:R,color:"#fff",fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:5,fontFamily:"Syne,sans-serif"}}>DAY 3</span>
          <span style={{fontSize:11,color:MT,display:"flex",alignItems:"center",gap:4}}><Ic n="tim" size={11} color={MT}/> ~55 min</span>
        </div>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:TX}}>Upper Body Push</div>
        <div style={{fontSize:11,color:MT,margin:"3px 0 12px"}}>5 exercises · Chest, Shoulders, Triceps</div>
        <button onClick={goWorkout} style={{width:"100%",padding:12,borderRadius:11,background:R,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 18px ${R}28`}}>
          <Ic n="play" size={16} color="#fff"/> Start Workout
        </button>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Ic n="leaf" size={13} color={MT}/> Today's Nutrition</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {macros.map((m,i)=>(
            <div key={i} style={{background:S1,border:`1px solid ${BD}`,borderRadius:12,padding:"12px 6px",display:"flex",flexDirection:"column",alignItems:"center"}}>
              <Ring val={m.cur} max={m.max} color={m.c} size={44}/>
              <div style={{fontSize:9,color:MT,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:6,textAlign:"center"}}>{m.l}</div>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:700,color:m.c,marginTop:2}}>{m.cur}</div>
              <div style={{fontSize:9,color:MT}}>/{m.max}{m.u}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:14,padding:14}}>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Ic n="cal" size={13} color={MT}/> This Week</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
          {week.map((w,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{fontSize:9,color:MT,fontWeight:600}}>{w.d}</div>
              <div style={{width:"100%",aspectRatio:"1",borderRadius:8,background:w.st==="done"?`${GN}18`:w.st==="today"?`${R}18`:S2,display:"flex",alignItems:"center",justifyContent:"center",border:w.st==="today"?`1px solid ${R}40`:`1px solid ${BD}`}}>
                <Ic n={w.st==="done"?"chk":w.st==="today"?"tgt":"skip"} size={12} color={stC[w.st]} sw={2}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Client: Workout ──────────────────────────────────────────────

function WorkoutTracker({goHome}){
  const [activeEx,setActiveEx]=useState(0);
  const [sets,setSets]=useState({});
  const [timer,setTimer]=useState(0);
  const [timing,setTiming]=useState(false);
  const [done,setDone]=useState(false);

  useEffect(()=>{
    if(!timing||timer<=0){if(timing&&timer<=0)setTiming(false);return;}
    const t=setTimeout(()=>setTimer(x=>x-1),1000);
    return()=>clearTimeout(t);
  },[timing,timer]);

  const totalSets=EX.reduce((a,e)=>a+e.sets,0);
  const doneSets=Object.values(sets).flat().filter(Boolean).length;

  const markSet=(exId,si)=>{
    setSets(prev=>{const arr=[...(prev[exId]||[])];arr[si]=!arr[si];return{...prev,[exId]:arr};});
    const ex=EX.find(e=>e.id===exId);
    if(ex&&!((sets[exId]||[])[si])){setTimer(ex.rest);setTiming(true);}
  };

  if(done) return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}} className="pop">
      <div style={{width:68,height:68,borderRadius:18,background:`${GN}15`,border:`1px solid ${GN}35`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}><Ic n="troph" size={30} color={GN} sw={1.5}/></div>
      <div style={{fontFamily:"Syne,sans-serif",fontSize:24,fontWeight:800,color:TX,marginBottom:5}}>Workout Complete!</div>
      <div style={{fontSize:13,color:MT,marginBottom:24}}>Day 3 — Upper Body Push done</div>
      <div style={{display:"flex",gap:24,marginBottom:28}}>
        {[{v:"52min",l:"Duration"},{v:`${doneSets}`,l:"Sets"},{v:"100%",l:"Completion"}].map((s,i)=>(
          <div key={i}><div style={{fontFamily:"Syne,sans-serif",fontSize:22,fontWeight:800,color:R}}>{s.v}</div><div style={{fontSize:10,color:MT,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:3}}>{s.l}</div></div>
        ))}
      </div>
      <button onClick={()=>{setDone(false);goHome();}} style={{padding:"12px 28px",borderRadius:12,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer"}}>Back to Home</button>
    </div>
  );

  return(
    <div style={{background:BG,minHeight:"100vh"}}>
      <div style={{background:S1,borderBottom:`1px solid ${BD}`,padding:"13px 18px",position:"sticky",top:0,zIndex:5}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:700,color:TX}}>Upper Body Push</div>
          <div style={{fontSize:11,color:MT}}>{doneSets}/{totalSets} sets</div>
        </div>
        <div style={{height:3,background:BD,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${totalSets>0?(doneSets/totalSets)*100:0}%`,background:R,borderRadius:2,transition:"width 0.4s"}}/>
        </div>
      </div>
      {timing&&timer>0&&(
        <div style={{margin:"14px 18px 0",padding:14,background:`${R}10`,border:`1px solid ${R}28`,borderRadius:12,display:"flex",alignItems:"center",gap:12}}>
          <Ic n="tim" size={20} color={R}/>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Syne,sans-serif",fontSize:26,fontWeight:800,color:R,lineHeight:1}}>{String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}</div>
            <div style={{fontSize:11,color:MT,marginTop:2}}>Rest — breathe and recover</div>
          </div>
          <button onClick={()=>setTiming(false)} style={{padding:"5px 12px",borderRadius:7,background:"transparent",border:`1px solid ${BD}`,color:MT,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><Ic n="skip" size={11} color={MT}/> Skip</button>
        </div>
      )}
      <div style={{padding:"12px 18px 24px"}}>
        {EX.map((ex,exi)=>{
          const active=exi===activeEx,exSets=sets[ex.id]||[],allDone=exSets.filter(Boolean).length===ex.sets;
          return(
            <div key={ex.id} onClick={()=>setActiveEx(exi)} style={{background:S1,border:`1px solid ${active?R:allDone?`${GN}35`:BD}`,borderRadius:13,marginBottom:10,overflow:"hidden",cursor:"pointer",opacity:exi>activeEx?0.4:1,transition:"all 0.15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px"}}>
                <div style={{width:34,height:34,borderRadius:9,background:allDone?`${GN}15`:active?`${R}12`:S2,border:`1px solid ${allDone?GN:active?R:BD}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
                  {allDone?<Ic n="chk" size={16} color={GN} sw={2.5}/>:<Ic n="dumb" size={15} color={active?R:MT}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX}}>{ex.name}</div>
                  <div style={{fontSize:11,color:active?R:MT}}>{ex.mu}</div>
                </div>
                <div style={{textAlign:"right",fontSize:11,color:MT,flexShrink:0}}><div>{ex.sets}×{ex.reps}</div><div>{ex.kg}kg · {ex.rest}s</div></div>
              </div>
              {active&&(
                <div style={{padding:"12px 14px",borderTop:`1px solid ${BD}`}}>
                  <div style={{display:"grid",gridTemplateColumns:"22px 1fr 1fr 30px",gap:7,marginBottom:6}}>
                    {["#","kg","Reps",""].map((h,i)=><div key={i} style={{fontSize:10,color:MT,textAlign:i===1||i===2?"center":"left",fontWeight:500}}>{h}</div>)}
                  </div>
                  {Array.from({length:ex.sets}).map((_,si)=>(
                    <div key={si} style={{display:"grid",gridTemplateColumns:"22px 1fr 1fr 30px",gap:7,marginBottom:7,alignItems:"center"}}>
                      <div style={{fontSize:11,color:exSets[si]?GN:MT,fontWeight:600,textAlign:"center"}}>{si+1}</div>
                      <input defaultValue={ex.kg} type="number" onClick={e=>e.stopPropagation()} style={{padding:"8px 6px",borderRadius:8,background:S2,border:`1px solid ${exSets[si]?`${GN}35`:BD}`,color:TX,fontSize:13,fontWeight:600,outline:"none",textAlign:"center",width:"100%"}}/>
                      <input defaultValue={ex.reps} type="number" onClick={e=>e.stopPropagation()} style={{padding:"8px 6px",borderRadius:8,background:S2,border:`1px solid ${exSets[si]?`${GN}35`:BD}`,color:TX,fontSize:13,fontWeight:600,outline:"none",textAlign:"center",width:"100%"}}/>
                      <button onClick={e=>{e.stopPropagation();markSet(ex.id,si);}} style={{width:30,height:30,borderRadius:7,border:`1px solid ${exSets[si]?GN:BD}`,background:exSets[si]?`${GN}15`:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                        <Ic n="chk" size={14} color={exSets[si]?GN:MT} sw={2.5}/>
                      </button>
                    </div>
                  ))}
                  <button onClick={e=>{e.stopPropagation();exi<EX.length-1?setActiveEx(exi+1):setDone(true);}} style={{width:"100%",padding:11,marginTop:8,borderRadius:10,background:R,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    {exi<EX.length-1?<><span>Next Exercise</span><Ic n="cr" size={14} color="#fff" sw={2.5}/></>:<><Ic n="troph" size={14} color="#fff"/> Complete Workout</>}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Client: Meals ────────────────────────────────────────────────

function ClientMeals(){
  const [open,setOpen]=useState(null);
  const macros=[{n:"Protein",cur:142,max:180,c:R},{n:"Carbs",cur:198,max:250,c:YW},{n:"Fat",cur:52,max:65,c:PL}];
  return(
    <div style={{padding:20}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:TX}}>Meal Plan</h1>
        <p style={{fontSize:12,color:MT,marginTop:3}}>Sunday · 1,820 / 2,200 kcal</p>
      </div>
      <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:14,padding:16,marginBottom:14}}>
        <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><Ic n="tgt" size={13} color={MT}/> Daily Macros</div>
        {macros.map((m,i)=>(
          <div key={i} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,fontWeight:600,color:m.c}}>{m.n}</span><span style={{fontSize:11,color:MT}}>{m.cur}g / {m.max}g</span></div>
            <Bar pct={(m.cur/m.max)*100} color={m.c} h={7}/>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginTop:4}}>
          {[{v:"1820",l:"kcal",c:R},{v:"142g",l:"Protein",c:R},{v:"198g",l:"Carbs",c:YW},{v:"52g",l:"Fat",c:PL}].map((m,i)=>(
            <div key={i} style={{textAlign:"center",padding:"8px 4px",background:S2,borderRadius:8,border:`1px solid ${BD}`}}>
              <div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:m.c}}>{m.v}</div>
              <div style={{fontSize:9,color:MT,marginTop:2}}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
      {MEALS.map((meal,i)=>(
        <div key={i} style={{background:S1,border:`1px solid ${open===i?R:BD}`,borderRadius:13,marginBottom:10,overflow:"hidden",transition:"border-color 0.15s"}}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32,height:32,borderRadius:8,background:S2,border:`1px solid ${BD}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="leaf" size={14} color={MT}/></div>
              <div><div style={{fontFamily:"Syne,sans-serif",fontSize:13,fontWeight:700,color:TX}}>{meal.name}</div><div style={{fontSize:11,color:MT,marginTop:1}}>{meal.time}</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{textAlign:"right"}}><div style={{fontFamily:"Syne,sans-serif",fontSize:16,fontWeight:700,color:R}}>{meal.kcal}</div><div style={{fontSize:10,color:MT}}>kcal</div></div>
              <Ic n={open===i?"cu":"cd"} size={14} color={MT} sw={2}/>
            </div>
          </div>
          {open===i&&(
            <div style={{borderTop:`1px solid ${BD}`,padding:"10px 16px"}}>
              {meal.foods.map((f,j)=>{const parts=f.split("—");return(
                <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:j<meal.foods.length-1?`1px solid ${BD}`:"none",fontSize:12,gap:10}}>
                  <span style={{color:TX}}>{parts[0].trim()}</span>
                  {parts[1]&&<span style={{color:R,fontWeight:600,flexShrink:0}}>{parts[1].trim()}</span>}
                </div>
              );})}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Client: Calendar ────────────────────────────────────────────

function ClientCal(){
  const [sel,setSel]=useState(27);
  const dn=["Su","Mo","Tu","We","Th","Fr","Sa"];
  const offset=2;
  const sty={done:{bg:`${GN}15`,c:GN,b:`1px solid ${GN}25`},missed:{bg:`${R}10`,c:R,b:`1px solid ${R}18`},rest:{bg:S2,c:MT,b:`1px solid ${BD}`},today:{bg:`${R}15`,c:R,b:`1px solid ${R}35`},future:{bg:"transparent",c:BD,b:"1px solid transparent"}};
  const selSt=sel&&sel>=1&&sel<=CAL.length?CAL[sel-1]:null;
  const info={done:{title:"Workout Completed",sub:"Upper Body Push — 100% complete",color:GN,icon:"chk"},missed:{title:"Session Missed",sub:"No activity logged this day",color:R,icon:"warn"},rest:{title:"Rest Day",sub:"Recovery — no workout scheduled",color:MT,icon:"skip"},today:{title:"Today",sub:"Session is ready — start when you are",color:R,icon:"tgt"}};
  return(
    <div style={{padding:20}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:TX}}>Calendar</h1>
        <p style={{fontSize:12,color:MT,marginTop:3}}>March 2026 · 20 sessions completed</p>
      </div>
      <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:14,padding:16,marginBottom:14}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:8}}>
          {dn.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:9,color:MT,padding:"3px 0",fontWeight:600}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {Array.from({length:offset}).map((_,i)=><div key={`e${i}`}/>)}
          {CAL.map((st,i)=>{const day=i+1,ss=sty[st]||sty.future,isSel=day===sel;return(
            <div key={day} onClick={()=>st!=="future"&&setSel(day)} style={{aspectRatio:"1",borderRadius:8,background:ss.bg,color:ss.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,cursor:st==="future"?"default":"pointer",fontWeight:isSel?700:400,border:isSel?`1px solid ${R}`:ss.b,transition:"all 0.12s"}}>
              {day}
            </div>
          );})}
        </div>
        <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
          {[{c:GN,l:"Done"},{c:R,l:"Missed"},{c:MT,l:"Rest"},{c:R,l:"Today"}].map(({c,l},i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:MT}}><div style={{width:8,height:8,borderRadius:2,background:c}}/>{l}</div>
          ))}
        </div>
      </div>
      {selSt&&selSt!=="future"&&(()=>{const d=info[selSt];if(!d)return null;return(
        <div style={{background:S1,border:`1px solid ${BD}`,borderRadius:14,padding:18}} className="fade">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${d.color}15`,border:`1px solid ${d.color}25`,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n={d.icon} size={17} color={d.color} sw={1.8}/></div>
            <div><div style={{fontFamily:"Syne,sans-serif",fontSize:14,fontWeight:700,color:TX}}>March {sel}, 2026</div><div style={{fontSize:11,color:d.color,marginTop:2}}>{d.title}</div></div>
          </div>
          <div style={{fontSize:12,color:MT,marginBottom:selSt==="done"?14:0}}>{d.sub}</div>
          {selSt==="done"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                {[{v:"52",l:"Minutes",c:R},{v:"14",l:"Sets",c:TX},{v:"100%",l:"Done",c:GN}].map((m,i)=>(
                  <div key={i} style={{background:S2,borderRadius:10,padding:12,border:`1px solid ${BD}`,textAlign:"center"}}>
                    <div style={{fontFamily:"Syne,sans-serif",fontSize:20,fontWeight:800,color:m.c}}>{m.v}</div>
                    <div style={{fontSize:10,color:MT,marginTop:2}}>{m.l}</div>
                  </div>
                ))}
              </div>
              {EX.slice(0,4).map(ex=>(
                <div key={ex.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${BD}`,fontSize:12,alignItems:"center",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><Ic n="dumb" size={12} color={MT}/><span style={{color:TX}}>{ex.name}</span></div>
                  <span style={{color:MT,flexShrink:0}}>{ex.sets}×{ex.reps} @ {ex.kg}kg</span>
                </div>
              ))}
            </>
          )}
        </div>
      );})()}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────

export default function App(){
  const [view,setView]=useState("login");
  return(
    <>
      <style>{CSS}</style>
      {view==="login"&&<Login goCoach={()=>setView("coach")} goClient={()=>setView("client")}/>}
      {view==="coach"&&<CoachApp logout={()=>setView("login")}/>}
      {view==="client"&&<ClientApp logout={()=>setView("login")}/>}
    </>
  );
}
