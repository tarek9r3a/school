const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const coordDisplay = document.getElementById('coordDisplay');
const gridSize = 40;
let currentPointColor = '#f8f9fa';
let uniformColor = null;
let customColors = [];

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const arrowColors = [
    '#00ff88', '#ff5722', '#2196F3',
    '#9C27B0', '#FFEB3B', '#4CAF50',
    '#E91E63', '#00BCD4', '#FF9800',
    '#003366','#0e2f44','#696969',
    '#cc0000','#420420','#0a75ad'
];

let points = [], arrows = [];
let dragging = false, dragStart = null, nearest = null;
let mouseX = 0, mouseY = 0;
let holdTimer = null;

// إنشاء عنصر اختيار اللون المخفي

// تحويل الإحداثيات إلى نظام رياضي
function toLogical(x, y) {
    return { 
        x: Number(((x - centerX) / gridSize).toFixed(1)), 
        y: Number(((centerY - y) / gridSize).toFixed(1))
    };
}

// رسم الشبكة الخلفية
function drawGrid() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    for (let x = centerX % gridSize; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = centerY % gridSize; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// رسم المحورين X و Y
function drawAxes() {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
}

// رسم السهم
function drawArrow(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = 15;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - 0.3), y2 - headLength * Math.sin(angle - 0.3));
    ctx.lineTo(x2 - headLength * Math.cos(angle + 0.3), y2 - headLength * Math.sin(angle + 0.3));
    ctx.closePath();
    ctx.fill();
}

// البحث عن أقرب نقطة
function findNearbyPoint(x, y, threshold = 10) {
    return points.find(p => Math.hypot(p.x - x, p.y - y) < threshold);
}

// رسم النقاط
function drawPoints() {
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = currentPointColor;
        ctx.fill();
    });
}

// إعادة الرسم الكامل
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawAxes();
    arrows.forEach((arrow, i) => {
        const color = customColors[i] || uniformColor || arrowColors[i % arrowColors.length];
        drawArrow(arrow.x1, arrow.y1, arrow.x2, arrow.y2, color);
    });
    drawPoints();
}

// تحديث قائمة الإحداثيات
function updateCoordinatesList() {
    const container = document.getElementById('arrowsCoordinates');
    container.innerHTML = '';
    
    arrows.forEach((arrow, index) => {
        const start = toLogical(arrow.x1, arrow.y1);
        const end = toLogical(arrow.x2, arrow.y2);
        const currentColor = customColors[index] || uniformColor || arrowColors[index % arrowColors.length];
        
        const wrapper = document.createElement('div');
        wrapper.className = 'arrow-coordinate';
        
        // عناصر التحكم (يسار)
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls-left';
        
        // زر الحذف
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = "<i class='bx bx-x-circle'></i>";
        deleteBtn.onclick = () => removeArrow(index);
        
        // محدد اللون ومعاينته
        const colorWrapper = document.createElement('div');
        colorWrapper.className = 'color-wrapper';
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.className = 'color-input';
        colorInput.value = currentColor;
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'color-preview';
        colorPreview.style.backgroundColor = currentColor;
        colorPreview.onclick = () => colorInput.click();
        
        colorInput.addEventListener('input', (e) => {
            customColors[index] = e.target.value;
            colorPreview.style.backgroundColor = e.target.value;
            redraw();
        });
        
        // معلومات الشعاع (يمين)
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-right';
        infoDiv.innerHTML = `
            <span class="ray-number">الشعاع ${index + 1}</span>
            البداية: (${start.x}, ${start.y}) |
            النهاية: (${end.x}, ${end.y})
        `;
        
        // تجميع العناصر
        colorWrapper.appendChild(colorPreview);
        colorWrapper.appendChild(colorInput);
        
        controlsDiv.appendChild(deleteBtn); // زر الحذف أولاً
        controlsDiv.appendChild(colorWrapper); // ثم محدد اللون
        
wrapper.appendChild(colorWrapper);  // يسار: زر اللون
wrapper.appendChild(infoDiv);       // وسط: المعلومات
wrapper.appendChild(deleteBtn);     // يمين: زر الحذف
        
        container.appendChild(wrapper);
    });
}
function removeArrow(index) {
    if (index >= 0 && index < arrows.length) {
        arrows.splice(index, 1);
        customColors.splice(index, 1);
        updateCoordinatesList(); // تحديث القائمة
        redraw(); // إعادة رسم اللوحة
    }
}

// أحداث الفأرة
canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    const snapX = Math.round((mouseX - centerX) / gridSize) * gridSize + centerX;
    const snapY = Math.round((mouseY - centerY) / gridSize) * gridSize + centerY;
    const existing = findNearbyPoint(snapX, snapY);

    if (existing) {
        dragging = true;
        dragStart = existing;
    } else {
        points.push({ x: snapX, y: snapY });
        redraw();
    }
});

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (dragging && dragStart) {
        nearest = findNearbyPoint(mouseX, mouseY);
        redraw();
        nearest ? 
            drawArrow(dragStart.x, dragStart.y, nearest.x, nearest.y, '#fff') :
            drawArrow(dragStart.x, dragStart.y, mouseX, mouseY, '#fff');
    }

    if (!holdTimer) {
        holdTimer = setTimeout(() => {
            const logical = toLogical(mouseX, mouseY);
            coordDisplay.textContent = `الإحداثيات: (${logical.x}, ${logical.y})`;
            coordDisplay.style.display = 'block';
            coordDisplay.style.left = `${e.pageX + 15}px`;
            coordDisplay.style.top = `${e.pageY + 15}px`;
        }, 300);
    }
});

canvas.addEventListener('mouseup', () => {
    if (dragging && dragStart && nearest && nearest !== dragStart) {
        arrows.push({ 
            x1: dragStart.x, 
            y1: dragStart.y, 
            x2: nearest.x, 
            y2: nearest.y 
        });
        customColors.push(uniformColor || arrowColors[arrows.length % arrowColors.length]);
        updateCoordinatesList();
    }
    dragging = false;
    dragStart = null;
    clearTimeout(holdTimer);
    holdTimer = null;
    redraw();
});

// أحداث التحكم
document.querySelector('.clear-btn').addEventListener('click', () => {
    arrows = [];
    customColors = [];
    updateCoordinatesList();
    redraw();
});
document.querySelector('.clear-points-btn').addEventListener('click', () => {
        points = [];
    arrows = [];
    customColors = [];
    updateCoordinatesList();
    redraw();
});


document.getElementById('pointColor').addEventListener('input', e => {
    currentPointColor = e.target.value;
    redraw();
});

// التهيئة الأولية
redraw();