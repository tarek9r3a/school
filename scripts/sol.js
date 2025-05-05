function simplifyFraction(numerator, denominator) {
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    const divisor = gcd(numerator, denominator);
    return {
        numerator: numerator / divisor,
        denominator: denominator / divisor
    };
}

function formatFraction(numerator, denominator) {
    if (denominator === 1) return `${numerator}`;
    if (numerator === 0) return '0';
    const sign = numerator * denominator < 0 ? '-' : '';
    const { numerator: n, denominator: d } = simplifyFraction(Math.abs(numerator), Math.abs(denominator));
    return sign + `\\frac{${n}}{${d}}`;
}

function plotFunction(func, xMin, xMax, roots, title) {
    const xValues = [], yValues = [], step = (xMax - xMin) / 200;
    for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x);
        yValues.push(func(x));
    }

    const data = [{
        x: xValues, y: yValues,
        mode: 'lines', type: 'scatter',
        name: title,
        line: { color: '#007bff', width: 2 }
    }];

    if (roots.length) {
        data.push({
            x: roots, y: roots.map(r => func(r)),
            mode: 'markers', type: 'scatter',
            name: 'حلول المعادلة',
            marker: { color: '#00ff88', size: 10, symbol: 'x' }
        });
    }

    Plotly.newPlot('graph', data, {
        title:{    text:'رسم حلول المعادلة',
    font: {
      color: 'white', // غيّر اللون هن
      size: 24,
            family:'droid arabic kufi' 

}},
        showlegend: false,
        xaxis: { title: 'x', range: [xMin, xMax] },
        yaxis: { title: 'y' },
        plot_bgcolor: '#2c2c2c',
        paper_bgcolor: '#2c2c2c',
        font: { color: 'white' }
    });
}

// ————— المعادلة من الدرجة الأولى ————— //
function solveFirstDegree() {
    const a = parseFloat(document.getElementById("a1").value);
    const b = parseFloat(document.getElementById("b1").value);
    const op = document.getElementById("eq-op1").value;
    const c = parseFloat(document.getElementById("c1").value) || 0;
    const result = document.getElementById("solution1");

    result.innerHTML = '';
    document.getElementById("result1").style.display = "block";

    if (isNaN(a) || isNaN(b)) {
        result.innerHTML = "<p style='color:var(--error-color)'>الرجاء إدخال قيم صحيحة</p>";
        return;
    }

    if (a === 0) {
        result.innerHTML = b === c
            ? "<p>عدد لا نهائي من الحلول</p>"
            : "<p>لا يوجد حل</p>";
    } else {
        const rhs = c - b;
        const frac = formatFraction(rhs, a);
        result.innerHTML = `<p>الحل: \\( x ${op} ${frac} \\)</p>`;
        plotFunction(x => a * x + b, -10, 10, [rhs / a], `الدالة: ${a}x + ${b}`);
    }

    if (window.MathJax) MathJax.typesetPromise();
}

// ————— المعادلة من الدرجة الثانية ————— //
function solveSecondDegree() {
    const a = parseFloat(document.getElementById("a2").value);
    const b = parseFloat(document.getElementById("b2").value);
    const c = parseFloat(document.getElementById("c2").value);
    const d = parseFloat(document.getElementById("d2").value) || 0;
    const op = document.getElementById("eq-op2").value;
    const result = document.getElementById("solution2");

    result.innerHTML = '';
    document.getElementById("result2").style.display = "block";

    if ([a, b, c].some(isNaN)) {
        result.innerHTML = "<p style='color:var(--error-color)'>الرجاء إدخال قيم صحيحة</p>";
        return;
    }

    const adjC = c - d;
    const delta = b * b - 4 * a * adjC;
    let solutions = [];

    if (a === 0) {
        if (b === 0) {
            result.innerHTML = adjC === 0
                ? "<p>عدد لا نهائي من الحلول</p>"
                : "<p>لا يوجد حل</p>";
        } else {
            const x = -adjC / b;
            result.innerHTML = `
                <p>الحل: \\( x ${op} ${formatFraction(-adjC, b)} \\)</p>
                <p>القيمة العشرية: \\( ${x.toFixed(4)} \\)</p>
            `;
            solutions = [x];
        }
    } else if (delta > 0) {
        const sqrtD = Math.sqrt(delta);
        const x1 = (-b + sqrtD) / (2 * a);
        const x2 = (-b - sqrtD) / (2 * a);
        result.innerHTML = `
            <p>حلّان حقيقيّان:</p>
            <p>\\( x_1 = ${x1.toFixed(4)} \\), \\( x_2 = ${x2.toFixed(4)} \\)</p>
        `;
        solutions = [x1, x2];
    } else if (delta === 0) {
        const x = -b / (2 * a);
        result.innerHTML = `
            <p>حل واحد مكرر:</p>
            <p>\\( x = ${x.toFixed(4)} \\)</p>
        `;
        solutions = [x];
    } else {
        result.innerHTML = "<p>لا يوجد حل حقيقي للمعادلة</p>";
    }

    if (window.MathJax) MathJax.typesetPromise();
    plotFunction(x => a * x * x + b * x + adjC, -10, 10, solutions, `الدالة: ${a}x² + ${b}x + ${adjC}`);
}

// ————— المعادلة من الدرجة الثالثة ————— //
function solveThirdDegree() {
    const a = parseFloat(document.getElementById("a3").value);
    const b = parseFloat(document.getElementById("b3").value);
    const c = parseFloat(document.getElementById("c3").value);
    const d = parseFloat(document.getElementById("d3").value);
    const e = parseFloat(document.getElementById("e3").value) || 0;
    const result = document.getElementById("solution3");

    result.innerHTML = '';
    document.getElementById("result3").style.display = "block";

    if ([a, b, c, d].some(isNaN)) {
        result.innerHTML = "<p style='color:var(--error-color)'>الرجاء إدخال قيم صحيحة</p>";
        return;
    }

    if (a === 0) {
        result.innerHTML = "<p>هذه ليست معادلة من الدرجة الثالثة</p>";
        return;
    }

    const A = b / a, B = c / a, C = (d - e) / a;
    const p = B - A * A / 3;
    const q = 2 * A * A * A / 27 - A * B / 3 + C;
    const D = q * q / 4 + p * p * p / 27;

    let x1, x2, x3, resultText = "", solutions = [];

    if (D > 0) {
        const u = Math.cbrt(-q / 2 + Math.sqrt(D));
        const v = Math.cbrt(-q / 2 - Math.sqrt(D));
        x1 = u + v - A / 3;
        solutions = [x1];
        resultText = `
            <p>حل حقيقي واحد:</p>
            <p>\\( ${x1.toFixed(2)} \\)</p>
        `;
    } else if (D === 0) {
        const u = Math.cbrt(-q / 2);
        x1 = 2 * u - A / 3;
        x2 = -u - A / 3;
        solutions = [x1, x2];
        resultText = `
            <p>حلول حقيقية متكررة:</p>
            <p> \\( ${x1.toFixed(2)} , ${x2.toFixed(2)} \\)</p>
        `;
    } else {
        const r = Math.sqrt(-p / 3);
        const theta = Math.acos(-q / (2 * r * r * r));
        x1 = 2 * r * Math.cos(theta / 3) - A / 3;
        x2 = 2 * r * Math.cos((theta + 2 * Math.PI) / 3) - A / 3;
        x3 = 2 * r * Math.cos((theta + 4 * Math.PI) / 3) - A / 3;
        solutions = [x1, x2, x3];
        resultText = `
            <p>ثلاث حلول حقيقية:</p>
            <p>\\( ${x1.toFixed(2)}, ${x2.toFixed(2)}, ${x3.toFixed(2)} \\)</p>
        `;
    }

    result.innerHTML = resultText;
    if (window.MathJax) MathJax.typesetPromise();
    plotFunction(
        x => a * x ** 3 + b * x ** 2 + c * x + (d - e),
        -10, 10,
        solutions,
        `الدالة: ${a}x³ + ${b}x² + ${c}x + ${d - e}`
    );
}

// ————— التبويبات ————— //
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-tab') + '-tab').classList.add('active');
    });
});
