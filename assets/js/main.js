// Variables globales
let listaInsumos = [];
let listaDepartamentos = [];
let listaUsuarios = [];
let listaEquipos = [];
let paginaInventario = 1;
let paginasInventario = 1;
let totalInventario = 0;

let chartEstadoInstance = null;
let chartDeptInstance = null;

const RIF_EMPRESA = 'J-00026092-3';

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caracter]);
}

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
                    document.dispatchEvent(new Event('actualizarTablasEvent'));
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

window.abrirModalEditarEquipo = function (id) {
    const equipo = listaEquipos.find(item => parseInt(item.id) === parseInt(id));
    if (!equipo) return;

    document.getElementById('equipo-editar-id').value = equipo.id;
    document.getElementById('equipo-editar-tipo').value = equipo.tipo;
    document.getElementById('equipo-editar-marca').value = equipo.marca;
    document.getElementById('equipo-editar-serial').value = equipo.serial;
    document.getElementById('equipo-editar-departamento').value = equipo.departamento_id;
    document.getElementById('equipo-editar-fecha').value = equipo.ultima_modificacion || '';
    document.getElementById('equipo-editar-notas').value = equipo.notas || '';
    document.getElementById('equipo-editar-responsable').value = equipo.usuario || '';

    const modalEl = document.getElementById('modalEditarEquipo');
    if (modalEl) new bootstrap.Modal(modalEl).show();
};

window.eliminarEquipo = function (id) {
    const equipo = listaEquipos.find(item => parseInt(item.id) === parseInt(id));
    if (!equipo || !confirm(`¿Desea eliminar el equipo con serial "${equipo.serial}"?`)) return;

    const formData = new FormData();
    formData.append('id', id);

    fetch('api/equipos/eliminar.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(res => {
            if (!res.success) throw new Error(res.message || 'No se pudo eliminar el equipo.');
            return cargarEquipos();
        })
        .catch(error => alert(error.message || 'Error al eliminar el equipo.'));
};

// =========================================================================
// 2. LÓGICA PRINCIPAL AL CARGAR EL DOM
// =========================================================================
document.addEventListener('DOMContentLoaded', function () {
    const dashboardView = document.getElementById('dashboard-view');
    const selectRetiro = document.getElementById('select-insumo-retiro');
    const tablaBody = document.getElementById('tabla-inventario');
    const paginacion = document.getElementById('inventario-paginacion');
    const paginacionInfo = document.getElementById('inventario-paginacion-info');

    // Eventos personalizados para refrescar tablas dinámicamente
    document.addEventListener('actualizarTablasEvent', function() {
        cargarInventario(paginaInventario, true).catch(error => alert(error.message));
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

    if (dashboardView && dashboardView.dataset.authenticated === 'true') {
        inicializarNavegacionSidebar();
        cargarModulo('sec-dashboard').catch(error => mostrarErrorModulo('sec-dashboard', error));
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
                    'sec-usuarios': 'Maestro de Usuarios',
                    'sec-equipos': 'Inventario de Equipos'
                };
                const titleEl = document.getElementById('section-title');
                if (titleEl) titleEl.textContent = sectionTitles[targetSection] || 'Panel de Control';
                cargarModulo(targetSection).catch(error => mostrarErrorModulo(targetSection, error));
            });
        });
    }

    function cargarModulo(section) {
        const errorAnterior = document.getElementById('dashboard-load-error');
        if (errorAnterior) errorAnterior.remove();

        switch (section) {
            case 'sec-dashboard':
                return cargarResumenInventario();
            case 'sec-insumos':
                return cargarDepartamentos().then(() => cargarInventario(1, true));
            case 'sec-usuarios':
                return Promise.all([cargarDepartamentos(), cargarUsuarios()]);
            case 'sec-equipos':
                return Promise.all([cargarDepartamentos(), cargarUsuarios(), cargarEquipos()]);
            default:
                return Promise.resolve();
        }
    }

    function mostrarErrorModulo(section, error) {
        const destinos = {
            'sec-dashboard': document.getElementById('sec-dashboard'),
            'sec-insumos': tablaBody,
            'sec-usuarios': document.getElementById('tabla-usuarios-main'),
            'sec-equipos': document.getElementById('tabla-equipos')
        };
        const destino = destinos[section];
        if (destino && destino.tagName === 'TBODY') {
            const columnas = section === 'sec-equipos' ? 8 : section === 'sec-usuarios' ? 5 : 8;
            destino.innerHTML = `<tr><td colspan="${columnas}" class="text-center text-danger">${escaparHTML(error.message || 'No se pudieron cargar los datos.')}</td></tr>`;
        } else if (destino) {
            const anterior = document.getElementById('dashboard-load-error');
            if (anterior) anterior.remove();
            destino.insertAdjacentHTML('afterbegin', `<div id="dashboard-load-error" class="alert alert-danger" role="alert">${escaparHTML(error.message || 'No se pudieron cargar los datos.')}</div>`);
        }
    }

    function cargarDepartamentos() {
        return fetch('api/departamentos/listar.php')
            .then(res => {
                if (!res.ok) throw new Error('No se pudieron cargar los departamentos.');
                return res.json();
            })
            .then(res => {
                if (!res.success) throw new Error(res.message || 'No se pudieron cargar los departamentos.');
                listaDepartamentos = res.data;
                [
                    'nuevo-departamento',
                    'editar-departamento',
                    'user-nuevo-departamento',
                    'user-editar-departamento',
                    'equipo-nuevo-departamento',
                    'equipo-editar-departamento'
                ].forEach(poblarSelectDepartamentos);
            });
    }

    function poblarSelectDepartamentos(selectId) {
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '<option value="">Seleccione el área...</option>';
        listaDepartamentos.forEach(d => {
            const opcion = document.createElement('option');
            opcion.value = d.id;
            opcion.textContent = d.nombre;
            select.appendChild(opcion);
        });
    }

    function cargarEquipos() {
        return fetch('api/equipos/listar.php')
            .then(res => {
                if (!res.ok) throw new Error('No se pudieron cargar los equipos.');
                return res.json();
            })
            .then(res => {
                if (!res.success) throw new Error(res.message || 'No se pudieron cargar los equipos.');
                listaEquipos = res.data;
                renderizarTablaEquipos();
            })
            .catch(error => {
                const tabla = document.getElementById('tabla-equipos');
                if (tabla) tabla.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${escaparHTML(error.message)}</td></tr>`;
                throw error;
            });
    }

    function renderizarTablaEquipos() {
        const tabla = document.getElementById('tabla-equipos');
        if (!tabla) return;

        if (listaEquipos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="8" class="text-center text-muted py-4">No hay equipos registrados.</td></tr>';
            return;
        }

        tabla.innerHTML = listaEquipos.map(equipo => `
            <tr>
                <td>${escaparHTML(equipo.tipo)}</td>
                <td>${escaparHTML(equipo.marca)}</td>
                <td class="fw-semibold">${escaparHTML(equipo.serial)}</td>
                <td>${escaparHTML(equipo.departamento)}</td>
                <td>${escaparHTML(equipo.usuario || 'Sin asignar')}</td>
                <td>${escaparHTML(equipo.ultima_modificacion || 'No registrada')}</td>
                <td><span title="${escaparHTML(equipo.notas || '')}">${escaparHTML(equipo.notas || '—')}</span></td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-action bg-white border" onclick="window.abrirModalEditarEquipo(${Number(equipo.id)})" title="Editar equipo" aria-label="Editar equipo">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-action bg-white border text-danger ms-1" onclick="window.eliminarEquipo(${Number(equipo.id)})" title="Eliminar equipo" aria-label="Eliminar equipo">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function cargarInventario(pagina = 1, actualizarDatosAuxiliares = false) {
        return fetch(`api/inventario/listar.php?pagina=${pagina}&limite=25`)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo cargar el inventario.');
                return res.json();
            })
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message || 'No se pudo cargar el inventario.');
                }

                listaInsumos = res.data;
                paginaInventario = res.pagination.page;
                paginasInventario = res.pagination.totalPages;
                totalInventario = res.pagination.total;
                renderizarInterfaz();
                renderizarPaginacion();
                if (actualizarDatosAuxiliares) {
                    return Promise.all([cargarResumenInventario(), cargarOpcionesRetiro()]);
                }
            })
            .catch(error => {
                if (tablaBody) {
                    tablaBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">${escaparHTML(error.message || 'Error al cargar el inventario.')}</td></tr>`;
                }
                throw error;
            });
    }

    async function cargarInventarioCompleto() {
        const respuesta = await fetch('api/inventario/listar.php?completo=1');
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.success) {
            throw new Error(resultado.message || 'No se pudo cargar el inventario para el reporte.');
        }
        return resultado.data;
    }

    async function cargarLogoBase64() {
        const respuesta = await fetch('assets/img/logocindu.png');
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el logo de Cindu.');
        }

        const archivo = await respuesta.blob();
        return new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.onload = () => resolve(lector.result);
            lector.onerror = () => reject(new Error('No se pudo preparar el logo de Cindu.'));
            lector.readAsDataURL(archivo);
        });
    }

    function renderizarPaginacion() {
        if (!paginacion || !paginacionInfo) return;

        const inicio = totalInventario === 0 ? 0 : (paginaInventario - 1) * 25 + 1;
        const fin = Math.min(paginaInventario * 25, totalInventario);
        paginacionInfo.textContent = `Mostrando ${inicio}-${fin} de ${totalInventario} insumos`;

        paginacion.innerHTML = `
            <li class="page-item ${paginaInventario <= 1 ? 'disabled' : ''}">
                <button class="page-link" type="button" data-pagina="${paginaInventario - 1}" aria-label="Página anterior">Anterior</button>
            </li>
            <li class="page-item disabled">
                <span class="page-link">Página ${paginaInventario} de ${paginasInventario}</span>
            </li>
            <li class="page-item ${paginaInventario >= paginasInventario ? 'disabled' : ''}">
                <button class="page-link" type="button" data-pagina="${paginaInventario + 1}" aria-label="Página siguiente">Siguiente</button>
            </li>
        `;

        paginacion.querySelectorAll('button[data-pagina]').forEach(boton => {
            boton.addEventListener('click', () => {
                cargarInventario(Number(boton.dataset.pagina)).catch(error => alert(error.message));
            });
        });
    }

    function cargarResumenInventario() {
        return fetch('api/inventario/resumen.php')
            .then(res => {
                if (!res.ok) throw new Error('No se pudo cargar el resumen del inventario.');
                return res.json();
            })
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message || 'No se pudo cargar el resumen del inventario.');
                }
                actualizarGraficosYMetricas(res.data);
            });
    }

    function cargarOpcionesRetiro() {
        if (!selectRetiro) return;

        return fetch('api/inventario/opciones.php')
            .then(res => {
                if (!res.ok) throw new Error('No se pudieron cargar los insumos para retirar.');
                return res.json();
            })
            .then(res => {
                if (!res.success) {
                    throw new Error(res.message || 'No se pudieron cargar los insumos para retirar.');
                }
                selectRetiro.innerHTML = '<option value="">Seleccione insumo...</option>';
                res.data.forEach(item => {
                    const etiqueta = item.modelo !== 'N/A' && item.modelo !== ''
                        ? `[${item.departamento || 'N/A'}] ${item.nombre} - ${item.modelo}`
                        : `[${item.departamento || 'N/A'}] ${item.nombre}`;
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = `${etiqueta} (Disp: ${item.stock})`;
                    selectRetiro.appendChild(option);
                });
            });
    }

    function renderizarInterfaz() {
        if (!tablaBody) return;

        tablaBody.innerHTML = '';

        listaInsumos.forEach(item => {
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

    function actualizarGraficosYMetricas(resumen) {
        const total = Number(resumen.total);
        const alerta = Number(resumen.alerta);
        const optimo = Number(resumen.optimo);

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
            if (chartDeptInstance) chartDeptInstance.destroy();
            chartDeptInstance = new Chart(canvasDept.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: resumen.departamentos.map(item => item.departamento),
                    datasets: [{
                        label: 'Unidades en Stock',
                        data: resumen.departamentos.map(item => Number(item.stock)),
                        backgroundColor: '#0ea5e9'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    // =========================================================================
    // REPORTES CORPORATIVOS (EXCEL Y PDF CON MEMBRETE)

    // 1. REPORTE EN EXCEL CON LOGO Y FORMATO CORPORATIVO
    const btnExcel = document.getElementById('btn-export-excel');
    if (btnExcel) {
        btnExcel.addEventListener('click', async function () {
            let inventarioReporte;
            let logoBase64;
            try {
                inventarioReporte = await cargarInventarioCompleto();
                logoBase64 = await cargarLogoBase64();
            } catch (error) {
                alert(error.message);
                return;
            }

            if (!window.ExcelJS) {
                alert('No se pudo iniciar la librería para generar el reporte Excel.');
                return;
            }

            const userName = document.getElementById('user-name')?.textContent || 'Usuario';
            const userDept = document.getElementById('user-dept')?.textContent || 'General';
            const fechaHoy = new Date().toLocaleString('es-VE');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Inventario Cindu');
            worksheet.columns = [
                { width: 6 }, { width: 32 }, { width: 25 }, { width: 22 },
                { width: 14 }, { width: 14 }, { width: 16 }, { width: 16 }
            ];

            worksheet.mergeCells('C1:H1');
            worksheet.mergeCells('C2:H2');
            worksheet.mergeCells('C3:H3');
            worksheet.mergeCells('C4:H4');
            worksheet.mergeCells('C5:H5');
            worksheet.getCell('C1').value = `CINDU DE VENEZUELA, C.A. - RIF: ${RIF_EMPRESA}`;
            worksheet.getCell('C2').value = 'SISTEMA DE CONTROL DE INSUMOS Y EQUIPOS DE OFICINA';
            worksheet.getCell('C3').value = `REPORTE GENERAL DE INVENTARIO - Emitido: ${fechaHoy}`;
            worksheet.getCell('C4').value = `Generado por: ${userName} (${userDept})`;
            worksheet.getRow(1).height = 24;
            worksheet.getRow(2).height = 22;
            worksheet.getRow(3).height = 22;
            worksheet.getRow(4).height = 22;
            worksheet.getRow(5).height = 10;

            worksheet.getCell('C1').font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
            worksheet.getCell('C1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0EA5E9' } };
            ['C1', 'C2', 'C3', 'C4'].forEach(celda => {
                worksheet.getCell(celda).alignment = { horizontal: 'center', vertical: 'middle' };
            });
            ['C2', 'C3'].forEach(celda => {
                worksheet.getCell(celda).font = { bold: true, size: 10, color: { argb: 'FF334155' } };
            });
            worksheet.getCell('C4').font = { italic: true, size: 9, color: { argb: 'FF64748B' } };

            const logoId = workbook.addImage({ base64: logoBase64, extension: 'png' });
            worksheet.addImage(logoId, {
                tl: { col: 0.15, row: 0.2 },
                ext: { width: 150, height: 85 }
            });

            const filaEncabezado = worksheet.addRow([
                '#', 'Insumo / Artículo', 'Modelo / Equipo', 'Departamento',
                'Stock Actual', 'Alerta Mínima', 'Último Cambio', 'Estado'
            ]);
            filaEncabezado.height = 24;
            filaEncabezado.eachCell(celda => {
                celda.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0284C7' } };
                celda.alignment = { horizontal: 'center', vertical: 'middle' };
                celda.border = {
                    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
                    bottom: { style: 'medium', color: { argb: 'FF0284C7' } }
                };
            });

            const bordeCelda = {
                top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
            };

            inventarioReporte.forEach((item, indice) => {
                const bajoStock = parseInt(item.stock) <= parseInt(item.minimo);
                const fila = worksheet.addRow([
                    indice + 1,
                    item.nombre,
                    item.modelo && item.modelo !== 'N/A' ? item.modelo : 'N/A',
                    item.departamento || 'Sin Asignar',
                    parseInt(item.stock),
                    parseInt(item.minimo),
                    item.ultimo_cambio || 'Sin registro',
                    bajoStock ? 'Bajo Stock' : 'Óptimo'
                ]);

                fila.eachCell((celda, numeroColumna) => {
                    celda.border = bordeCelda;
                    celda.font = { size: 10, color: { argb: 'FF1E293B' } };
                    if ([1, 5, 6, 7, 8].includes(numeroColumna)) {
                        celda.alignment = { horizontal: 'center' };
                    }
                });

                const celdaEstado = fila.getCell(8);
                celdaEstado.font = { bold: true, size: 10, color: { argb: bajoStock ? 'FF991B1B' : 'FF166534' } };
                celdaEstado.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: bajoStock ? 'FFFEE2E2' : 'FFDCFCE7' }
                };
            });

            try {
                const contenido = await workbook.xlsx.writeBuffer();
                const archivo = new Blob([contenido], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const url = URL.createObjectURL(archivo);
                const enlace = document.createElement('a');
                enlace.href = url;
                enlace.download = `Reporte_Inventario_Cindu_${new Date().toISOString().slice(0, 10)}.xlsx`;
                enlace.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (error) {
                console.error(error);
                alert('No se pudo generar el reporte Excel.');
            }
        });
    }

    // 2. REPORTE EN PDF CON LOGO Y MEMBRETE CORPORATIVO
    const btnPdf = document.getElementById('btn-export-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', async function () {
            let inventarioReporte;
            try {
                inventarioReporte = await cargarInventarioCompleto();
            } catch (error) {
                alert(error.message);
                return;
            }

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

            const totalInsumos = inventarioReporte.length;
            const bajoStock = inventarioReporte.filter(i => parseInt(i.stock) <= parseInt(i.minimo)).length;
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
                        doc.addImage(logoDataUrl, 'PNG', 14, 18, 28, 16);
                        inicioX = 44; // Desplazar texto a la derecha del logo
                    } catch (e) {
                        console.warn("No se pudo cargar el logo, renderizando texto alternativo.", e);
                    }
                }

                // Membrete Institucional
                doc.setFontSize(13);
                doc.setTextColor(15, 23, 42);
                doc.setFont("helvetica", "bold");
                doc.text("CINDU DE VENEZUELA, C.A.", inicioX, 22);

                doc.setFontSize(9);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(100, 116, 139);
                doc.text("Sistema de Control Interno de Insumos y Equipos", inicioX, 27);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(14, 116, 189);
                doc.text(`RIF: ${RIF_EMPRESA}`, inicioX, 35);

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
                let bodyData = inventarioReporte.map((i, index) => [
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
            imgLogo.src = 'assets/img/logocindu.png';

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
                // Genera el PDF con el membrete de texto si el logo no está disponible.
                generarContenidoPDF(null);
            };
        });
    }

    // USUARIOS
    function cargarUsuarios() {
        return fetch('api/usuarios/listar.php')
            .then(res => {
                if (!res.ok) throw new Error('No se pudieron cargar los usuarios.');
                return res.json();
            })
            .then(res => {
                if (!res.success) throw new Error(res.message || 'No se pudieron cargar los usuarios.');
                listaUsuarios = res.data;
                renderizarTablaUsuariosMain();
                const sugerencias = document.getElementById('sugerencias-responsables');
                if (sugerencias) {
                    const opciones = listaUsuarios.map(usuario => {
                        const opcion = document.createElement('option');
                        opcion.value = usuario.nombre;
                        return opcion;
                    });
                    sugerencias.replaceChildren(...opciones);
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
                            <i class="bi bi-pencil"></i>
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
                        cargarUsuarios().catch(error => alert(error.message));
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
                        cargarUsuarios().catch(error => alert(error.message));
                        bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
                    } else { alert(res.message); }
                });
        });
    }

    const formNuevoEquipo = document.getElementById('form-nuevo-equipo');
    if (formNuevoEquipo) {
        formNuevoEquipo.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('tipo', document.getElementById('equipo-nuevo-tipo').value);
            formData.append('marca', document.getElementById('equipo-nuevo-marca').value);
            formData.append('serial', document.getElementById('equipo-nuevo-serial').value);
            formData.append('departamento_id', document.getElementById('equipo-nuevo-departamento').value);
            formData.append('responsable', document.getElementById('equipo-nuevo-responsable').value);
            formData.append('ultima_modificacion', document.getElementById('equipo-nuevo-fecha').value);
            formData.append('notas', document.getElementById('equipo-nuevo-notas').value);

            try {
                const respuesta = await fetch('api/equipos/crear.php', { method: 'POST', body: formData });
                const resultado = await respuesta.json();
                if (!resultado.success) throw new Error(resultado.message || 'No se pudo registrar el equipo.');
                await cargarEquipos();
                bootstrap.Modal.getInstance(document.getElementById('modalNuevoEquipo')).hide();
                formNuevoEquipo.reset();
            } catch (error) {
                alert(error.message || 'Error al registrar el equipo.');
            }
        });
    }

    const formEditarEquipo = document.getElementById('form-editar-equipo');
    if (formEditarEquipo) {
        formEditarEquipo.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('id', document.getElementById('equipo-editar-id').value);
            formData.append('tipo', document.getElementById('equipo-editar-tipo').value);
            formData.append('marca', document.getElementById('equipo-editar-marca').value);
            formData.append('serial', document.getElementById('equipo-editar-serial').value);
            formData.append('departamento_id', document.getElementById('equipo-editar-departamento').value);
            formData.append('responsable', document.getElementById('equipo-editar-responsable').value);
            formData.append('ultima_modificacion', document.getElementById('equipo-editar-fecha').value);
            formData.append('notas', document.getElementById('equipo-editar-notas').value);

            try {
                const respuesta = await fetch('api/equipos/editar.php', { method: 'POST', body: formData });
                const resultado = await respuesta.json();
                if (!resultado.success) throw new Error(resultado.message || 'No se pudo actualizar el equipo.');
                await cargarEquipos();
                bootstrap.Modal.getInstance(document.getElementById('modalEditarEquipo')).hide();
            } catch (error) {
                alert(error.message || 'Error al actualizar el equipo.');
            }
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
                        cargarInventario(1, true).catch(error => alert(error.message));
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
                        cargarInventario(paginaInventario, true).catch(error => alert(error.message));
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
                        cargarInventario(paginaInventario, true).catch(error => alert(error.message));
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