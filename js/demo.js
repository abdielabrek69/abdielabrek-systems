const STORAGE_KEY = "abrek_demo_tickets_v1";
const form = document.querySelector("#ticketForm");
const list = document.querySelector("#ticketList");
const total = document.querySelector("#totalCount");
const open = document.querySelector("#openCount");
const progress = document.querySelector("#progressCount");
const closed = document.querySelector("#closedCount");

const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
const nextId = (items) => {
  const max = items.reduce((m, t) => Math.max(m, Number(t.id.replace("INC-", "")) || 0), 1000);
  return `INC-${max + 1}`;
};

function render() {
  const items = load();
  total.textContent = items.length;
  open.textContent = items.filter(t => t.status === "Abierto").length;
  progress.textContent = items.filter(t => t.status === "En proceso").length;
  closed.textContent = items.filter(t => t.status === "Cerrado").length;

  if (!items.length) {
    list.innerHTML = '<div class="empty">No hay tickets todavía. Crea una incidencia o carga los ejemplos.</div>';
    return;
  }
  list.innerHTML = items.map(t => `
    <article class="ticket">
      <div class="ticket-top">
        <span class="ticket-id">${escapeHtml(t.id)}</span>
        <select class="status-select" data-id="${escapeHtml(t.id)}" aria-label="Estado del ticket">
          ${["Abierto","En proceso","Cerrado"].map(s => `<option ${t.status===s?"selected":""}>${s}</option>`).join("")}
        </select>
      </div>
      <h3>${escapeHtml(t.subject)}</h3>
      <p>${escapeHtml(t.description)}</p>
      <div class="ticket-meta">
        <span class="tag">${escapeHtml(t.requester)}</span>
        <span class="tag">${escapeHtml(t.area)}</span>
        <span class="tag priority-${t.priority.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}">${escapeHtml(t.priority)}</span>
      </div>
    </article>`).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[ch]));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const items = load();
  const ticket = {
    id: nextId(items),
    requester: document.querySelector("#requester").value.trim(),
    area: document.querySelector("#area").value,
    priority: document.querySelector("#priority").value,
    subject: document.querySelector("#subject").value.trim(),
    description: document.querySelector("#description").value.trim(),
    status: "Abierto"
  };
  items.unshift(ticket);
  save(items);
  form.reset();
  document.querySelector("#priority").value = "Media";
  render();
});

list.addEventListener("change", (e) => {
  if (!e.target.matches(".status-select")) return;
  const items = load();
  const ticket = items.find(t => t.id === e.target.dataset.id);
  if (ticket) { ticket.status = e.target.value; save(items); render(); }
});

document.querySelector("#seedBtn").addEventListener("click", () => {
  const samples = [
    {requester:"Ana López",area:"Impresoras",priority:"Alta",subject:"Impresora no responde",description:"El equipo aparece instalado pero no imprime.",status:"Abierto"},
    {requester:"Carlos Méndez",area:"Soporte TI",priority:"Media",subject:"Equipo lento",description:"Solicita revisión de rendimiento y software.",status:"En proceso"},
    {requester:"María Ruiz",area:"Redes",priority:"Baja",subject:"Validar conexión",description:"Revisión de conectividad en un equipo.",status:"Cerrado"}
  ];
  let items = load();
  samples.reverse().forEach(s => items.unshift({...s,id:nextId(items)}));
  save(items);
  render();
});

document.querySelector("#clearBtn").addEventListener("click", () => {
  if (confirm("¿Limpiar todos los tickets guardados en este navegador?")) {
    localStorage.removeItem(STORAGE_KEY);
    render();
  }
});
render();
