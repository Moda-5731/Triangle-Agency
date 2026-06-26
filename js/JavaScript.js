function updateClock(){
    const n=new Date();//抓電腦現在時間
    const h=String(n.getHours()).padStart(2,'0');//抓幾點，個位數補0變成兩位數
    const m=String(n.getMinutes()).padStart(2,'0');//幾分
    document.getElementById('clock').textContent=h+':'+m;// 把結果寫進畫面上 id="clock"
}
updateClock();//立刻執行一次
document.getElementById('year').textContent=new Date().getFullYear();// 帶入今年

// 全局陣列儲存眼睛數據
let spawnedEyes = [];

// 隨機生成案件編號
function setCaseNumber(){
    const n = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById('case-num').textContent = n;

    document.body.style.backgroundColor = "var(--TA-bule)";

    //追蹤眼
    spawnAnomalyEyes(40);
}

//眼睛生成核
function spawnAnomalyEyes(count) {
    // 把舊的眼睛清空
    document.querySelectorAll('.bg-eye').forEach(el => el.remove());
    spawnedEyes = [];

    // 計算當前 win-body 的滾動總長度，確保整頁背景都有眼睛
    const scrollHeight = document.body.scrollHeight;
    const windowWidth = window.innerWidth;

    for (let i = 0; i < count; i++) {
        const eyeDiv = document.createElement('div');
        eyeDiv.className = 'bg-eye';

        // 隨機座標與隨機眼眶旋轉角度
        let randomLeft, randomTop, randomBaseAngle;
        let isOverlapping = false;
        let attempts = 0; // 防止卡死計數器
        const maxAttempts = 300; // 最多嘗試抽籤300次
        const minDistance = 75; // 眼睛與眼睛中心點之間的安全距離（像素）

        do {
            isOverlapping = false;
            attempts++;

            // 1. 隨機抽一組座標與角度
            randomLeft = Math.random() * (windowWidth - 120);
            randomTop = Math.random() * (scrollHeight - 70);
            randomBaseAngle = Math.random() * 360;

            const newCenterX = randomLeft + 50;
            const newCenterY = randomTop + 28;

            // 2. 檢查是否與已經長出來的眼睛撞到
            for (let j = 0; j < spawnedEyes.length; j++) {
                const existingEye = spawnedEyes[j];
                const dx = newCenterX - existingEye.x;
                const dy = newCenterY - existingEye.y;
                const distance = Math.sqrt(dx * dx + dy * dy); // 畢氏定理算距離

                if (distance < minDistance) {
                    isOverlapping = true; // 撞到了，標記為重疊
                    break; // 跳出當前比對，重新抽籤
                }
            }
        } while (isOverlapping && attempts < maxAttempts);

        // 如果這一個位置重試 300 次都塞不下，就放棄這隻眼睛，避免瀏覽器卡死
        if (attempts >= maxAttempts) {
            continue;
        }

        // 3. 確定沒重疊，安全套用座標
        eyeDiv.style.left = randomLeft + 'px';
        eyeDiv.style.top = randomTop + 'px';
        eyeDiv.style.transform = `rotate(${randomBaseAngle}deg)`;

        // SVG 結構clipPath
        const clipId = `eyeClip-${i}`;
        eyeDiv.innerHTML = `
            <svg viewBox="0 0 100 56">
                <defs>
                    <clipPath id="${clipId}">
                        <path d="M2,28 Q30,2 50,2 Q70,2 98,28 Q70,54 50,54 Q30,54 2,28 Z" />
                    </clipPath>
                </defs>
                <path class="eye-outline" d="M2,28 Q30,2 50,2 Q70,2 98,28 Q70,54 50,54 Q30,54 2,28 Z" fill="#0047bb" stroke="#fff" stroke-width="3" />
                <g clip-path="url(#${clipId})">
                    <circle class="eye-pupil" cx="50" cy="28" r="14" /> </g>
            </svg>
        `;

        document.body.appendChild(eyeDiv);

        // 將這隻眼睛的物理節點與中心點座標存進陣列裡，方便後面計算夾角
        spawnedEyes.push({
            element: eyeDiv,
            pupil: eyeDiv.querySelector('.eye-pupil'),
            baseAngle: randomBaseAngle,
            x: randomLeft + 50, // 眼睛的中心 X
            y: randomTop + 28   // 眼睛的中心 Y
        });
    }
}

// 🌟 實時追蹤滑鼠游標 (監聽整個 Document)
document.addEventListener('mousemove', (e) => {
    if (spawnedEyes.length === 0) return;

    // 滑鼠目前的絕對網頁座標（考慮到捲軸捲動）
    const mouseX = e.pageX;
    const mouseY = e.pageY;

    spawnedEyes.forEach(eye => {
        // 1. 計算滑鼠到眼睛中心點的三角函數 Delta 值
        const dx = mouseX - eye.x;
        const dy = mouseY - eye.y;

        // 2. 算出滑鼠與眼睛的絕對夾角弧度
        const angle = Math.atan2(dy, dx);

        // 3. 讓瞳孔朝著滑鼠方向移動一小段距離 (最大偏移 12 像素)
        const distance = Math.min(12, Math.sqrt(dx*dx + dy*dy) / 15);
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        // 💡 關鍵：因為眼眶本身已經有了隨機的 `eye.baseAngle` 旋轉，
        // 我們的瞳孔偏移量必須「反向轉回去」，否則瞳孔在眼眶轉動後會往不對的方向飄！
        const radians = (eye.baseAngle * Math.PI) / 180;
        const correctedX = pupilX * Math.cos(-radians) - pupilY * Math.sin(-radians);
        const correctedY = pupilX * Math.sin(-radians) + pupilY * Math.cos(-radians);

        // 即時對瞳孔套用位移效果
        eye.pupil.style.transform = `translate(${correctedX}px, ${correctedY}px)`;
    });
});


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
}, 5000);// 每 5000 毫秒（5秒）執行一次上面的函式

//拖曳
function makeModalDraggable() {
    const header = document.getElementById('anomaly-modal-header');
    // 💡 我們實際要移動的，是負責控制外觀身材與定位的對話框主體
    const modalDialog = header.closest('.modal-dialog');

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // 1. 當滑鼠在標題列「按下去」
    header.addEventListener('mousedown', (e) => {
        // 如果點到的是 ✕ 關閉按鈕，就不觸發拖曳
        if (e.target.closest('.win-btn-sm')) return;

        isDragging = true;

        // 在脫離排版流時，不會縮水或變形
        const currentWidth = modalDialog.offsetWidth;
        modalDialog.style.width = currentWidth + 'px';

        // 自由定位，dialog 轉absolute
        modalDialog.style.position = 'absolute';

        // margin 歸零
        modalDialog.style.setProperty('margin', '0', 'important');
        modalDialog.style.setProperty('transform', 'none', 'important'); // 防止某些 Bootstrap 版本內建的位移

        // 計算滑鼠點擊位置距離視窗左上角的相對距離
        offsetX = e.clientX - modalDialog.getBoundingClientRect().left;
        offsetY = e.clientY - modalDialog.getBoundingClientRect().top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;

        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        modalDialog.style.left = left + 'px';
        modalDialog.style.top = top + 'px';
    }

    // 當滑鼠放開
    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}

// 執行它
if (document.getElementById('anomaly-modal-header')) {
    makeModalDraggable();
}