function updateClock(){
    const n=new Date();//抓電腦現在時間
    const h=String(n.getHours()).padStart(2,'0');//抓幾點，個位數補0變成兩位數
    const m=String(n.getMinutes()).padStart(2,'0');//幾分
    document.getElementById('clock').textContent=h+':'+m;// 把結果寫進畫面上 id="clock"
}
updateClock();//立刻執行一次
setInterval(updateClock,10000);// 之後每 10000 毫秒（10秒）重新呼叫一次
document.getElementById('year').textContent=new Date().getFullYear();// 帶入今年

function showAnomalyPopup(){
    const n=Math.floor(Math.random()*9000)+1000;// 產生 1000~9999 之間的隨機整數
    document.getElementById('case-num').textContent=n;
    document.getElementById('anomaly-popup').style.display='block';
}

// Easter egg: anomaly status ramps up slowly
let anomalyLevel=0;                 // 計數器，從 0 開始累加
const statusEl=document.getElementById('status-anomaly');
setInterval(()=>{
    anomalyLevel++;                         // 每次計時器觸發，計數器 +1
    if(anomalyLevel===15) statusEl.innerHTML='異常指數：<span style="color:#CC8800;">偏高</span>';
    if(anomalyLevel===30) statusEl.innerHTML='異常指數：<span style="color:#CC0000;" class="blink">警戒 ●</span>';
},5000); // 每 5000 毫秒觸發一次