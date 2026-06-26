function updateClock(){
    const n=new Date();//抓電腦現在時間
    const h=String(n.getHours()).padStart(2,'0');//抓幾點，個位數補0變成兩位數
    const m=String(n.getMinutes()).padStart(2,'0');//幾分
    document.getElementById('clock').textContent=h+':'+m;// 把結果寫進畫面上 id="clock"
}
//updateClock();//立刻執行一次
//setInterval(updateClock,10000);// 之後每 10000 毫秒（10秒）重新呼叫一次
//document.getElementById('year').textContent=new Date().getFullYear();// 帶入今年

function setCaseNumber(){
    const n = Math.floor(Math.random() * 9000) + 1000; // 產生 1000~9999 之間的隨機整數
    document.getElementById('case-num').textContent = n; // 寫入 Modal 裡 id="case-num" 的位置

// Easter egg
let anomalyLevel = 0;// 計數器，從 0 開始累加

const statusEl = document.getElementById('status-anomaly'); // 抓到要更新文字的那個狀態列元素
setInterval(() => {

    anomalyLevel++;
    // 每次計時器觸發，計數器 +1

    if (anomalyLevel === 15) {                               // 累加到第15次（即 15×5=75秒後）
        statusEl.innerHTML = '異常指數：<span style="color:#CC8800;">偏高</span>'; // 改成橘色「偏高」
    }
    if (anomalyLevel === 30) {                               // 累加到第30次（即150秒後）
        statusEl.innerHTML = '異常指數：<span style="color:#CC0000;" class="blink">警戒 ●</span>'; // 改成紅色閃爍「警戒」
    }
}, 5000);} // 每 5000 毫秒（5秒）執行一次上面的函式