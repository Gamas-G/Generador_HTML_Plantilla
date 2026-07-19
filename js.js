var contadorSecciones = 0;
var editores = []; // guardamos instancias

window.onload = function () {
  document.getElementById("css_general").value =
  localStorage.getItem("css_general") || "";
  
  document.getElementById("css_efectos").value =
  localStorage.getItem("css_efectos") || "";

  preview();
};

// Agregador de texto
function agregarTexto() {
  var contenedor = document.getElementById("contenedor");
  agregarTextoEnContenedor(contenedor);
}
    
  // Agregador de Banner
function agregarBanner(contenedorPadre = null) {
  var contenedor = contenedorPadre || document.getElementById("contenedor");
  var cssGeneral = localStorage.getItem("css_general") || "";
  var cssEfectos = localStorage.getItem("css_efectos") || "";
  var clases = obtenerClasesDesdeCSS(cssGeneral);
  var efectos = obtenerClasesDesdeCSS(cssEfectos);
  
  if (clases.length === 0) clases = ["usr-default"]; // opcional
  if (efectos.length === 0) efectos = ["usr-default"]; // opcional
    var opciones = clases.map(c => `<option value="${c}">${c}</option>`).join("");
    var opcionesEfectos = efectos.map(c => `<option value="${c}">${c}</option>`).join("");
    var html = `
                <div class="section banner">
                  <div class="section-header" onclick="toggleSeccion(this)" style="background:#d63384; color:white; padding:8px;">
                    ▶ Banner
                  </div>

                <div class="section-body">
                <label>Estilos:</label>
                <div class="css-lista css-lista-estilos">
                  ${generarCheckboxes(clases, "chk-css")}
                </div>
                <br/>

                <label>Efectos:</label>
                <div class="css-lista css-lista-efectos">
                  ${generarCheckboxes(efectos, "chk-efectos")}
                </div>
                <br/>
                <input type="text" class="titulo-banner form-control"
                  placeholder="Título del banner"
                  onkeyup="preview(); actualizarTituloBanner(this)" />
                <br/>
                <div class="contenedor-hijos"></div>
                <br/>
                <button type="button" onclick="agregarTextoHijo(this)">+ Texto</button>
                <button type="button" onclick="agregarBannerHijo(this)">+ Banner</button>
                <button type="button" onclick="eliminarSeccion(this)">Eliminar Banner</button>
                </div>
                </div>
              `;
    contenedor.insertAdjacentHTML('beforeend', html);
}

function agregarTextoHijo(btn) {
  var contenedor = btn
                    .closest(".section-body")
                    .querySelector(".contenedor-hijos");
  agregarTextoEnContenedor(contenedor);
}

function agregarBannerHijo(btn) {
  var contenedor = btn
                    .closest(".section-body")
                    .querySelector(".contenedor-hijos");
  agregarBanner(contenedor); //recursividad
}
    
function actualizarCheckboxesCSS() {
  var cssGeneral = document.getElementById("css_general")?.value || "";
  var cssEfectos = document.getElementById("css_efectos")?.value || "";
  var clases  = obtenerClasesDesdeCSS(cssGeneral);
  var efectos = obtenerClasesDesdeCSS(cssEfectos);

  // actualizar estilos
  document.querySelectorAll(".css-lista-estilos").forEach(container => {
    container.innerHTML = generarCheckboxes(clases, "chk-css");
  });

    //actualizar efectos
  document.querySelectorAll(".css-lista-efectos").forEach(container => {
    container.innerHTML = generarCheckboxes(efectos, "chk-efectos");
  });
}


function actualizarTituloBanner(input) {
  var seccion = input.closest(".section");
  var header  = seccion.querySelector(".section-header");
  var body    = seccion.querySelector(".section-body");
  var titulo  = input.value?.substring(0, 15) || "Banner";
  var isOpen  = body.style.display !== "none";
  header.innerHTML = (isOpen ? "▼ " : "▶ ") + titulo;
}
    
function agregarTextoEnContenedor(contenedor) {
  var index = contadorSecciones++;
  var cssGeneral = localStorage.getItem("css_general") || "";
  var cssEfectos = localStorage.getItem("css_efectos") || "";

  var clases  = obtenerClasesDesdeCSS(cssGeneral);
  var efectos = obtenerClasesDesdeCSS(cssEfectos);

  if (clases.length === 0) clases = ["usr-default"];
  if (efectos.length === 0) efectos = ["usr-default"];

  var html = `
              <div class="section">
                <div class="section-header" onclick="toggleSeccion(this)">
                  ▶ Texto</div>
                <div class="section-body">
                  <label>Estilos:</label>
                <div class="css-lista css-lista-estilos">
                  ${generarCheckboxes(clases, "chk-css")}
                </div>
                <br/>
                <label>Efectos:</label>
                <div class="css-lista css-lista-efectos">
                  ${generarCheckboxes(efectos, "chk-efectos")}
                </div
                <br/>
                <div id="editor_${index}" class="editor-quill"></div>
                <button onclick="eliminarSeccion(this)">Eliminar</button>
                </div>
                </div>
            `;
  contenedor.insertAdjacentHTML('beforeend', html);
  var editorDiv = document.getElementById("editor_" + index);
  var quill = new Quill(editorDiv, {
    theme: 'snow'
  });
  editorDiv.__quill = quill;
  quill.on('text-change', preview);

  preview();
}

function insertarTexto(contenedor) {
  var index = contadorSecciones++;
  var html = `
              <div class="section">
                <div class="section-header" onclick="toggleSeccion(this)">
                  ▶ Texto
                </div>
              <div class="section-body">
                <select class="tipo-texto" onchange="preview()">
                  <option value="p">Párrafo</option>
                  <option value="h2">H2</option>
                </select>
                <br/><br/>
                <div id="editor_${index}" class="editor-quill" style="height:100px;"></div>
                <br/>
                <button onclick="eliminarSeccion(this)">Eliminar</button>

              </div>
              </div>
            `;
      
  contenedor.insertAdjacentHTML('beforeend', html);
  var editorDiv = document.getElementById("editor_" + index);
  var quill = new Quill(editorDiv, { theme: 'snow' });
  editorDiv.__quill = quill;
  quill.on('text-change', preview);
}

// Generales
function preview() {
  var root = document.getElementById("contenedor");
  var cssGeneral = document.getElementById("css_general")?.value || "";
  var cssEfectos = document.getElementById("css_efectos")?.value || "";
  var cssGlobal = cssGeneral + "\n" + cssEfectos;

  let script = `
                <script>
                  document.addEventListener("click", function(e) {
                  var btn = e.target.closest(".collapsible");
                  if (!btn) return;
                  var content = btn.nextElementSibling;
                  if (content.classList.contains("open")) {
                    content.classList.remove("open");
                    btn.querySelector(".icon").innerHTML = "abrir";
                  } else {
                    content.classList.add("open");
                    btn.querySelector(".icon").innerHTML = "cerrar";
                  }
                  });
                <\/script>
              `;

  let html = `
              <html>
              <head>
              <style>
                ${cssGlobal}
              </style>
              </head>
              <body>
            `;
  Array.from(root.children).forEach(sec => {
  html += renderSeccion(sec);
  });
      
  html += script;
  html += "</body></html>";

  var iframe = document.getElementById("previewFrame");
  var doc = iframe.contentDocument;

  doc.open();
  doc.write(html);
  doc.close();
}

function toggleSeccion(header) {
  var body = header.nextElementSibling;
  var seccion = header.closest(".section");
  var input   = seccion.querySelector(".titulo-banner");
  var titulo  = input ? input.value : "Texto";
  if (body.style.display === "none") {
    body.style.display = "block";
    header.innerHTML = "▼ " + titulo;
  } 
  else {
    body.style.display = "none";
    header.innerHTML = "▶ " + titulo;
  }
}
    
function renderSeccion(sec){
  let html = "";
  var chkCSS = sec.querySelectorAll(":scope > .section-body > .css-lista-estilos .chk-css:checked");
  var chkEfectos = sec.querySelectorAll(":scope > .section-body > .css-lista-efectos .chk-efectos:checked");
  let clasesCSS = Array.from(chkCSS).map(c => c.value);
  let clasesEfectos = Array.from(chkEfectos).map(c => c.value);

  let clasesFinal = [...clasesCSS, ...clasesEfectos].join(" ");
  var editorDiv = sec.querySelector(":scope > .section-body > .editor-quill");
      
  if (editorDiv && editorDiv.__quill && !sec.classList.contains("banner")) {
    var tipo = sec.querySelector(".tipo-texto")?.value || "p";
    var contenido = editorDiv.__quill.root.innerHTML;
        
    if (contenido && contenido !== "<p><br></p>") {
      html += `<div class="texto-base ${clasesFinal}">
                ${contenido}
              </div>`;
    }
  }

  if (sec.classList.contains("banner")) {
    var titulo = sec.querySelector(".titulo-banner")?.value || "";
    html += `
            <div class="bannerPadre ${clasesFinal}">
              <button class="collapsible main ${clasesFinal}">
                ${titulo}
                <span class="icon">[abrir]</span>
              </button>
            <div class="content">
          `;
        
    var hijos = sec.querySelector(".contenedor-hijos")?.children || [];
    Array.from(hijos).forEach(hijo => {
      html += renderSeccion(hijo);
    });

    html += `</div></div>`;
  }
  return html;
}
    
function obtenerClasesDesdeCSS(css) {
  let regex = /\/\*\s*selectable\s*\*\/\s*\.([a-zA-Z0-9_-]+)/g;
  let clases = [];
  let match;
      
  while ((match = regex.exec(css)) !== null) {
    clases.push(match[1]);
  }
  return clases;

}
    
function eliminarSeccion(btn){
  if (!confirm("¿Seguro que deseas eliminar esta sección?")) return;
  var seccion = btn.closest(".section");
  seccion.remove();
  preview();
}
    
function obtenerHTML() {
  var iframe = document.getElementById("previewFrame");
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  //obtenemos todo el HTML
  var html = doc.documentElement.outerHTML;
  html = html.replace(/\s{2,}/g, " ");
  html = html.replace(/\n/g, "");
  html = html.replace(/>\s+</g, "><");

  // o copiarlo automáticamente
  navigator.clipboard.writeText(html)
  .then(() => {
    alert("HTML copiado al portapapeles");
  })
  .catch(err => {
  console.error("Error copiando:", err);
  });
}

function cargarDesdeHTML(htmlString) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(htmlString, "text/html");
  var root = doc.body;
  var contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  Array.from(root.children).forEach(nodo => {
    reconstruirNodo(nodo, contenedor);
  });

  preview();
}

function reconstruirNodo(nodo, contenedorPadre) {
  let tipo = nodo.dataset.type;
  if (!tipo) {
    if (nodo.classList.contains("bannerPadre")) tipo = "banner";
    else if (nodo.classList.contains("texto-base")) tipo = "texto";
  }

  // obtener listas desde CSS guardado
  var listaCSS = obtenerClasesDesdeCSS(localStorage.getItem("css_general") || "");
  var listaEfectos = obtenerClasesDesdeCSS(localStorage.getItem("css_efectos") || "");

  //clases del nodo HTML cargado
  var clasesNodo = nodo.className.split(" ");
  var clasesCSS = [];
  var clasesEfectos = [];

  clasesNodo.forEach(c => {
    if (listaCSS.includes(c)) clasesCSS.push(c);
    if (listaEfectos.includes(c)) clasesEfectos.push(c);
  });

  // ===========================
  // BANNER
  // ===========================
  if (tipo === "banner") {
    agregarBanner(contenedorPadre);
    let nuevoBanner = contenedorPadre.lastElementChild;
    //título
    var collapsible = nodo.querySelector(".collapsible");
    var titulo = collapsible
                  ? collapsible.childNodes[0].textContent.trim()
                  : "";

    var input = nuevoBanner.querySelector(".titulo-banner");
    input.value = titulo;
    actualizarTituloBanner(input);

    //aplicar CHECKBOXES
    var chkCSS = nuevoBanner.querySelectorAll(".chk-css");
    var chkEfectos = nuevoBanner.querySelectorAll(".chk-efectos");

    chkCSS.forEach(chk => {
      chk.checked = clasesCSS.includes(chk.value);
    });

    chkEfectos.forEach(chk => {
      chk.checked = clasesEfectos.includes(chk.value);
    });

    //reconstruir hijos
    var contentDiv = nodo.querySelector(".content");
    var hijos = contentDiv ? contentDiv.children : [];

    var contenedorHijos = nuevoBanner.querySelector(".contenedor-hijos");

    Array.from(hijos).forEach(child => {
      reconstruirNodo(child, contenedorHijos);
    });
  }

  // ===========================
  // TEXTO
  // ===========================
  else if (tipo === "texto") {
    agregarTextoEnContenedor(contenedorPadre);
    let nuevoTexto = contenedorPadre.lastElementChild;
    var editorDiv = nuevoTexto.querySelector(".editor-quill");
    var quill = editorDiv.__quill;
    // contenido HTML
    quill.root.innerHTML = nodo.innerHTML;
    preview();
    // aplicar CHECKBOXES
    var chkCSS = nuevoTexto.querySelectorAll(".chk-css");
    var chkEfectos = nuevoTexto.querySelectorAll(".chk-efectos");

    chkCSS.forEach(chk => {
      chk.checked = clasesCSS.includes(chk.value);
    });

    chkEfectos.forEach(chk => {
      chk.checked = clasesEfectos.includes(chk.value);
    });
  }
}

function descargarHTML() {
  var iframe = document.getElementById("previewFrame");
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  var html = doc.documentElement.outerHTML;
  
  html = html.replace(/\s{2,}/g, " ");
  html = html.replace(/\n/g, "");
  html = html.replace(/>\s+</g, "><");
  html = html.trim();

  // crear archivo
  var blob = new Blob([html], { type: "text/html" });
  // crear enlace temporal
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);

  // nombre del archivo
  a.download = "plantilla.html";

  // simular click
  a.click();

  // limpiar memoria
  URL.revokeObjectURL(a.href);
}

function cargarArchivo(event) {
  var archivo = event.target.files[0];
  if (!archivo) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var htmlString = e.target.result;
        cargarDesdeHTML(htmlString);
    };
    reader.readAsText(archivo);
}

function limpiarEditor() {
  if (!confirm("¿Seguro que deseas limpiar todo el contenido?")) return;
  
  var contenedor = document.getElementById("contenedor");
  
  if (!contenedor) return;
  
  contenedor.innerHTML = "";
  
  var iframe = document.getElementById("previewFrame");
  var doc = iframe.contentDocument;
  var fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }

  doc.open();
  doc.write("");
  doc.close();
}

function abrirModalCSS() {
  mostrarTab('css_general');
  document.getElementById("css_general").value =
  localStorage.getItem("css_general") || "";
  
  document.getElementById("css_efectos").value =
  localStorage.getItem("css_efectos") || "";
  
  document.getElementById("modalCSS").style.display = "block";
}

function cerrarModalCSS() {
  document.getElementById("modalCSS").style.display = "none";
}

function guardarCSS() {
  var cssGeneral = document.getElementById("css_general").value;
  var cssEfectos = document.getElementById("css_efectos").value;

  localStorage.setItem("css_general", cssGeneral);
  localStorage.setItem("css_efectos", cssEfectos);

  actualizarCheckboxesCSS();
  preview();

  alert("CSS guardado");

  cerrarModalCSS();
}

function actualizarSelectsCSS() {
  var css = document.getElementById("css_general")?.value || "";
  var clases = obtenerClasesDesdeCSS(css);

  document.querySelectorAll(".clases-css").forEach(select => {

  let opciones = clases.map(c =>
    `<option value="${c}">${c}</option>`
  ).join("");

  select.innerHTML = opciones;
  });
}

function mostrarTab(tab) {
  // ocultar todos los tabs
  document.getElementById("tab_css_general").style.display = "none";
  document.getElementById("tab_css_efectos").style.display = "none";

  // mostrar el seleccionado
  document.getElementById("tab_" + tab).style.display = "block";

  document.getElementById("btn_css_general").classList.remove("active");
  document.getElementById("btn_css_efectos").classList.remove("active");

  document.getElementById("btn_" + tab).classList.add("active");
}

function obtenerClasesEfectos() {
  return obtenerClasesDesdeCSS(localStorage.getItem("css_efectos") || "");
}

function generarCheckboxes(lista, clase) {
  return lista.map(c => `
                        <label class="chk-item">
                          <input type="checkbox" class="${clase}" value="${c}" onchange="preview()">
                            ${c}
                          </label>
                        `).join("");
}
