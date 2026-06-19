import { useState, useEffect, useCallback } from "react";

const SUPA_URL = "https://oaxxmkukmbcbudhizmpv.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9heHhta3VrbWJjYnVkaGl6bXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjcwMzgsImV4cCI6MjA5NTQ0MzAzOH0.21146NDPGPQ0IRfvxgPDnary6CT9lrx_ZvTN9hG4oNk";
const SITE_PWD  = "pfyl2026";
const PERSO_PWD = "pfylperso2026";

const CATEGORIES = [
  { id:"famille",       label:"Famille & Proches",         icon:"family" },
  { id:"malades",       label:"Malades & Souffrants",       icon:"heart" },
  { id:"dirigeants",    label:"Dirigeants & Autorités",     icon:"shield" },
  { id:"missionnaires", label:"Missionnaires & Serviteurs", icon:"cross" },
  { id:"nations",       label:"Nations & Peuples",          icon:"globe" },
  { id:"eglise",        label:"Église Locale",              icon:"church" },
  { id:"perdus",        label:"Perdus / Non-croyants",      icon:"star" },
];

const PRIORITIES = [
  { id:"urgent", label:"Urgent",  color:"#ef4444" },
  { id:"normal", label:"Normal",  color:"#3b82f6" },
  { id:"veille", label:"Veille",  color:"#9ca3af" },
];

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IC = {
  family:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  heart:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  shield:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  cross:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="9" x2="22" y2="9"/></svg>,
  globe:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  church:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M18 22H6V12l6-6 6 6v10z"/><path d="M9 22v-6h6v6"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="10" y1="4" x2="14" y2="4"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:16,height:16}}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  lock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:16,height:16}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  user:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:16,height:16}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  download:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:15,height:15}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:15,height:15}}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  trash:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:14,height:14}}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  plus:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{width:15,height:15}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  tag:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:13,height:13}}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg>,
  book:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:13,height:13}}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  dove:    <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="3" style={{width:26,height:26}}><path d="M50 10 C30 10 15 25 15 42 C15 55 25 65 38 70 L50 78 L62 70 C75 65 85 55 85 42 C85 25 70 10 50 10Z"/><path d="M50 10 L62 26 L50 34 L38 26 Z"/></svg>,
};

// ── Supabase ──────────────────────────────────────────────────────────────────
const H = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json" };
async function sbGet(table)       { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}?select=*&order=created_at.desc`,{headers:H}); return r.ok?r.json():[] } catch{return[]} }
async function sbPost(table,data) { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}`,{method:"POST",headers:{...H,Prefer:"return=representation"},body:JSON.stringify(data)}); if(!r.ok){const t=await r.text();console.error("Supabase POST error",r.status,t);return {__error:true,status:r.status,detail:t}} return r.json() } catch(e){console.error("Supabase POST network error",e);return {__error:true,status:0,detail:String(e)}} }
async function sbPatch(table,id,d){ try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`,{method:"PATCH",headers:H,body:JSON.stringify(d)}); return r.ok } catch{return false} }
async function sbDel(table,id)    { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`,{method:"DELETE",headers:H}); return r.ok } catch{return false} }

// ── Night mode ────────────────────────────────────────────────────────────────
const nightHour = () => { const h = new Date().getHours(); return h>=22||h<7; };

function theme(n) {
  return n ? {
    bg:"#081525", surface:"#0d2040", card:"#0f2648", border:"#1b3a6b",
    text:"#d4e8ff", text2:"#6b9fd4", accent:"#4a8fff", accentD:"#2563eb",
    gold:"#f0c040", btn:"#1b3a6b", btnTx:"#d4e8ff",
    badge:{ active:"#22c55e", done:"#f0c040", pause:"#6b7280" },
    prio:{ urgent:"#f87171", normal:"#60a5fa", veille:"#9ca3af" },
  } : {
    bg:"#eef2f9", surface:"#ffffff", card:"#f5f8ff", border:"#c8d8f0",
    text:"#0f2040", text2:"#4a6e9a", accent:"#1d4ed8", accentD:"#1e40af",
    gold:"#b45309", btn:"#dbeafe", btnTx:"#1d4ed8",
    badge:{ active:"#15803d", done:"#b45309", pause:"#6b7280" },
    prio:{ urgent:"#dc2626", normal:"#1d4ed8", veille:"#6b7280" },
  };
}

// ── Export PDF ────────────────────────────────────────────────────────────────
function exportPDF(items) {
  const date = new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sujets d'Intercession</title>
<style>body{font-family:Georgia,serif;margin:40px;color:#0f2040;line-height:1.6;}
h1{font-size:26px;color:#1d4ed8;border-bottom:2px solid #1d4ed8;padding-bottom:10px;margin-bottom:4px;}
.sub{color:#4a6e9a;font-size:13px;margin-bottom:32px;}
h2{font-size:15px;font-weight:bold;color:#1d4ed8;margin:28px 0 10px;padding:6px 12px;background:#eff6ff;border-left:4px solid #1d4ed8;border-radius:0 6px 6px 0;}
.item{margin-bottom:14px;padding:12px 16px;border:1px solid #c8d8f0;border-radius:8px;page-break-inside:avoid;}
.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;}
.name{font-weight:bold;font-size:14px;}
.badges{display:flex;gap:6px;flex-wrap:wrap;}
.badge{padding:2px 8px;border-radius:12px;font-size:11px;font-weight:500;}
.actif{background:#dcfce7;color:#166534;} .exauce{background:#fef9c3;color:#854d0e;} .pause{background:#f3f4f6;color:#374151;}
.urgent{background:#fee2e2;color:#991b1b;} .normal{background:#dbeafe;color:#1e40af;} .veille{background:#f3f4f6;color:#374151;}
.req{font-size:13px;color:#334155;margin-bottom:6px;}
.versets{margin:6px 0;}
.verset{font-size:12px;color:#1d4ed8;font-style:italic;margin-bottom:3px;}
.notes{font-size:12px;color:#64748b;background:#f8fafc;padding:8px;border-radius:4px;margin-top:6px;}
.tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;}
.tag{font-size:10px;padding:1px 7px;background:#eff6ff;color:#1d4ed8;border-radius:10px;border:1px solid #bfdbfe;}
.date{font-size:11px;color:#9ca3af;margin-top:6px;}
@media print{body{margin:20px;}.item{page-break-inside:avoid;}}</style></head><body>
<h1>Plateforme d'Intercession</h1>
<div class="sub">Exporté le ${date} — ${items.length} sujets au total</div>
${CATEGORIES.map(cat=>{
  const list = items.filter(i=>i.category===cat.id);
  if(!list.length) return "";
  return `<h2>${cat.label} (${list.length})</h2>`+list.map(it=>{
    const st = it.status||"actif";
    const pr = it.priority||"normal";
    const stL = st==="exauce"?"Exaucé":st==="pause"?"En pause":"En prière";
    const prL = PRIORITIES.find(p=>p.id===pr)?.label||"Normal";
    const versets = Array.isArray(it.versets)?it.versets:[];
    const tags = Array.isArray(it.tags)?it.tags:[];
    return `<div class="item">
      <div class="top"><div class="name">${it.name}</div>
      <div class="badges"><span class="badge ${st}">${stL}</span><span class="badge ${pr}">${prL}</span></div></div>
      ${it.request?`<div class="req">${it.request}</div>`:""}
      ${versets.length?`<div class="versets">${versets.map(v=>`<div class="verset">« ${v} »</div>`).join("")}</div>`:""}
      ${it.notes?`<div class="notes"><strong>Notes :</strong> ${it.notes}</div>`:""}
      ${tags.length?`<div class="tags">${tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>`:""}
      <div class="date">${new Date(it.created_at).toLocaleDateString("fr-FR")}</div>
    </div>`;
  }).join("");
}).join("")}
</body></html>`;
  const w = window.open("","_blank");
  w.document.write(html); w.document.close(); w.print();
}

// ── Export CSV/Excel ──────────────────────────────────────────────────────────
function exportCSV(items) {
  const BOM = "\uFEFF";
  const hdr = "Catégorie,Nom,Sujet,Versets,Notes,Tags,Priorité,Statut,Date\n";
  const rows = items.map(it=>{
    const cat = CATEGORIES.find(c=>c.id===it.category)?.label||it.category;
    const st  = it.status==="exauce"?"Exaucé":it.status==="pause"?"En pause":"En prière";
    const pr  = PRIORITIES.find(p=>p.id===(it.priority||"normal"))?.label||"Normal";
    const ver = (Array.isArray(it.versets)?it.versets:[]).join(" | ");
    const tgs = (Array.isArray(it.tags)?it.tags:[]).join(", ");
    const dt  = new Date(it.created_at).toLocaleDateString("fr-FR");
    const e   = s=>`"${(s||"").replace(/"/g,'""')}"`;
    return [e(cat),e(it.name),e(it.request),e(ver),e(it.notes),e(tgs),e(pr),e(st),e(dt)].join(",");
  }).join("\n");
  const blob = new Blob([BOM+hdr+rows],{type:"text/csv;charset=utf-8;"});
  const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="intercession.csv"; a.click();
}

// ── Global CSS ────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;}
input,textarea,select,button{font-family:'Inter',sans-serif;}
button{cursor:pointer;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-thumb{background:rgba(100,150,200,0.25);border-radius:3px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
@keyframes shake{0%,100%{transform:none}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
@keyframes spin{to{transform:rotate(360deg)}}
`;

// ── Password Gate ─────────────────────────────────────────────────────────────
function PwGate({ title, sub, hint, onUnlock, T }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState(false); const [sh,setSh]=useState(false);
  const go=()=>{
    if(pw===hint){onUnlock();return;}
    setErr(true);setSh(true);
    setTimeout(()=>{setSh(false);setErr(false);setPw("");},1800);
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,padding:20}}>
      <div style={{width:"100%",maxWidth:380,textAlign:"center",animation:sh?"shake 0.4s":"fadeUp 0.5s"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:T.accent+"18",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",color:T.accent}}>{IC.dove}</div>
        <h1 style={{fontFamily:"'Libre Baskerville',serif",fontSize:26,fontWeight:400,color:T.text,marginBottom:6}}>{title}</h1>
        <p style={{color:T.text2,fontSize:14,marginBottom:32,lineHeight:1.7}}>{sub}</p>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
          placeholder="Mot de passe…" autoFocus
          style={{width:"100%",padding:"13px 18px",fontSize:15,background:T.surface,border:`1.5px solid ${err?"#ef4444":T.border}`,borderRadius:10,color:T.text,outline:"none",marginBottom:8,transition:"border-color 0.2s"}}/>
        {err&&<p style={{color:"#ef4444",fontSize:13,marginBottom:8}}>Mot de passe incorrect</p>}
        <button onClick={go} style={{width:"100%",padding:14,background:T.accent,border:"none",borderRadius:10,color:"#fff",fontWeight:600,fontSize:15}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.88"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          Accéder
        </button>
      </div>
    </div>
  );
}

// ── Status + Priority dropdowns ───────────────────────────────────────────────
function Dropdown({ value, options, onChange, T }) {
  const [open,setOpen]=useState(false);
  const cur = options.find(o=>o.id===value)||options[0];
  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:500,border:`1px solid ${cur.color}40`,background:`${cur.color}15`,color:cur.color,cursor:"pointer"}}>
        {cur.label}
      </button>
      {open&&(
        <div style={{position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:200,background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,overflow:"hidden",minWidth:120,boxShadow:"0 8px 24px rgba(0,0,0,0.14)"}}>
          {options.map(o=>(
            <button key={o.id} onClick={()=>{onChange(o.id);setOpen(false);}}
              style={{display:"block",width:"100%",padding:"8px 13px",textAlign:"left",background:"none",border:"none",color:o.color,fontSize:13,cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.background=T.border+"60"}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Prayer Card ───────────────────────────────────────────────────────────────
function PCard({ item, onStatus, onPriority, onDel, T }) {
  const [exp,setExp]=useState(false);
  const cat = CATEGORIES.find(c=>c.id===item.category);
  const versets = Array.isArray(item.versets)?item.versets:[];
  const tags    = Array.isArray(item.tags)?item.tags:[];
  const statOpts = [
    {id:"actif",  label:"En prière", color:T.badge.active},
    {id:"exauce", label:"Exaucé",    color:T.badge.done},
    {id:"pause",  label:"En pause",  color:T.badge.pause},
  ];
  const prioOpts = PRIORITIES.map(p=>({...p,color:T.prio[p.id]}));

  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,borderLeft:`3px solid ${T.accent}`,transition:"box-shadow 0.15s,transform 0.15s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 4px 18px ${T.accent}22`;e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
      <div style={{padding:"14px 16px"}}>
        {/* Row 1 : name + badges + delete */}
        <div style={{display:"flex",alignItems:"flex-start",gap:8,flexWrap:"wrap",marginBottom:4}}>
          <span style={{fontWeight:600,fontSize:14.5,color:T.text,flex:1,minWidth:0}}>{item.name}</span>
          <Dropdown value={item.status||"actif"} options={statOpts} onChange={s=>onStatus(item.id,s)} T={T}/>
          <Dropdown value={item.priority||"normal"} options={prioOpts} onChange={p=>onPriority(item.id,p)} T={T}/>
          <button onClick={()=>onDel(item.id)} style={{background:"none",border:"none",color:T.text2,display:"flex",padding:2,transition:"color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color=T.text2}>
            {IC.trash}
          </button>
        </div>

        {/* Category */}
        {cat&&<div style={{fontSize:11,color:T.text2,display:"flex",alignItems:"center",gap:5,marginBottom:6}}>
          <span style={{color:T.accent,display:"flex"}}>{IC[cat.icon]}</span>{cat.label}
        </div>}

        {/* Request */}
        {item.request&&(
          <p onClick={()=>setExp(e=>!e)} style={{fontSize:13,color:T.text2,lineHeight:1.65,cursor:"pointer",marginBottom:6,
            display:exp?"block":"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:exp?"visible":"hidden"}}>
            {item.request}
          </p>
        )}

        {/* Versets */}
        {versets.length>0&&(
          <div style={{marginBottom:6}}>
            {versets.map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"baseline",gap:5,marginBottom:3}}>
                <span style={{color:T.accent,display:"flex",flexShrink:0,marginTop:2}}>{IC.book}</span>
                <span style={{fontSize:12,color:T.gold,fontFamily:"'Libre Baskerville',serif",fontStyle:"italic"}}>« {v} »</span>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {item.notes&&(
          <div style={{fontSize:12,color:T.text2,background:T.bg,padding:"7px 10px",borderRadius:6,marginBottom:6,lineHeight:1.6,borderLeft:`2px solid ${T.border}`}}>
            <strong style={{color:T.text2,fontSize:11,letterSpacing:"0.05em",textTransform:"uppercase"}}>Notes</strong>
            <p style={{marginTop:3}}>{item.notes}</p>
          </div>
        )}

        {/* Tags */}
        {tags.length>0&&(
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:4}}>
            {tags.map((t,i)=>(
              <span key={i} style={{fontSize:11,padding:"2px 8px",background:T.btn,color:T.btnTx,borderRadius:10,display:"flex",alignItems:"center",gap:4}}>
                <span style={{display:"flex"}}>{IC.tag}</span>{t}
              </span>
            ))}
          </div>
        )}

        <p style={{fontSize:11,color:T.border,marginTop:4}}>{new Date(item.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}</p>
      </div>
    </div>
  );
}

// ── Add Form ──────────────────────────────────────────────────────────────────
function AddForm({ onAdd, isPersonal, defaultCat, T }) {
  const [open,setOpen]=useState(false);
  const empty = {name:"",request:"",versets:[""],notes:"",category:defaultCat||"famille",status:"actif",priority:"normal",tags:[]};
  const [f,setF]=useState(empty);
  const [newTag,setNewTag]=useState("");
  const [saving,setSaving]=useState(false);

  const addVerset = () => setF(p=>({...p,versets:[...p.versets,""]}));
  const setVerset = (i,v) => setF(p=>({...p,versets:p.versets.map((x,j)=>j===i?v:x)}));
  const delVerset = i => setF(p=>({...p,versets:p.versets.filter((_,j)=>j!==i)}));
  const addTag = () => { const t=newTag.trim(); if(t&&!f.tags.includes(t)){setF(p=>({...p,tags:[...p.tags,t]}));} setNewTag(""); };
  const delTag = t => setF(p=>({...p,tags:p.tags.filter(x=>x!==t)}));

  const submit = async () => {
    if(!f.name.trim() && !f.request.trim()) return;
    setSaving(true);
    const tbl = isPersonal?"intercession_personal":"intercession_public";
    const versetsClean = f.versets.map(v=>v.trim()).filter(Boolean);
    const payload = {...f, name:f.name.trim(), request:f.request.trim(), notes:f.notes.trim(), versets:versetsClean};
    const res = await sbPost(tbl, payload);
    setSaving(false);
    if(res?.__error){ alert(`Erreur d'enregistrement (${res.status}) :\n${res.detail}`); return; }
    if(res?.[0]){onAdd(res[0]);setF(empty);setOpen(false);} else { alert("Erreur inconnue : l'enregistrement n'a renvoyé aucune donnée."); }
  };

  const inp = {width:"100%",padding:"9px 12px",fontSize:13.5,background:T.bg,border:`1px solid ${T.border}`,borderRadius:8,color:T.text,outline:"none"};
  const lbl = {fontSize:11,fontWeight:600,color:T.text2,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:5,display:"block"};

  if(!open) return (
    <button onClick={()=>setOpen(true)}
      style={{width:"100%",padding:"11px 16px",background:"none",border:`1.5px dashed ${T.border}`,borderRadius:10,color:T.text2,fontSize:13.5,display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginBottom:18,transition:"all 0.15s"}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text2;}}>
      {IC.plus} Ajouter un sujet de prière
    </button>
  );

  return (
    <div style={{background:T.surface,border:`1px solid ${T.accent}40`,borderRadius:12,padding:22,marginBottom:20,animation:"fadeUp 0.3s"}}>
      <h3 style={{fontSize:14,fontWeight:600,color:T.accent,marginBottom:18}}>Nouveau sujet d'intercession</h3>

      {/* Nom */}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Nom / Personne / Groupe</label>
        <input style={inp} placeholder="Ex: Jean Martin, Famille Dupont, Jeunesse de l'église…" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} autoFocus/>
      </div>

      {/* Sujet */}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Sujet de prière</label>
        <textarea style={{...inp,resize:"vertical",minHeight:72,lineHeight:1.6}} placeholder="Décrivez le sujet d'intercession…" value={f.request} onChange={e=>setF(p=>({...p,request:e.target.value}))}/>
      </div>

      {/* Versets multiples */}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Versets d'appui</label>
        {f.versets.map((v,i)=>(
          <div key={i} style={{display:"flex",gap:7,marginBottom:7,alignItems:"center"}}>
            <span style={{color:T.accent,display:"flex",flexShrink:0}}>{IC.book}</span>
            <input style={{...inp,flex:1}} placeholder={`Ex: Jean 14:13 — "Tout ce que vous demanderez…"`} value={v} onChange={e=>setVerset(i,e.target.value)}/>
            {f.versets.length>1&&(
              <button onClick={()=>delVerset(i)} style={{background:"none",border:"none",color:T.text2,display:"flex",padding:2,flexShrink:0}}
                onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color=T.text2}>
                {IC.trash}
              </button>
            )}
          </div>
        ))}
        <button onClick={addVerset}
          style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:7,border:`1px solid ${T.border}`,background:"none",color:T.text2,fontSize:12,marginTop:2,transition:"all 0.12s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.color=T.accent;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text2;}}>
          {IC.plus} Ajouter un verset
        </button>
      </div>

      {/* Notes */}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Notes additionnelles</label>
        <textarea style={{...inp,resize:"vertical",minHeight:64,lineHeight:1.6}} placeholder="Contexte, détails supplémentaires, réponses partielles…" value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))}/>
      </div>

      {/* Tags */}
      <div style={{marginBottom:14}}>
        <label style={lbl}>Tags</label>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:7}}>
          {f.tags.map((t,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,padding:"3px 9px",background:T.btn,color:T.btnTx,borderRadius:10}}>
              {t}
              <button onClick={()=>delTag(t)} style={{background:"none",border:"none",color:T.btnTx,padding:0,lineHeight:1,fontSize:13,cursor:"pointer"}}>×</button>
            </span>
          ))}
        </div>
        <div style={{display:"flex",gap:7}}>
          <input style={{...inp,flex:1}} placeholder='Ex: "urgent", "Afrique", "guérison"…' value={newTag}
            onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addTag();}}}/>
          <button onClick={addTag}
            style={{padding:"9px 14px",background:T.btn,border:`1px solid ${T.border}`,borderRadius:8,color:T.btnTx,fontSize:13,fontWeight:500}}>
            Ajouter
          </button>
        </div>
      </div>

      {/* Catégorie + Priorité */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
        <div>
          <label style={lbl}>Catégorie</label>
          {!defaultCat
            ? <select style={{...inp}} value={f.category} onChange={e=>setF(p=>({...p,category:e.target.value}))}>
                {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            : <div style={{...inp,color:T.text2,cursor:"default"}}>{CATEGORIES.find(c=>c.id===defaultCat)?.label}</div>
          }
        </div>
        <div>
          <label style={lbl}>Priorité</label>
          <select style={{...inp}} value={f.priority} onChange={e=>setF(p=>({...p,priority:e.target.value}))}>
            {PRIORITIES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={submit} disabled={saving}
          style={{flex:1,padding:"11px",background:T.accent,border:"none",borderRadius:9,color:"#fff",fontWeight:600,fontSize:14,opacity:saving?0.7:1,transition:"opacity 0.15s"}}>
          {saving?"Enregistrement…":"Enregistrer"}
        </button>
        <button onClick={()=>{setOpen(false);setF(empty);}}
          style={{padding:"11px 18px",background:"none",border:`1px solid ${T.border}`,borderRadius:9,color:T.text2,fontSize:14}}>
          Annuler
        </button>
      </div>
    </div>
  );
}

// ── Sidebar NavBtn ────────────────────────────────────────────────────────────
function NavBtn({ icon, label, active, onClick, T, count }) {
  return (
    <button onClick={onClick}
      style={{display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:8,border:"none",width:"100%",textAlign:"left",background:active?`${T.accent}18`:"none",color:active?T.accent:T.text2,fontSize:13,fontWeight:active?600:400,transition:"all 0.12s"}}
      onMouseEnter={e=>{if(!active){e.currentTarget.style.background=T.btn;e.currentTarget.style.color=T.text;}}}
      onMouseLeave={e=>{if(!active){e.currentTarget.style.background="none";e.currentTarget.style.color=T.text2;}}}>
      <span style={{display:"flex",flexShrink:0}}>{icon}</span>
      <span style={{flex:1}}>{label}</span>
      {count>0&&<span style={{fontSize:10,background:active?T.accent+"25":T.btn,color:active?T.accent:T.text2,borderRadius:10,padding:"1px 6px",fontWeight:600}}>{count}</span>}
    </button>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [night,setNight] = useState(nightHour());
  const [siteOk,setSiteOk]   = useState(false);
  const [persoOk,setPersoOk] = useState(false);
  const [askPerso,setAskPerso] = useState(false);
  const [view,setView] = useState("home");
  const [cat,setCat]   = useState("famille");
  const [pub,setPub]   = useState([]);
  const [perso,setPerso] = useState([]);
  const [loading,setLoading] = useState(false);

  const T = theme(night);

  useEffect(()=>{ const id=setInterval(()=>setNight(nightHour()),60000); return()=>clearInterval(id); },[]);

  const load = useCallback(async (withP) => {
    setLoading(true);
    const p = await sbGet("intercession_public"); setPub(p);
    if(withP){ const q = await sbGet("intercession_personal"); setPerso(q); }
    setLoading(false);
  },[]);

  useEffect(()=>{ if(siteOk) load(persoOk); },[siteOk,persoOk,load]);

  const stPub   = async(id,s)=>{await sbPatch("intercession_public",id,{status:s});setPub(p=>p.map(i=>i.id===id?{...i,status:s}:i));};
  const stPerso = async(id,s)=>{await sbPatch("intercession_personal",id,{status:s});setPerso(p=>p.map(i=>i.id===id?{...i,status:s}:i));};
  const prPub   = async(id,pr)=>{await sbPatch("intercession_public",id,{priority:pr});setPub(p=>p.map(i=>i.id===id?{...i,priority:pr}:i));};
  const prPerso = async(id,pr)=>{await sbPatch("intercession_personal",id,{priority:pr});setPerso(p=>p.map(i=>i.id===id?{...i,priority:pr}:i));};
  const delPub  = async id=>{if(!window.confirm("Supprimer ce sujet ?"))return;await sbDel("intercession_public",id);setPub(p=>p.filter(i=>i.id!==id));};
  const delPerso= async id=>{if(!window.confirm("Supprimer ce sujet ?"))return;await sbDel("intercession_personal",id);setPerso(p=>p.filter(i=>i.id!==id));};

  const catItems = pub.filter(i=>i.category===cat);
  const activeCat = CATEGORIES.find(c=>c.id===cat);
  const totalExauce = [...pub,...perso].filter(i=>i.status==="exauce").length;

  if(!siteOk) return (<div><style>{CSS}</style><PwGate title="Plateforme d'Intercession" sub="Entrez le mot de passe pour accéder à l'espace de prière" hint={SITE_PWD} onUnlock={()=>setSiteOk(true)} T={T}/></div>);
  if(askPerso) return (<div><style>{CSS}</style><PwGate title="Espace Personnel" sub="Cet espace est réservé — entrez votre mot de passe privé" hint={PERSO_PWD} onUnlock={()=>{setPersoOk(true);setAskPerso(false);setView("perso");load(true);}} T={T}/></div>);

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.text,display:"flex",flexDirection:"column",transition:"background 0.4s,color 0.4s"}}>
      <style>{CSS}</style>

      {/* Header */}
      <header style={{height:60,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",background:T.surface,position:"sticky",top:0,zIndex:100,transition:"background 0.4s"}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:34,height:34,borderRadius:9,background:T.accent+"18",display:"flex",alignItems:"center",justifyContent:"center",color:T.accent}}>{IC.dove}</div>
          <span style={{fontFamily:"'Libre Baskerville',serif",fontSize:18,fontWeight:400,color:T.text,letterSpacing:"0.03em"}}>Intercession</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:12,color:T.text2}}>🙏 {pub.length+perso.length} sujets</span>
          <span style={{fontSize:12,color:T.gold}}>✓ {totalExauce} exaucé{totalExauce!==1?"s":""}</span>
          {loading&&<span style={{display:"flex",color:T.accent,animation:"spin 0.9s linear infinite"}}>{IC.refresh}</span>}
          <button onClick={()=>setNight(n=>!n)}
            style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${T.border}`,background:T.btn,color:T.btnTx,fontSize:12,fontWeight:500,transition:"all 0.2s"}}>
            {night?"☀ Jour":"☾ Nuit"}
          </button>
        </div>
      </header>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar */}
        <aside style={{width:238,flexShrink:0,borderRight:`1px solid ${T.border}`,background:T.surface,padding:"14px 10px",overflowY:"auto",transition:"background 0.4s"}}>
          <NavBtn icon={IC.home} label="Vue d'ensemble" active={view==="home"} onClick={()=>setView("home")} T={T}/>

          <div style={{margin:"16px 0 5px 10px",fontSize:10,fontWeight:600,color:T.text2,letterSpacing:"0.1em",textTransform:"uppercase"}}>Prière publique</div>
          {CATEGORIES.map(c=>(
            <NavBtn key={c.id} icon={<span style={{color:T.accent,display:"flex"}}>{IC[c.icon]}</span>}
              label={c.label} active={view==="cat"&&cat===c.id}
              count={pub.filter(i=>i.category===c.id).length}
              onClick={()=>{setView("cat");setCat(c.id);}} T={T}/>
          ))}

          <div style={{margin:"16px 0 5px 10px",fontSize:10,fontWeight:600,color:T.text2,letterSpacing:"0.1em",textTransform:"uppercase"}}>Personnel</div>
          <NavBtn icon={<span style={{display:"flex",color:T.accent}}>{persoOk?IC.user:IC.lock}</span>}
            label={persoOk?"Mon espace privé":"Espace privé (verrouillé)"}
            active={view==="perso"} count={persoOk?perso.length:0}
            onClick={()=>persoOk?setView("perso"):setAskPerso(true)} T={T}/>

          <div style={{margin:"16px 0 5px 10px",fontSize:10,fontWeight:600,color:T.text2,letterSpacing:"0.1em",textTransform:"uppercase"}}>Export</div>
          <button onClick={()=>exportPDF(pub)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:8,border:"none",width:"100%",background:"none",color:T.text2,fontSize:13,textAlign:"left",transition:"all 0.12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=T.btn;e.currentTarget.style.color=T.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.text2;}}>
            {IC.download}&nbsp; Exporter en PDF
          </button>
          <button onClick={()=>exportCSV(pub)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:8,border:"none",width:"100%",background:"none",color:T.text2,fontSize:13,textAlign:"left",transition:"all 0.12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=T.btn;e.currentTarget.style.color=T.accent;}}
            onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.text2;}}>
            {IC.download}&nbsp; Exporter en Excel / CSV
          </button>

          <div style={{marginTop:16,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
            <button onClick={()=>load(persoOk)}
              style={{display:"flex",alignItems:"center",gap:8,padding:"8px 11px",borderRadius:8,border:"none",width:"100%",background:"none",color:T.text2,fontSize:13,textAlign:"left",transition:"all 0.12s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=T.btn;e.currentTarget.style.color=T.text;}}
              onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.color=T.text2;}}>
              {IC.refresh}&nbsp; Synchroniser
            </button>
          </div>
        </aside>

        {/* Main */}
        <main style={{flex:1,overflowY:"auto",padding:"28px 28px 48px"}}>

          {/* Vue d'ensemble */}
          {view==="home"&&(
            <div style={{animation:"fadeUp 0.4s",maxWidth:860}}>
              <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:26,fontWeight:400,color:T.text,marginBottom:6}}>Que ta volonté soit faite</h2>
              <p style={{color:T.text2,fontSize:14,marginBottom:30,fontStyle:"italic",fontFamily:"'Libre Baskerville',serif"}}>
                « Je vous exhorte donc, avant tout, à faire des prières, des supplications, des requêtes, pour tous les hommes » — 1 Timothée 2:1
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:30}}>
                {[
                  {label:"Sujets actifs", val:[...pub,...perso].filter(i=>i.status==="actif").length, c:T.badge.active},
                  {label:"Exaucés",       val:totalExauce, c:T.gold},
                  {label:"Urgents",       val:[...pub,...perso].filter(i=>i.priority==="urgent").length, c:T.prio.urgent},
                  {label:"Total",         val:pub.length+perso.length, c:T.text2},
                ].map(s=>(
                  <div key={s.label} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"16px 14px",textAlign:"center"}}>
                    <div style={{fontSize:28,fontWeight:700,color:s.c,fontFamily:"'Libre Baskerville',serif"}}>{s.val}</div>
                    <div style={{fontSize:12,color:T.text2,marginTop:4}}>{s.label}</div>
                  </div>
                ))}
              </div>
              <h3 style={{fontSize:11,fontWeight:600,color:T.text2,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Catégories de prière</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12}}>
                {CATEGORIES.map(c=>{
                  const n=pub.filter(i=>i.category===c.id).length;
                  return (
                    <button key={c.id} onClick={()=>{setView("cat");setCat(c.id);}}
                      style={{background:T.surface,border:`1px solid ${T.border}`,borderTop:`3px solid ${T.accent}`,borderRadius:10,padding:"16px 14px",textAlign:"left",cursor:"pointer",transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 20px ${T.accent}22`;e.currentTarget.style.transform="translateY(-2px)";}}
                      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
                      <div style={{color:T.accent,marginBottom:8,display:"flex"}}>{IC[c.icon]}</div>
                      <div style={{fontSize:13.5,fontWeight:500,color:T.text,marginBottom:3}}>{c.label}</div>
                      <div style={{fontSize:11,color:T.text2}}>{n} sujet{n!==1?"s":""}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Vue catégorie */}
          {view==="cat"&&activeCat&&(
            <div style={{animation:"fadeUp 0.35s",maxWidth:720}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{width:40,height:40,borderRadius:10,background:T.accent+"18",display:"flex",alignItems:"center",justifyContent:"center",color:T.accent}}>{IC[activeCat.icon]}</div>
                <div>
                  <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,fontWeight:400,color:T.text}}>{activeCat.label}</h2>
                  <p style={{fontSize:13,color:T.text2}}>{catItems.length} sujet{catItems.length!==1?"s":""}</p>
                </div>
              </div>
              <AddForm onAdd={i=>setPub(p=>[i,...p])} isPersonal={false} defaultCat={cat} T={T}/>
              {catItems.length===0
                ?<div style={{textAlign:"center",padding:"40px 20px",color:T.text2}}>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:18,marginBottom:8}}>Aucun sujet pour l'instant</p>
                  <p style={{fontSize:13}}>Soyez le premier à intercéder pour cette catégorie</p>
                </div>
                :<div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {catItems.map(it=><PCard key={it.id} item={it} onStatus={stPub} onPriority={prPub} onDel={delPub} T={T}/>)}
                </div>
              }
            </div>
          )}

          {/* Espace personnel */}
          {view==="perso"&&persoOk&&(
            <div style={{animation:"fadeUp 0.35s",maxWidth:720}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{width:40,height:40,borderRadius:10,background:T.accent+"18",display:"flex",alignItems:"center",justifyContent:"center",color:T.accent}}>{IC.user}</div>
                <div>
                  <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,fontWeight:400,color:T.text}}>Mon espace personnel</h2>
                  <p style={{fontSize:13,color:T.text2}}>{perso.length} sujet{perso.length!==1?"s":""} — synchronisé sur tous vos appareils</p>
                </div>
              </div>
              <AddForm onAdd={i=>setPerso(p=>[i,...p])} isPersonal={true} T={T}/>
              {perso.length===0
                ?<div style={{textAlign:"center",padding:"40px 20px",color:T.text2}}>
                  <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:18,marginBottom:8}}>Espace vide</p>
                  <p style={{fontSize:13}}>Ajoutez vos sujets personnels, accessibles depuis tous vos appareils</p>
                </div>
                :<div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {perso.map(it=><PCard key={it.id} item={it} onStatus={stPerso} onPriority={prPerso} onDel={delPerso} T={T}/>)}
                </div>
              }
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
