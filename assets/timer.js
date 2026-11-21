(function(){
const EFFORT=40,REPOS=20,TOURS=4,EXOS=Array.from(document.querySelectorAll("article.block h3")).map(h=>h.textContent),N=EXOS.length,TOTAL=TOURS*N;
const $=s=>document.querySelector(s);
let timer=null,st=null,audio=null;
function beep(freq,ms,n){
  try{
    audio=audio||new (window.AudioContext||window.webkitAudioContext)();
    for(let i=0;i<(n||1);i++){
      const o=audio.createOscillator(),g=audio.createGain();
      o.frequency.value=freq;o.connect(g);g.connect(audio.destination);
      const t=audio.currentTime+i*(ms/1000+0.08);
      g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.4,t+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001,t+ms/1000);
      o.start(t);o.stop(t+ms/1000+0.02);
    }
  }catch(e){}
}
function reset(){st={i:0,tour:1,phase:"pret",left:EFFORT};paint()}
function stop(){if(timer){clearInterval(timer);timer=null}}
function toggle(){
  if(timer){stop();paint();return}
  if(st.phase==="fini")reset();
  if(st.phase==="pret"){st.phase="effort";beep(880,150,2)}
  timer=setInterval(tick,1000);paint();
}
function tick(){
  st.left--;
  if(st.left>0&&st.left<=3)beep(660,80,1);
  if(st.left<=0){
    if(st.phase==="effort"){st.phase="repos";st.left=REPOS;beep(440,250,1)}
    else{
      st.i++;
      if(st.i>=N){st.i=0;st.tour++}
      if(st.tour>TOURS){st.phase="fini";stop();beep(880,200,3)}
      else{st.phase="effort";st.left=EFFORT;beep(880,150,2)}
    }
  }
  paint();
}
function paint(){
  const box=$("#timer");if(!box)return;
  box.dataset.phase=st.phase;
  const ex=EXOS[st.i]||"";
  const nxt=st.phase==="repos"?(st.i+1<N?EXOS[st.i+1]:(st.tour<TOURS?EXOS[0]:"")):"";
  $("#t").textContent=st.phase==="fini"?"0:00":"0:"+String(st.left).padStart(2,"0");
  $("#s").textContent=st.phase==="pret"?"Prêt":st.phase==="effort"?ex:st.phase==="repos"?"Repos"+(nxt?" · ensuite : "+nxt:""):"Circuit terminé";
  $("#r").textContent=st.phase==="pret"?TOURS+" tours de "+N+" exercices, "+Math.round(TOTAL*(EFFORT+REPOS)/60)+" minutes":st.phase==="fini"?"Passe aux étirements":"Tour "+st.tour+" sur "+TOURS+" · exercice "+(st.i+1)+" sur "+N;
  const done=st.phase==="fini"?TOTAL:((st.tour-1)*N+st.i);
  $("#b").style.width=(done/TOTAL*100)+"%";
  $("#go").textContent=timer?"Pause":st.phase==="pret"?"Démarrer le circuit":st.phase==="fini"?"Recommencer":"Reprendre";
  document.title=(st.phase==="effort"||st.phase==="repos")?"0:"+String(st.left).padStart(2,"0")+" · "+(st.phase==="effort"?ex:"Repos"):document.body.dataset.title;
}
document.body.dataset.title=document.title;
$("#go").onclick=toggle;$("#rz").onclick=()=>{stop();reset()};
document.addEventListener("keydown",e=>{if(e.code==="Space"&&e.target.tagName!=="BUTTON"){e.preventDefault();toggle()}});
reset();
})();
