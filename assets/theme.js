(function(){
  if(navigator.standalone)document.documentElement.classList.add("standalone");
  if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0){
    window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})});
  }
})();
(function(){
  var root=document.documentElement,btn=document.getElementById("theme"),label=document.getElementById("theme-label");
  if(!btn)return;
  function sync(){
    var dark=root.dataset.theme==="dark";
    label.textContent=dark?"Clair":"Sombre";
    btn.setAttribute("aria-pressed",dark?"true":"false");
    btn.setAttribute("aria-label",dark?"Passer au thème clair":"Passer au thème sombre");
  }
  btn.addEventListener("click",function(){
    var dark=root.dataset.theme!=="dark";
    if(dark)root.dataset.theme="dark";else delete root.dataset.theme;
    try{localStorage.setItem("theme",dark?"dark":"light")}catch(e){}
    sync();
  });
  sync();
})();
