
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
        
        const leftDiv = document.createElement('div');
        leftDiv.style.display = 'flex';
        leftDiv.style.alignItems = 'center';

        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = func.color;
        
        const functionText = document.createElement('span');
        functionText.className = 'function-text';
        functionText.style.fontFamily = "'Cal Sans', sans-serif"
                functionText.style.fontSize = "20px"
                                functionText.style.textAlign = "center"

        functionText.textContent = `y  =  ${func.equation}`;
        
        leftDiv.appendChild(colorBox);
        leftDiv.appendChild(functionText);

const deleteBtn = document.createElement('button');
deleteBtn.className = 'delete-btn';
deleteBtn.innerHTML = "<i class='bx bx-x-circle'></i>";
deleteBtn.onclick = () => removeFunction(index);
        
        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        listElement.appendChild(li);
    });
}

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
