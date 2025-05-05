
document.body.style.fontFamily = "'Cal Sans', sans-serif";

let functions = [];

function draw() {
    const equationInput = document.getElementById('equation').value.trim();
    if (!equationInput) return;

    try {
        const displayEq = equationInput;
        
        let eq = equationInput
            .replace(/[أآإاٱ]/g, 'ا')
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/X/gi, 'x')
            .replace(/Y/gi, 'y')
            .replace(/مقلوب/g, '1/')
            .replace(/جذر/g, 'sqrt')
            .replace(/√/g, 'sqrt')
            .replace(/س/g, 'x')
            .replace(/ص/g, 'y')
            .replace(/(\d)([xy])/gi, '$1*$2')
            .replace(/([xy])(\d)/gi, '$1*$2');

        functions.push({
            equation: displayEq,
            cleanEquation: eq,
            color: getRandomColor()
        });

        updatePlot();
        updateFunctionsList();
        document.getElementById('equation').value = "";

    } catch (error) {
        alert("خطأ في الدالة المدخلة!\n" + error.message);
    }
}

function updatePlot() {
    const traces = functions.map((func) => {
        const xValues = [];
        const yValues = [];

        const isReciprocal = /\/\s*\(?[^)]+x[^)]*\)?/.test(func.cleanEquation); // الشرط الجديد

        for (let x = -10; x <= 10; x += 0.1) {
            if (isReciprocal && Math.abs(x) < 1e-6) {
                xValues.push(null);
                yValues.push(null);
                continue;
            }

            try {
                const expr = func.cleanEquation.replace(/x/g, `(${x})`);
                const y = math.evaluate(expr);

                if (isFinite(y) && Math.abs(y) < 100) {
                    xValues.push(x);
                    yValues.push(y);
                } else {
                    xValues.push(null);
                    yValues.push(null);
                }
            } catch {
                xValues.push(null);
                yValues.push(null);
            }
        }

        return {
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'lines',
            line: {
                color: func.color,
                width: 2,
                shape: 'spline'
            },
            name: `y = ${func.equation}`
        };
    });

    Plotly.react('graph', traces, getLayout());
}
function updateFunctionsList() {
    const listElement = document.getElementById('functions-list');
    listElement.innerHTML = '';
    
    functions.forEach((func, index) => {
        const li = document.createElement('li');
        li.className = 'function-item';
        
        // عنصر اختيار اللون
        const colorPicker = document.createElement('div');
        colorPicker.className = 'color-picker-container';
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = func.color;
        colorInput.className = 'color-input';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'color-preview';
        colorPreview.style.backgroundColor = func.color;
        
        colorInput.addEventListener('input', (e) => {
            func.color = e.target.value;
            colorPreview.style.backgroundColor = e.target.value;
            updatePlot();
        });
        
        colorPicker.appendChild(colorInput);
        colorPicker.appendChild(colorPreview);
        
        // نص الدالة
        const funcText = document.createElement('span');
        funcText.className = 'function-text';
        funcText.textContent = `y = ${func.equation}`;
        funcText.style.fontFamily ="'Cal Sans', sans-serif";
        funcText.style.fontSize = "24px"
        
        // زر الحذف
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = "<i class='bx bx-x-circle'></i>";
        deleteBtn.onclick = () => removeFunction(index);
        
        // تجميع العناصر
        li.appendChild(colorPicker);
        li.appendChild(funcText);
        li.appendChild(deleteBtn);
        
        listElement.appendChild(li);
    });
}

// الأنماط المطلوبة
const styles = `
.color-picker-container {
    position: relative;
    display: inline-block;
    margin-left: 15px;
}

.color-input {
    opacity: 0;
    position: absolute;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.color-preview {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

.color-preview:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0,123,255,0.3);
}

.delete-btn {
    background: transparent;
    border: none;
    color: #ff4444;
    font-size: 1.9em;
    cursor: pointer;
    margin-left: 15px;
    transition: transform 0.3s ease;
}

.delete-btn:hover {
    transform: scale(1.2);
}

.function-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    transition: background 0.3s ease;
}

.function-item:hover {
    background: rgba(255,255,255,0.1);
}
`;

// إضافة الأنماط تلقائيًا
const styleTag = document.createElement('style');
styleTag.textContent = styles;
document.head.appendChild(styleTag);

function removeFunction(index) {
    if (index >= 0 && index < functions.length) {
        functions.splice(index, 1);
        updatePlot();
        updateFunctionsList();
    }
}

function getRandomColor() {
    const colors = [
        '#00ff88', '#ff5722', '#2196F3', 
        '#9C27B0', '#FFEB3B', '#4CAF50',
        '#E91E63', '#00BCD4', '#FF9800',
        '#003366','#0e2f44','#696969',
        '#cc0000','#420420','#0a75ad',
        '#342953','#88fa2f'

    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
      
function getLayout() {

    return {
        title:{    text: 'رسم بيان الدالة',
    font: {
      color: 'white', // غيّر اللون هن
      size: 24,
            family:'droid arabic kufi' 

}},
        showlegend: false,
        
        paper_bgcolor: '#2c2c2c',
        plot_bgcolor: '#2c2c2c',
        xaxis: {
            title: 'محور x',
            range: [-10, 10],
            color: '#fff',
            gridcolor: '#444'
        },
        yaxis: {
            title: 'محور y',
            range: [-10, 10],
            color: '#fff',
            gridcolor: '#444'
        },
        legend: { font: { color: '#fff' } },
        margin: { l: 60, r: 40, b: 60, t: 40, pad: 4 }
    };
}

window.addEventListener('load', () => {
    document.getElementById('equation').value = '';

    // استخدام نفس تخطيط الرسم
    const layout = getLayout();

    // لا يوجد أي بيانات عند البداية
    const traces = [];

    Plotly.react('graph', traces, layout);
});
