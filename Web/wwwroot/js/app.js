const API = "/api";
const state = { books: [], readers: [], categories: [], view: "dashboard" };
const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat("az-AZ", { style: "currency", currency: "AZN" }).format(Number(value || 0));
const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const categoryName = (id) => state.categories.find(c => c.id === id)?.name || "Kateqoriyasız";

async function request(path, options = {}) {
  const response = await fetch(API + path, { ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
  if (!response.ok) {
    let message = "Sorğu icra olunmadı.";
    try { const body = await response.json(); message = body.title || body.message || body.detail || (typeof body === "string" ? body : message); } catch { try { message = await response.text() || message; } catch {} }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
function toast(message, error = false) {
  const item = document.createElement("div"); item.className = "toast" + (error ? " error" : ""); item.textContent = message;
  $("#toastRegion").append(item); setTimeout(() => item.remove(), 3500);
}
function setConnection(ok) {
  const el = $(".connection"); el.classList.toggle("online", ok);
  $("#connectionText").textContent = ok ? "Server aktivdir" : "Server əlçatan deyil";
}
async function loadData() {
  try {
    const [books, readers, categories] = await Promise.all([request("/books"), request("/readers"), request("/categories")]);
    state.books = Array.isArray(books) ? books : [];
    state.readers = Array.isArray(readers) ? readers : [];
    state.categories = Array.isArray(categories) ? categories : [];
    setConnection(true); renderAll();
  } catch (error) {
    setConnection(false); toast("API bağlantısı alınmadı. Serveri başladın və yenidən yoxlayın.", true);
    $("#recentBooks").innerHTML = '<tr><td colspan="4" class="empty-cell">Serverdən məlumat alınmadı.</td></tr>';
    ["#booksTable","#readersTable"].forEach(s => $(s).innerHTML = '<tr><td colspan="5" class="empty-cell">API bağlantısı yoxdur.</td></tr>');
  }
}
function renderAll() {
  $("#totalBooks").textContent = state.books.length;
  $("#totalReaders").textContent = state.readers.length;
  $("#totalCategories").textContent = state.categories.length;
  $("#catalogValue").textContent = money(state.books.reduce((sum, b) => sum + Number(b.price || 0), 0));
  $("#bookNavCount").textContent = state.books.length;
  renderRecent(); renderBooks(); renderReaders(); renderCategories(); renderCategoryFilter();
}
function bookCell(book) {
  return `<div class="book-title"><span class="book-cover">▤</span><span>${safe(book.title)}</span></div>`;
}
function renderRecent() {
  const books = [...state.books].slice(-5).reverse();
  $("#recentBooks").innerHTML = books.length ? books.map(b => `<tr><td>${bookCell(b)}</td><td>${safe(b.author)}</td><td><span class="tag">${safe(categoryName(b.categoryId))}</span></td><td class="price">${money(b.price)}</td></tr>`).join("") : '<tr><td colspan="4" class="empty-cell">Hələ kitab əlavə edilməyib.</td></tr>';
  const cats = state.categories.slice(0, 5);
  $("#categoryOverview").innerHTML = cats.length ? cats.map((c,i) => `<div class="category-row"><span class="category-symbol">${["▤","▧","◈","▦","◇"][i%5]}</span><div class="category-meta"><strong>${safe(c.name)}</strong><small>Kitab kateqoriyası</small></div><span class="category-total">${state.books.filter(b=>b.categoryId===c.id).length} kitab</span></div>`).join("") : '<div class="empty-state">Kateqoriya əlavə edilməyib.</div>';
}
function renderBooks() {
  const term = ($("#bookSearch")?.value || "").toLocaleLowerCase("az");
  const filter = $("#categoryFilter")?.value || "";
  const books = state.books.filter(b => `${b.title} ${b.author}`.toLocaleLowerCase("az").includes(term) && (!filter || b.categoryId === filter));
  $("#booksTable").innerHTML = books.length ? books.map(b => `<tr><td>${bookCell(b)}</td><td>${safe(b.author)}</td><td><span class="tag">${safe(categoryName(b.categoryId))}</span></td><td class="price">${money(b.price)}</td><td><div class="row-actions"><button class="small-action delete" data-delete-book="${safe(b.id)}">Sil</button></div></td></tr>`).join("") : '<tr><td colspan="5" class="empty-cell">Axtarışa uyğun kitab tapılmadı.</td></tr>';
  $("#booksFooter").textContent = `Cəmi ${books.length} kitab göstərilir`;
}
function renderReaders() {
  const term = ($("#readerSearch")?.value || "").toLocaleLowerCase("az");
  const readers = state.readers.filter(r => `${r.fullName} ${r.email}`.toLocaleLowerCase("az").includes(term));
  $("#readersTable").innerHTML = readers.length ? readers.map(r => `<tr><td>${safe(r.fullName)}</td><td>${safe(r.email)}</td><td><span class="tag">${safe(String(r.id || "").slice(0,8) || "—")}</span></td><td><div class="row-actions"><button class="small-action delete" data-delete-reader="${safe(r.id)}">Sil</button></div></td></tr>`).join("") : '<tr><td colspan="4" class="empty-cell">Oxucu tapılmadı.</td></tr>';
}
function renderCategories() {
  $("#categoriesGrid").innerHTML = state.categories.length ? state.categories.map((c,i) => `<article class="category-card"><div class="category-symbol">${["▤","▧","◈","▦","◇"][i%5]}</div><h3>${safe(c.name)}</h3><p>${state.books.filter(b=>b.categoryId===c.id).length} kitab bu kateqoriyadadır</p></article>`).join("") : '<div class="panel empty-state">Hələ kateqoriya yaradılmayıb.</div>';
}
function renderCategoryFilter() {
  const current = $("#categoryFilter").value;
  $("#categoryFilter").innerHTML = '<option value="">Bütün kateqoriyalar</option>' + state.categories.map(c => `<option value="${safe(c.id)}">${safe(c.name)}</option>`).join("");
  $("#categoryFilter").value = current;
}
function navigate(view) {
  state.view = view;
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === view + "View"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.view === view));
  $("#breadcrumbTitle").textContent = ({dashboard:"İdarə paneli",books:"Kitablar",readers:"Oxucular",categories:"Kateqoriyalar"})[view];
  $("#sidebar").classList.remove("open");
}
function openModal(title, fields) {
  $("#modalTitle").textContent = title;
  $("#modalFields").innerHTML = fields.map(f => `<div class="field"><label for="field-${f.name}">${f.label}</label>${f.type === "select" ? `<select id="field-${f.name}" name="${f.name}" ${f.required ? "required" : ""}>${f.options}</select>` : `<input id="field-${f.name}" name="${f.name}" type="${f.type || "text"}" placeholder="${f.placeholder || ""}" ${f.required ? "required" : ""} ${f.step ? `step="${f.step}"` : ""} ${f.min !== undefined ? `min="${f.min}"` : ""}>`}</div>`).join("");
  $("#modalBackdrop").classList.add("open"); $("#modalBackdrop").setAttribute("aria-hidden","false");
  setTimeout(() => $("#modalFields input, #modalFields select")?.focus(), 50);
}
function closeModal() { $("#modalBackdrop").classList.remove("open"); $("#modalBackdrop").setAttribute("aria-hidden","true"); $("#entityForm").dataset.type = ""; }
function categoryOptions() { return state.categories.map(c => `<option value="${safe(c.id)}">${safe(c.name)}</option>`).join(""); }
function startAddBook() {
  if (!state.categories.length) { toast("Əvvəlcə ən azı bir kateqoriya yaradın.", true); navigate("categories"); return; }
  $("#entityForm").dataset.type = "book";
  openModal("Yeni kitab əlavə et", [
    {name:"title",label:"Kitabın adı",placeholder:"Məsələn: Ağ qala",required:true},
    {name:"author",label:"Müəllif",placeholder:"Müəllifin adı",required:true},
    {name:"price",label:"Qiymət (AZN)",type:"number",step:"0.01",min:"0",placeholder:"0.00",required:true},
    {name:"categoryId",label:"Kateqoriya",type:"select",required:true,options:categoryOptions()}
  ]);
}
function startAddReader() {
  $("#entityForm").dataset.type = "reader";
  openModal("Yeni oxucu qeydiyyatı",[
    {name:"fullName",label:"Ad və soyad",placeholder:"Oxucunun tam adı",required:true},
    {name:"email",label:"E-poçt",type:"email",placeholder:"name@example.com",required:true}
  ]);
}
function startAddCategory() {
  $("#entityForm").dataset.type = "category";
  openModal("Yeni kateqoriya",[{name:"name",label:"Kateqoriyanın adı",placeholder:"Məsələn: Bədii ədəbiyyat",required:true}]);
}
$("#entityForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const type = event.currentTarget.dataset.type; const data = Object.fromEntries(new FormData(event.currentTarget));
  const save = $("#saveModal"); save.disabled = true; save.textContent = "Yadda saxlanılır...";
  try {
    if (type === "book") { data.price = Number(data.price); await request("/books",{method:"POST",body:JSON.stringify(data)}); }
    if (type === "reader") await request("/readers",{method:"POST",body:JSON.stringify(data)});
    if (type === "category") await request("/categories",{method:"POST",body:JSON.stringify(data)});
    closeModal(); toast("Məlumat uğurla əlavə edildi."); await loadData();
  } catch (error) { toast(error.message || "Əməliyyat uğursuz oldu.",true); }
  finally { save.disabled = false; save.textContent = "Yadda saxla"; }
});
document.addEventListener("click", async (event) => {
  const nav = event.target.closest("[data-view]"); if (nav) navigate(nav.dataset.view);
  const go = event.target.closest("[data-go]"); if (go) navigate(go.dataset.go);
  const delBook = event.target.closest("[data-delete-book]"); const delReader = event.target.closest("[data-delete-reader]");
  if (delBook && confirm("Bu kitabı silmək istədiyinizə əminsiniz?")) { try { await request("/books/"+encodeURIComponent(delBook.dataset.deleteBook),{method:"DELETE"}); toast("Kitab silindi."); await loadData(); } catch(e){toast(e.message,true);} }
  if (delReader && confirm("Bu oxucunu silmək istədiyinizə əminsiniz?")) { try { await request("/readers/"+encodeURIComponent(delReader.dataset.deleteReader),{method:"DELETE"}); toast("Oxucu silindi."); await loadData(); } catch(e){toast(e.message,true);} }
});
$("#addBookBtn").addEventListener("click",startAddBook); $("#quickAddBook").addEventListener("click",startAddBook);
$("#addReaderBtn").addEventListener("click",startAddReader); $("#addCategoryBtn").addEventListener("click",startAddCategory);
$("#closeModal").addEventListener("click",closeModal); $("#cancelModal").addEventListener("click",closeModal);
$("#modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")closeModal();});
$("#bookSearch").addEventListener("input",renderBooks); $("#categoryFilter").addEventListener("change",renderBooks); $("#readerSearch").addEventListener("input",renderReaders);
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
loadData();
