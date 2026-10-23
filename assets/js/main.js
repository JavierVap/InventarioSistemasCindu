// Variables globales
let listaInsumos = [];
let listaDepartamentos = [];
let listaUsuarios = [];

let chartEstadoInstance = null;
let chartDeptInstance = null;

// =========================================================================
// 1. FUNCIONES GLOBALES (Modales y Eliminaciones)
// =========================================================================
window.abrirModalEditar = function (id) {
    const insumo = listaInsumos.find(i => parseInt(i.id) === parseInt(id));
    if (!insumo) return;

    document.getElementById('editar-id').value = insumo.id;
    document.getElementById('editar-nombre').value = insumo.nombre;
    document.getElementById('editar-modelo').value = (insumo.modelo !== 'N/A' && insumo.modelo !== null) ? insumo.modelo : '';
    document.getElementById('editar-departamento').value = insumo.departamento_id;
    document.getElementById('editar-stock').value = insumo.stock;
    document.getElementById('editar-minimo').value = insumo.minimo;
    document.getElementById('editar-fecha').value = insumo.ultimo_cambio || '';

    const modalEl = document.getElementById('modalEditarInsumo');
    if (modalEl) new bootstrap.Modal(modalEl).show();
};

window.eliminarInsumo = function (id) {
    const insumo = listaInsumos.find(i => parseInt(i.id) === parseInt(id));
    if (!insumo) return;

    if (confirm(`¿Está seguro de que desea eliminar el insumo "${insumo.nombre}"?`)) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('api/inventario/eliminar.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    // Recargar lista actualizada
                    const dashboardView = document.getElementById('dashboard-view');
                    if (dashboardView) {
                        fetch('api/inventario/listar.php')
                            .then(r => r.json())
                            .then(r => {
                                if (r.success) {
                                    listaInsumos = r.data;
                                    document.dispatchEvent(new Event('actualizarTablasEvent'));
                                }
                            });
                    }
                } else {
                    alert(res.message);
                }
            });
    }
};

window.abrirModalEditarUsuario = function (id) {
    const u = listaUsuarios.find(user => parseInt(user.id) === parseInt(id));
    if (!u) return;

    document.getElementById('user-editar-id').value = u.id;
    document.getElementById('user-editar-cedula').value = u.cedula;
    document.getElementById('user-editar-nombre').value = u.nombre;
    document.getElementById('user-editar-password').value = '';
    document.getElementById('user-editar-departamento').value = u.departamento_id;
    document.getElementById('user-editar-rol').value = u.rol;

    const modalEl = document.getElementById('modalEditarUsuario');
    if (modalEl) new bootstrap.Modal(modalEl).show();
};

window.eliminarUsuario = function (id) {
    const u = listaUsuarios.find(user => parseInt(user.id) === parseInt(id));
    if (!u) return;

    if (confirm(`¿Está seguro de que desea eliminar al usuario "${u.nombre}" (${u.cedula})?`)) {
        const formData = new FormData();
        formData.append('id', id);

        fetch('api/usuarios/eliminar.php', { method: 'POST', body: formData })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    fetch('api/usuarios/listar.php')
                        .then(r => r.json())
                        .then(r => {
                            if (r.success) {
                                listaUsuarios = r.data;
                                document.dispatchEvent(new Event('actualizarUsuariosEvent'));
                            }
                        });
                } else {
                    alert(res.message);
                }
            });
    }
};

// =========================================================================
// 2. LÓGICA PRINCIPAL AL CARGAR EL DOM
// =========================================================================
document.addEventListener('DOMContentLoaded', function () {
    const dashboardView = document.getElementById('dashboard-view');
    const selectRetiro = document.getElementById('select-insumo-retiro');
    const tablaBody = document.getElementById('tabla-inventario');

    // Eventos personalizados para refrescar tablas dinámicamente
    document.addEventListener('actualizarTablasEvent', function() {
        renderizarInterfaz();
        actualizarGraficosYMetricas();
    });

    document.addEventListener('actualizarUsuariosEvent', function() {
        renderizarTablaUsuariosMain();
    });

    // FORMULARIO DE LOGIN
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const alertBox = document.getElementById('login-alert');

            if (alertBox) alertBox.classList.add('d-none');

            fetch('api/auth/login.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    } else {
                        if (alertBox) {
                            alertBox.textContent = data.message;
                            alertBox.classList.remove('d-none');
                        }
                    }
                })
                .catch(() => {
                    if (alertBox) {
                        alertBox.textContent = "Error de comunicación con el servidor.";
                        alertBox.classList.remove('d-none');
                    }
                });
        });
    }

    if (dashboardView) {
        inicializarNavegacionSidebar();
        cargarDepartamentos();
        cargarInventario();
        cargarUsuarios();
    }

    function inicializarNavegacionSidebar() {
        const menuLinks = document.querySelectorAll('.nav-module');
        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                menuLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const targetSection = this.getAttribute('data-section');
                document.querySelectorAll('.module-section').forEach(sec => sec.classList.add('d-none'));
                
                const targetEl = document.getElementById(targetSection);
                if (targetEl) targetEl.classList.remove('d-none');

                const sectionTitles = {
                    'sec-dashboard': 'Dashboard Analítico',
                    'sec-insumos': 'Maestro de Insumos',
                    'sec-usuarios': 'Maestro de Usuarios'
                };
                const titleEl = document.getElementById('section-title');
                if (titleEl) titleEl.textContent = sectionTitles[targetSection] || 'Panel de Control';
            });
        });
    }

    function cargarDepartamentos() {
        fetch('api/departamentos/listar.php')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    listaDepartamentos = res.data;
                    poblarSelectDepartamentos('nuevo-departamento');
                    poblarSelectDepartamentos('editar-departamento');
                    poblarSelectDepartamentos('user-nuevo-departamento');
                    poblarSelectDepartamentos('user-editar-departamento');
                }
            });
    }

    function poblarSelectDepartamentos(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '<option value="">Seleccione el área...</option>';
        listaDepartamentos.forEach(d => {
            select.innerHTML += `<option value="${d.id}">${d.nombre}</option>`;
        });
    }

    function cargarInventario() {
        fetch('api/inventario/listar.php')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    listaInsumos = res.data;
                    renderizarInterfaz();
                    actualizarGraficosYMetricas();
                }
            });
    }

    function renderizarInterfaz() {
        if (!tablaBody) return;

        if (selectRetiro) {
            selectRetiro.innerHTML = '<option value="">Seleccione insumo...</option>';
        }
        tablaBody.innerHTML = '';

        listaInsumos.forEach(item => {
            if (selectRetiro) {
                let txtDropdown = item.modelo !== 'N/A' && item.modelo !== ''
                    ? `[${item.departamento}] ${item.nombre} - ${item.modelo}`
                    : `[${item.departamento}] ${item.nombre}`;

                let option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${txtDropdown} (Disp: ${item.stock})`;
                selectRetiro.appendChild(option);
            }

            let estadoBadge = parseInt(item.stock) <= parseInt(item.minimo)
                ? '<span class="badge bg-danger bg-opacity-10 text-danger border border-danger status-badge">Bajo Stock</span>'
                : '<span class="badge bg-success bg-opacity-10 text-success border border-success status-badge">Óptimo</span>';

            let txtModelo = item.modelo !== 'N/A' && item.modelo !== ''
                ? `<span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary" style="font-size:0.75rem;"><i class="bi bi-printer"></i> ${item.modelo}</span>`
                : `<span class="text-muted" style="font-size:0.85rem;">N/A</span>`;

            let fila = `
                <tr>
                    <td class="fw-semibold text-dark">${item.nombre}</td>
                    <td>${txtModelo}</td>
                    <td class="text-muted">${item.departamento || 'N/A'}</td>
                    <td class="text-center fw-bold ${parseInt(item.stock) <= parseInt(item.minimo) ? 'text-danger' : 'text-dark'}">${item.stock}</td>
                    <td class="text-center text-muted">${item.minimo}</td>
                    <td class="fw-medium text-primary">${item.ultimo_cambio || 'Sin registro'}</td>
                    <td>${estadoBadge}</td>
                    <td class="text-end">
                        <button class="btn btn-action bg-white border" onclick="window.abrirModalEditar(${item.id})" title="Editar Insumo">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-action bg-white border text-danger ms-1" onclick="window.eliminarInsumo(${item.id})" title="Eliminar Insumo">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });
    }

    function actualizarGraficosYMetricas() {
        let total = listaInsumos.length;
        let alerta = listaInsumos.filter(i => parseInt(i.stock) <= parseInt(i.minimo)).length;
        let optimo = total - alerta;

        const elTotal = document.getElementById('metric-total');
        const elAlerta = document.getElementById('metric-alerta');
        const elOptimo = document.getElementById('metric-optimo');

        if (elTotal) elTotal.textContent = total;
        if (elAlerta) elAlerta.textContent = alerta;
        if (elOptimo) elOptimo.textContent = optimo;

        const canvasEstado = document.getElementById('chartEstado');
        const canvasDept = document.getElementById('chartDepartamentos');

        if (canvasEstado) {
            if (chartEstadoInstance) chartEstadoInstance.destroy();
            chartEstadoInstance = new Chart(canvasEstado.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Óptimo', 'Bajo Stock'],
                    datasets: [{
                        data: [optimo, alerta],
                        backgroundColor: ['#10b981', '#ef4444']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        if (canvasDept) {
            let deptMap = {};
            listaInsumos.forEach(i => {
                let dept = i.departamento || 'Sin Asignar';
                deptMap[dept] = (deptMap[dept] || 0) + parseInt(i.stock);
            });

            if (chartDeptInstance) chartDeptInstance.destroy();
            chartDeptInstance = new Chart(canvasDept.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: Object.keys(deptMap),
                    datasets: [{
                        label: 'Unidades en Stock',
                        data: Object.values(deptMap),
                        backgroundColor: '#0ea5e9'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    // =========================================================================
    // REPORTES CORPORATIVOS (EXCEL Y PDF CON MEMBRETE)

    // 1. REPORTE EN EXCEL CON COLORES, BORDES Y FORMATO
    const btnExcel = document.getElementById('btn-export-excel');
    if (btnExcel) {
        btnExcel.addEventListener('click', function () {
            const userName = document.getElementById('user-name')?.textContent || 'Usuario';
            const userDept = document.getElementById('user-dept')?.textContent || 'General';
            const fechaHoy = new Date().toLocaleString('es-VE');

            // Definición de Estilos reutilizables para Excel
            const styleTitulo = {
                font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "0EA5E9" } }, // Azul Corporativo
                alignment: { horizontal: "center", vertical: "center" }
            };

            const styleSubtitulo = {
                font: { bold: true, sz: 10, color: { rgb: "334155" } },
                alignment: { horizontal: "center" }
            };

            const styleHeaderTabla = {
                font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "0284C7" } }, // Azul oscuro
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "CBD5E1" } },
                    bottom: { style: "medium", color: { rgb: "0284C7" } }
                }
            };

            const borderCelda = {
                top: { style: "thin", color: { rgb: "E2E8F0" } },
                bottom: { style: "thin", color: { rgb: "E2E8F0" } },
                left: { style: "thin", color: { rgb: "E2E8F0" } },
                right: { style: "thin", color: { rgb: "E2E8F0" } }
            };

            const styleCeldaGeneral = {
                font: { sz: 10, color: { rgb: "1E293B" } },
                border: borderCelda
            };

            const styleCeldaCentro = {
                font: { sz: 10, color: { rgb: "1E293B" } },
                alignment: { horizontal: "center" },
                border: borderCelda
            };

            const styleBajoStock = {
                font: { bold: true, sz: 10, color: { rgb: "991B1B" } },
                fill: { fgColor: { rgb: "FEE2E2" } }, // Rojo claro
                alignment: { horizontal: "center" },
                border: borderCelda
            };

            const styleOptimo = {
                font: { bold: true, sz: 10, color: { rgb: "166534" } },
                fill: { fgColor: { rgb: "DCFCE7" } }, // Verde claro
                alignment: { horizontal: "center" },
                border: borderCelda
            };

            // Construcción de la matriz de celdas con objetos de valor (v) y estilo (s)
            let excelRows = [
                [{ v: "CINDU DE VENEZUELA, C.A.", s: styleTitulo }],
                [{ v: "SISTEMA DE CONTROL DE INSUMOS Y EQUIPOS DE OFICINA", s: styleSubtitulo }],
                [{ v: `REPORTE GENERAL DE INVENTARIO - Emitido: ${fechaHoy}`, s: styleSubtitulo }],
                [{ v: `Generado por: ${userName} (${userDept})`, s: { font: { italic: true, sz: 9, color: { rgb: "64748B" } }, alignment: { horizontal: "center" } } }],
                [], // Fila vacía de separación
                [
                    { v: "#", s: styleHeaderTabla },
                    { v: "Insumo / Artículo", s: styleHeaderTabla },
                    { v: "Modelo / Equipo", s: styleHeaderTabla },
                    { v: "Departamento", s: styleHeaderTabla },
                    { v: "Stock Actual", s: styleHeaderTabla },
                    { v: "Alerta Mínima", s: styleHeaderTabla },
                    { v: "Último Cambio", s: styleHeaderTabla },
                    { v: "Estado", s: styleHeaderTabla }
                ]
            ];

            // Filas de datos con zebra striping y estado estilizado
            listaInsumos.forEach((i, idx) => {
                const esBajo = parseInt(i.stock) <= parseInt(i.minimo);
                const styleEstado = esBajo ? styleBajoStock : styleOptimo;

                excelRows.push([
                    { v: idx + 1, s: styleCeldaCentro },
                    { v: i.nombre, s: styleCeldaGeneral },
                    { v: (i.modelo !== 'N/A' && i.modelo !== null && i.modelo !== '') ? i.modelo : 'N/A', s: styleCeldaGeneral },
                    { v: i.departamento || 'Sin Asignar', s: styleCeldaGeneral },
                    { v: parseInt(i.stock), s: styleCeldaCentro },
                    { v: parseInt(i.minimo), s: styleCeldaCentro },
                    { v: i.ultimo_cambio || 'Sin registro', s: styleCeldaCentro },
                    { v: esBajo ? 'Bajo Stock' : 'Óptimo', s: styleEstado }
                ]);
            });

            // Generar Hoja de Cálculo
            const worksheet = XLSX.utils.aoa_to_sheet(excelRows);

            // Combinación de celdas para el encabezado
            worksheet['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Título
                { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Subtítulo 1
                { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // Subtítulo 2
                { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } }  // Emisor
            ];

            // Anchos de columnas
            worksheet['!cols'] = [
                { wch: 6 },   // #
                { wch: 32 },  // Insumo
                { wch: 25 },  // Modelo
                { wch: 22 },  // Departamento
                { wch: 14 },  // Stock
                { wch: 14 },  // Minimo
                { wch: 16 },  // Fecha
                { wch: 16 }   // Estado
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario Cindu");

            const fechaArchivo = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `Reporte_Inventario_Cindu_${fechaArchivo}.xlsx`);
        });
    }

    // 2. REPORTE EN PDF CON LOGO Y MEMBRETE CORPORATIVO
    const btnPdf = document.getElementById('btn-export-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');

            const userName = document.getElementById('user-name')?.textContent || 'Usuario';
            const userDept = document.getElementById('user-dept')?.textContent || 'General';
            const fechaHoy = new Date().toLocaleDateString('es-VE', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const totalInsumos = listaInsumos.length;
            const bajoStock = listaInsumos.filter(i => parseInt(i.stock) <= parseInt(i.minimo)).length;
            const stockOptimo = totalInsumos - bajoStock;

            // Función para renderizar el contenido completo del PDF
            const generarContenidoPDF = (logoDataUrl = null) => {
                // Barra superior azul corporativa
                doc.setFillColor(14, 165, 233);
                doc.rect(0, 0, 210, 10, 'F');

                let inicioX = 14;

                // Si se cuenta con el logo en imagen, se inserta en el margen superior izquierdo
                if (logoDataUrl) {
                    try {
                        doc.addImage(logoDataUrl, 'PNG', 14, 15, 25, 25);
                        inicioX = 44; // Desplazar texto a la derecha del logo
                    } catch (e) {
                        console.warn("No se pudo cargar el logo, renderizando texto alternativo.", e);
                    }
                }

                // Membrete Institucional
                doc.setFontSize(15);
                doc.setTextColor(15, 23, 42);
                doc.setFont("helvetica", "bold");
                doc.text("CINDU DE VENEZUELA, C.A.", inicioX, 22);

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(100, 116, 139);
                doc.text("Sistema de Control Interno de Insumos y Equipos", inicioX, 27);
                doc.text("RIF: J-00000000-0 | Puerto Cabello, Venezuela", inicioX, 32);

                // Metadatos alineados a la derecha
                doc.setFontSize(8);
                doc.text(`Emisión: ${fechaHoy}`, 196, 22, { align: 'right' });
                doc.text(`Generado por: ${userName}`, 196, 27, { align: 'right' });
                doc.text(`Departamento: ${userDept}`, 196, 32, { align: 'right' });

                // Línea divisora
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.5);
                doc.line(14, 42, 196, 42);

                // Caja de Métricas Resumen
                doc.setFillColor(248, 250, 252);
                doc.roundedRect(14, 46, 182, 12, 2, 2, 'F');

                doc.setFontSize(9);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(15, 23, 42);
                doc.text(`Total Registros: ${totalInsumos}`, 22, 53);

                doc.setTextColor(220, 38, 38);
                doc.text(`Alertas Bajo Stock: ${bajoStock}`, 85, 53);

                doc.setTextColor(22, 163, 74);
                doc.text(`Stock Óptimo: ${stockOptimo}`, 145, 53);

                // Filas de datos
                let bodyData = listaInsumos.map((i, index) => [
                    index + 1,
                    i.nombre,
                    (i.modelo !== 'N/A' && i.modelo !== null && i.modelo !== '') ? i.modelo : 'N/A',
                    i.departamento || 'Sin Asignar',
                    i.stock,
                    i.minimo,
                    parseInt(i.stock) <= parseInt(i.minimo) ? 'Bajo Stock' : 'Óptimo'
                ]);

                // Tabla con AutoTable
                doc.autoTable({
                    startY: 62,
                    head: [['#', 'Insumo / Artículo', 'Modelo / Equipo', 'Departamento', 'Stock', 'Mín.', 'Estado']],
                    body: bodyData,
                    theme: 'grid',
                    headStyles: { 
                        fillColor: [14, 165, 233], 
                        textColor: [255, 255, 255], 
                        fontStyle: 'bold',
                        halign: 'center'
                    },
                    columnStyles: {
                        0: { halign: 'center', cellWidth: 10 },
                        4: { halign: 'center', fontStyle: 'bold' },
                        5: { halign: 'center' },
                        6: { halign: 'center' }
                    },
                    styles: { fontSize: 8, cellPadding: 2.5 },
                    didParseCell: function (data) {
                        if (data.section === 'body' && data.column.index === 6) {
                            if (data.cell.raw === 'Bajo Stock') {
                                data.cell.styles.textColor = [220, 38, 38];
                                data.cell.styles.fontStyle = 'bold';
                            } else {
                                data.cell.styles.textColor = [22, 163, 74];
                                data.cell.styles.fontStyle = 'bold';
                            }
                        }
                    },
                    didDrawPage: function (data) {
                        let totalPages = doc.internal.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.setFont("helvetica", "normal");
                        doc.setTextColor(148, 163, 184);
                        doc.text("Cindu de Venezuela, C.A. - Documento de Control de Inventario", 14, 287);
                        doc.text(`Página ${data.pageNumber} de ${totalPages}`, 196, 287, { align: 'right' });
                    }
                });

                const fechaArchivo = new Date().toISOString().slice(0, 10);
                doc.save(`Reporte_Inventario_Cindu_${fechaArchivo}.pdf`);
            };

            // Intentar cargar el logo desde carpeta assets antes de renderizar
            const imgLogo = new Image();
            imgLogo.src = 'assets/img/logo.png'; // Ruta de la imagen del logo en tu proyecto

            imgLogo.onload = function () {
                // Convertir logo cargado a Canvas/DataURL
                const canvas = document.createElement('canvas');
                canvas.width = imgLogo.width;
                canvas.height = imgLogo.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imgLogo, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                generarContenidoPDF(dataURL);
            };

            imgLogo.onerror = function () {
                // Si la imagen no existe en assets/img/logo.png, genera el PDF institucional estructurado
                generarContenidoPDF(null);
            };
        });
    }

    // USUARIOS
    function cargarUsuarios() {
        fetch('api/usuarios/listar.php')
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    listaUsuarios = res.data;
                    renderizarTablaUsuariosMain();
                }
            });
    }

    function renderizarTablaUsuariosMain() {
        const tablaMain = document.getElementById('tabla-usuarios-main');
        if (!tablaMain) return;

        tablaMain.innerHTML = '';
        listaUsuarios.forEach(u => {
            let badgeRol = u.rol === 'admin'
                ? '<span class="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1">Admin</span>'
                : '<span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1">Usuario</span>';

            let fila = `
                <tr>
                    <td class="fw-semibold text-dark">${u.cedula}</td>
                    <td>${u.nombre}</td>
                    <td class="text-muted">${u.departamento || 'Sin asignar'}</td>
                    <td>${badgeRol}</td>
                    <td class="text-end">
                        <button class="btn btn-action bg-white border" onclick="window.abrirModalEditarUsuario(${u.id})" title="Editar / Clave">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-action bg-white border text-danger ms-1" onclick="window.eliminarUsuario(${u.id})" title="Eliminar Usuario">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tablaMain.innerHTML += fila;
        });
    }

    // FORMULARIOS CRUD
    const formNuevoUser = document.getElementById('form-nuevo-usuario');
    if (formNuevoUser) {
        formNuevoUser.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('cedula', document.getElementById('user-nuevo-cedula').value);
            formData.append('nombre', document.getElementById('user-nuevo-nombre').value);
            formData.append('password', document.getElementById('user-nuevo-password').value);
            formData.append('departamento_id', document.getElementById('user-nuevo-departamento').value);
            formData.append('rol', document.getElementById('user-nuevo-rol').value);

            fetch('api/usuarios/crear.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        cargarUsuarios();
                        bootstrap.Modal.getInstance(document.getElementById('modalNuevoUsuario')).hide();
                        formNuevoUser.reset();
                    } else { alert(res.message); }
                });
        });
    }

    const formEditarUser = document.getElementById('form-editar-usuario');
    if (formEditarUser) {
        formEditarUser.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('id', document.getElementById('user-editar-id').value);
            formData.append('cedula', document.getElementById('user-editar-cedula').value);
            formData.append('nombre', document.getElementById('user-editar-nombre').value);
            formData.append('password', document.getElementById('user-editar-password').value);
            formData.append('departamento_id', document.getElementById('user-editar-departamento').value);
            formData.append('rol', document.getElementById('user-editar-rol').value);

            fetch('api/usuarios/editar.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        cargarUsuarios();
                        bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
                    } else { alert(res.message); }
                });
        });
    }

    const formNuevoInsumo = document.getElementById('form-nuevo-insumo');
    if (formNuevoInsumo) {
        formNuevoInsumo.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('nombre', document.getElementById('nuevo-nombre').value);
            formData.append('modelo', document.getElementById('nuevo-modelo').value);
            formData.append('departamento_id', document.getElementById('nuevo-departamento').value);
            formData.append('stock', document.getElementById('nuevo-stock').value);
            formData.append('minimo', document.getElementById('nuevo-minimo').value);

            fetch('api/inventario/crear.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        cargarInventario();
                        bootstrap.Modal.getInstance(document.getElementById('modalNuevoInsumo')).hide();
                        formNuevoInsumo.reset();
                    } else { alert(res.message); }
                });
        });
    }

    const formEditarInsumo = document.getElementById('form-editar-insumo');
    if (formEditarInsumo) {
        formEditarInsumo.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('id', document.getElementById('editar-id').value);
            formData.append('nombre', document.getElementById('editar-nombre').value);
            formData.append('modelo', document.getElementById('editar-modelo').value);
            formData.append('departamento_id', document.getElementById('editar-departamento').value);
            formData.append('stock', document.getElementById('editar-stock').value);
            formData.append('minimo', document.getElementById('editar-minimo').value);
            formData.append('ultimo_cambio', document.getElementById('editar-fecha').value);

            fetch('api/inventario/editar.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        cargarInventario();
                        bootstrap.Modal.getInstance(document.getElementById('modalEditarInsumo')).hide();
                    } else { alert(res.message); }
                });
        });
    }

    const formRetiro = document.getElementById('form-retiro');
    if (formRetiro) {
        formRetiro.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('insumo_id', selectRetiro.value);
            formData.append('cantidad', document.getElementById('cantidad-retiro').value);
            const toast = document.getElementById('toast-retiro');

            fetch('api/inventario/retirar.php', { method: 'POST', body: formData })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        cargarInventario();
                        toast.textContent = res.message;
                        toast.className = "alert alert-success mt-3 p-2 text-center";
                        toast.classList.remove('d-none');
                        formRetiro.reset();
                    } else {
                        toast.textContent = res.message;
                        toast.className = "alert alert-danger mt-3 p-2 text-center";
                        toast.classList.remove('d-none');
                    }
                    setTimeout(() => { toast.classList.add('d-none'); }, 3000);
                });
        });
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function () {
            fetch('api/auth/logout.php')
                .then(res => res.json())
                .then(() => { location.reload(); });
        });
    }
    
});