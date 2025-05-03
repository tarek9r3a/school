const display = document.getElementById("display");

let currentMode = "deg"; // الوضع الافتراضي

function append(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    let expression = display.value;

    // استبدال الرموز لعرض أوضح
    let shownExpression = expression.replace(/\*/g, '×').replace(/\//g, '÷');

    // إذا الوضع "درجات"، نضيف 'deg' داخل دوال مثلثية
    if (currentMode === "deg") {
      expression = expression.replace(/(sin|cos|tan)\(([^)]+)\)/g, '$1($2 deg)');
    }

    const result = math.evaluate(expression);
    display.value = result;
    addToHistory(shownExpression, result);
  } catch (error) {
    display.value = "خطأ";
  }
}

// دعم لوحة المفاتيح
document.addEventListener("keydown", function(event) {
  const key = event.key;
  const allowedKeys = "0123456789+-*/().^%";

  if (allowedKeys.includes(key)) {
    append(key);
  } else if (key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  }
});

// تغيير الوضع (deg/rad)
function setMode(mode) {
  currentMode = mode;

  // تغيير مظهر الأزرار
  document.getElementById("degBtn").classList.toggle("active", mode === "deg");
  document.getElementById("radBtn").classList.toggle("active", mode === "rad");
}

// تفعيل الوضع الافتراضي عند بداية التشغيل
setMode("deg");

// إضافة إلى سجل العمليات
function addToHistory(expression, result) {
  const historyList = document.getElementById("historyList");
  const listItem = document.createElement("li");
  listItem.textContent = `${expression} = ${result}`;
  historyList.prepend(listItem);
}
