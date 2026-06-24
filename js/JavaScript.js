function updateClock(){
    const n=new Date();//抓電腦現在時間
    const h=String(n.getHours()).padStart(2,'0');//抓幾點
    const m=String(n.getMinutes()).padStart(2,'0');//幾分
    document.getElementById('clock').textContent=h+':'+m;
}
updateClock();//立刻執行一次
setInterval(updateClock,10000);// 每隔 10 秒鐘更新一次
document.getElementById('year').textContent=new Date().getFullYear();

function showAnomalyPopup(){
    const n=Math.floor(Math.random()*9000)+1000;
    document.getElementById('case-num').textContent=n;
    document.getElementById('anomaly-popup').style.display='block';
}

// Easter egg: anomaly status ramps up slowly
let anomalyLevel=0;
const statusEl=document.getElementById('status-anomaly');
setInterval(()=>{
    anomalyLevel++;
    if(anomalyLevel===15) statusEl.innerHTML='異常指數：<span style="color:#CC8800;">偏高</span>';
    if(anomalyLevel===30) statusEl.innerHTML='異常指數：<span style="color:#CC0000;" class="blink">警戒 ●</span>';
},5000);