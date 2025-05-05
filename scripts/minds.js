fetch("../json/scientists.json")
  .then(response => response.json())
  .then(data => {
    const container = document.querySelector(".container");
    const searchInput = document.querySelector("#search-input");

    // دالة لتصفية العلماء بناءً على النص المدخل
    const filterScientists = (searchTerm) => {
      // تصفية العلماء بناءً على اسم أو مجال العالم
      const filteredData = data.filter(scientist => {
        return scientist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               scientist.field.toLowerCase().includes(searchTerm.toLowerCase());
      });

      // إعادة عرض العلماء بناءً على التصفية
      displayScientists(filteredData);
    };

    // دالة لعرض العلماء
    const displayScientists = (scientists) => {
      container.innerHTML = ''; // مسح المحتوى الحالي
      scientists.forEach(scientist => {
        const details = document.createElement("details");
        details.className = "listone";

        const summary = document.createElement("summary");
        summary.textContent = `${scientist.field} - ${scientist.name}`;

        const content = document.createElement("div");
        content.className = "details-content";

        const image = document.createElement("img");
        image.src = scientist.image;
        image.alt = scientist.name;

        const para = document.createElement("p");
        para.textContent = scientist.description;

        content.appendChild(image);
        content.appendChild(para);
        details.appendChild(summary);
        details.appendChild(content);
        container.appendChild(details);
      });
    };

    // عرض العلماء جميعًا عند التحميل
    displayScientists(data);

    // حدث البحث عندما يكتب المستخدم
    searchInput.addEventListener("input", (event) => {
      filterScientists(event.target.value);
    });
  })
  .catch(error => {
    console.error("فشل تحميل ملف JSON:", error);
  });
