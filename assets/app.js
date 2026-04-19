// ==============================
// INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  loadEmails();
});

// ==============================
// LOAD DATA (STATIC JSON)
// ==============================
async function loadEmails() {
  try {
    const res = await fetch("data/emails.json");
    const data = await res.json();

    renderTable(data);
  } catch (err) {
    console.error("Gagal load data:", err);
    renderError();
  }
}

// ==============================
// RENDER TABLE
// ==============================
function renderTable(data) {
  const tbody = document.getElementById("emailTable");
  tbody.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    renderEmpty(tbody);
    return;
  }

  data.forEach((item, index) => {
    const id = index;
    const layanan = item.layanan || [];
    const layananCount = layanan.length;

    // =========================
    // MAIN ROW
    // =========================
    const mainRow = document.createElement("tr");
    mainRow.className = "main-row";
    mainRow.onclick = () => toggleRow(mainRow, id);

    mainRow.innerHTML = `
      <td class="toggle-col">+</td>
      <td class="email-col">${item.email || "-"}</td>
      <td class="type-col">${item.tipe || "-"}</td>
      <td class="note-col">${item.catatan || "-"}</td>
      <td class="layanan-col">${layananCount}</td>
      <td class="status-col ${getStatusClass(item.status)}">
        ${item.status || "-"}
      </td>
    `;

    tbody.appendChild(mainRow);

    // =========================
    // DETAIL ROWS (LAYANAN)
    // =========================
    layanan.forEach((l) => {
      const detailRow = document.createElement("tr");
      detailRow.className = `detail-row detail-${id}`;
      detailRow.style.display = "none";

      detailRow.innerHTML = `
        <td></td>
        <td class="indent">${l.platform || "-"}</td>
        <td>${l.kode || "-"}</td>
        <td colspan="3">${l.catatan || ""}</td>
      `;

      tbody.appendChild(detailRow);
    });
  });
}

// ==============================
// TOGGLE ROW
// ==============================
function toggleRow(row, id) {
  const details = document.querySelectorAll(".detail-" + id);
  const toggleCell = row.querySelector(".toggle-col");

  const isOpen = toggleCell.innerText === "-";

  details.forEach((d) => {
    d.style.display = isOpen ? "none" : "table-row";
  });

  toggleCell.innerText = isOpen ? "+" : "-";
  row.classList.toggle("open", !isOpen);
}

// ==============================
// STATUS STYLE
// ==============================
function getStatusClass(status) {
  if (!status) return "";

  const s = status.toLowerCase();

  if (s === "valid") return "status-valid";
  if (s === "belum") return "status-belum";

  return "";
}

// ==============================
// EMPTY STATE
// ==============================
function renderEmpty(tbody) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td colspan="6" style="text-align:center; padding:30px;">
      Tidak ada data
    </td>
  `;

  tbody.appendChild(row);
}

// ==============================
// ERROR STATE
// ==============================
function renderError() {
  const tbody = document.getElementById("emailTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center; color:red;">
        Gagal memuat data
      </td>
    </tr>
  `;
}
