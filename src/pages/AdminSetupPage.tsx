import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/branding/Logo";
import "./AdminSetupPage.css";
const API = import.meta.env.VITE_API_URL || "https://neurooption-backend.onrender.com";
export default function AdminSetupPage() {
 const [available,setAvailable] = useState<boolean|null>(null);
 const [fullName,setFullName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [repeat,setRepeat] = useState("");
 const [setupKey,setSetupKey] = useState("");
 const [busy,setBusy] = useState(false);
 const [done,setDone] = useState(false);
 const [message,setMessage] = useState("");
 useEffect(()=>{fetch(API+"/admin/bootstrap-status",{cache:"no-store"}).then(r=>r.json()).then(r=>setAvailable(r.available===true)).catch(()=>setMessage("Unable to check setup status."));},[]);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage("");
  if(password!==repeat){setMessage("Passwords do not match.");return;}
  setBusy(true);
  try{const r=await fetch(API+"/admin/bootstrap",{method:"POST",cache:"no-store",headers:{"Content-Type":"application/json"},body:JSON.stringify({fullName,email,password,setupKey})});
   const data=await r.json(); if(!r.ok)throw new Error(typeof data.message==="string"?data.message:"Setup failed.");
   setDone(true);setPassword("");setRepeat("");setSetupKey("");
  }catch(e){setMessage(e instanceof Error?e.message:"Setup failed.");}finally{setBusy(false);}
 }
 return <main className="ns-bg"><div className="ns-layout">
 <aside className="ns-brand"><div className="ns-logo"><Logo variant="emblem"/><strong>NEUROOPTION<br/>ADMIN CONSOLE</strong></div><div><small>SECURE INITIALIZATION</small><h1>Secure control.<br/>Clear oversight.</h1><p>One-time Super Administrator provisioning. Available only with a temporary owner authorization configured in Render.</p></div><span>Restricted operations</span></aside>
 <section className="ns-main"><Link to="/admin">← Back to admin sign in</Link>
 {done?<><h2>Administrator created</h2><p>Remove the temporary bootstrap key and expiry from Render, then sign in with the password you selected.</p><Link to="/admin">Continue to sign in</Link></>:<>
 <h2>First administrator setup</h2><p>Enter the owner details and temporary setup code. Never share your credentials in chat.</p>
 {message&&<p role="alert" className="ns-error">{message}</p>}
 {available===null&&!message&&<p role="status">Checking setup authorization…</p>}
 {available===false&&<p role="status">Setup unavailable, expired, or already completed.</p>}
 {available===true&&<form onSubmit={submit}>
 <label>Full name<input autoComplete="name" required minLength={3} maxLength={100} value={fullName} onChange={e=>setFullName(e.target.value)}/></label>
 <label>Authorized email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
 <label>New administrator password<input type="password" autoComplete="new-password" required minLength={14} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/></label>
 <label>Confirm password<input type="password" autoComplete="new-password" required value={repeat} onChange={e=>setRepeat(e.target.value)}/></label>
 <label>Temporary setup code<input type="password" autoComplete="off" required minLength={40} value={setupKey} onChange={e=>setSetupKey(e.target.value)}/></label>
 <small>Use 14+ characters, upper- and lowercase letters, numbers and a symbol.</small>
 <button disabled={busy}>{busy?"Creating…":"Create Super Administrator →"}</button></form>}
 </>}</section></div></main>;
}