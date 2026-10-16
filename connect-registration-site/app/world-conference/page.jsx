"use client";
import { useState } from "react";
export default function WorldConferencePage() {
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  async function submit(e) {
    e.preventDefault(); setLoading(true); setResult(null);
    try {
      const res=await fetch("/api/world-conference",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,phone})});
      const data=await res.json();
      setResult({success:res.ok,...data});
      if(res.ok){setName("");setPhone("");}
    } catch {setResult({success:false,error:"Connection failed. Please try again."});}
    finally {setLoading(false);}
  }
  const input={display:"block",width:"100%",boxSizing:"border-box",padding:14,border:"1px solid #b6cbbc",borderRadius:10,marginTop:8,fontSize:16};
  return <main style={{minHeight:"100vh",background:"#eff7f1",padding:"50px 16px",fontFamily:"Arial,sans-serif",color:"#16472c"}}>
    <section style={{maxWidth:480,margin:"auto",background:"white",borderRadius:20,padding:30,boxShadow:"0 8px 35px #16472c20"}}>
      <h1 style={{textAlign:"center",fontSize:29}}>WORLD CONFERENCE 2026</h1>
      <p style={{textAlign:"center",color:"#637b69"}}>Participant Registration</p>
      <form onSubmit={submit} style={{display:"grid",gap:20,marginTop:28}}>
        <label>Full Name<input style={input} required maxLength={100} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name"/></label>
        <label>Phone Number<input style={input} required type="tel" inputMode="tel" maxLength={20} autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08012345678"/></label>
        <button disabled={loading} style={{background:"#17683a",color:"white",border:0,borderRadius:10,padding:16,fontSize:16}}>{loading?"Submitting...":"Register Now"}</button>
      </form>
      {result&&<div role="status" style={{marginTop:20,padding:16,borderRadius:10,background:result.success?"#e1f6e7":"#ffeaea",color:result.success?"#155b33":"#922"}}>{result.message||result.error}{result.registrationId&&<p><strong>Registration ID: {result.registrationId}</strong></p>}</div>}
      <p style={{marginTop:25,fontSize:12,textAlign:"center",color:"#627868"}}>Your details are used for conference registration and coordination.</p>
    </section>
  </main>;
}