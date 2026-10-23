<div id="dashboard-view" class="container-fluid">
    <div class="row">
        <!-- Sidebar -->
        <?php include 'includes/sidebar.php'; ?>

        <!-- Contenido Principal -->
        <div class="col-md-10 p-4 pb-5">
            <!-- Header Global -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-3">
                    <!-- Botón Hamburguesa (solo visible en móvil) -->
                    <button class="btn btn-white border d-md-none shadow-sm py-2 px-3 rounded-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                    <div>
                        <h4 class="fw-bold mb-1" id="section-title">Dashboard Analítico</h4>
                        <p class="text-muted mb-0" style="font-size: 0.9rem;">
                            Área: <span id="user-dept" class="fw-semibold text-primary"><?php echo htmlspecialchars($_SESSION['departamento'] ?? 'Sin Asignar'); ?></span>
                        </p>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="d-flex align-items-center gap-2 border rounded-pill px-3 py-1 bg-white">
                        <span class="text-dark fw-medium" id="user-name" style="font-size: 0.9rem;"><?php echo htmlspecialchars($_SESSION['nombre'] ?? 'Usuario'); ?></span>
                        <i class="bi bi-person-circle text-muted fs-5"></i>
                    </div>
                </div>
            </div>

            <!-- ================= SECCIÓN 1: DASHBOARD CON GRÁFICOS Y REPORTES ================= -->
            <div id="sec-dashboard" class="module-section">
                <!-- Botones de Reportes -->
                <div class="d-flex justify-content-end gap-2 mb-4">
                    <button class="btn btn-outline-success rounded-3 d-flex align-items-center gap-2" id="btn-export-excel">
                        <i class="bi bi-file-earmark-excel"></i> Exportar Excel
                    </button>
                    <button class="btn btn-outline-danger rounded-3 d-flex align-items-center gap-2" id="btn-export-pdf">
                        <i class="bi bi-file-earmark-pdf"></i> Generar Reporte PDF
                    </button>
                </div>

                <!-- Tarjetas de Métricas -->
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div class="d-flex align-items-center gap-3">
                                <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary">
                                    <i class="bi bi-boxes fs-3"></i>
                                </div>
                                <div>
                                    <span class="text-muted small">Total de Insumos</span>
                                    <h3 class="fw-bold mb-0" id="metric-total">0</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div class="d-flex align-items-center gap-3">
                                <div class="bg-danger bg-opacity-10 p-3 rounded-3 text-danger">
                                    <i class="bi bi-exclamation-triangle fs-3"></i>
                                </div>
                                <div>
                                    <span class="text-muted small">Bajo Stock / Alerta</span>
                                    <h3 class="fw-bold mb-0 text-danger" id="metric-alerta">0</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div class="d-flex align-items-center gap-3">
                                <div class="bg-success bg-opacity-10 p-3 rounded-3 text-success">
                                    <i class="bi bi-check-circle fs-3"></i>
                                </div>
                                <div>
                                    <span class="text-muted small">Stock Óptimo</span>
                                    <h3 class="fw-bold mb-0 text-success" id="metric-optimo">0</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contenedores de Gráficos -->
                <div class="row">
                    <div class="col-md-6 mb-4">
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                            <h6 class="fw-bold mb-3">Estado del Inventario</h6>
                            <div style="position: relative; height:280px;">
                                <canvas id="chartEstado"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-4">
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                            <h6 class="fw-bold mb-3">Stock por Departamento</h6>
                            <div style="position: relative; height:280px;">
                                <canvas id="chartDepartamentos"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= SECCIÓN 2: MAESTRO DE INSUMOS ================= -->
            <div id="sec-insumos" class="module-section d-none">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">Maestro de Insumos</h5>
                    <button class="btn btn-brand shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#modalNuevoInsumo">
                        <i class="bi bi-plus-lg"></i> Nuevo Insumo
                    </button>
                </div>

                <div class="row">
                    <!-- Formulario de Retiro -->
                    <div class="col-xl-3 col-lg-4 mb-4">
                        <div class="chart-container h-100">
                            <h6 class="fw-bold mb-4">Registrar Retiro</h6>
                            <form id="form-retiro">
                                <div class="mb-3">
                                    <label class="form-label text-muted" style="font-size: 0.85rem;">Insumo</label>
                                    <select class="form-select login-input" id="select-insumo-retiro" required></select>
                                </div>
                                <div class="mb-4">
                                    <label class="form-label text-muted" style="font-size: 0.85rem;">Cantidad</label>
                                    <input type="number" class="form-control login-input" id="cantidad-retiro" min="1" value="1" required>
                                </div>
                                <button type="submit" class="btn w-100" style="background-color: #f1f5f9; color: var(--text-dark); font-weight: 600; border-radius: 12px;">
                                    <i class="bi bi-arrow-down-circle me-1"></i> Procesar Retiro
                                </button>
                            </form>
                            <div id="toast-retiro" class="alert alert-success mt-3 d-none p-2 text-center" style="font-size: 0.85rem;"></div>
                        </div>
                    </div>

                    <!-- Tabla del Maestro de Insumos -->
                    <div class="col-xl-9 col-lg-8 mb-4">
                        <div class="table-container h-100">
                            <div class="table-responsive pe-2">
                                <table class="table table-hover align-middle" style="font-size: 0.9rem;">
                                    <thead>
                                        <tr>
                                            <th>Insumo</th>
                                            <th>Modelo / Equipo</th>
                                            <th>Dpto.</th>
                                            <th class="text-center">Stock</th>
                                            <th class="text-center">Min.</th>
                                            <th>Últ. Cambio</th>
                                            <th>Estado</th>
                                            <th class="text-end">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabla-inventario"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================= SECCIÓN 3: MAESTRO DE USUARIOS ================= -->
            <div id="sec-usuarios" class="module-section d-none">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="fw-bold mb-0">Maestro de Usuarios</h5>
                    <button class="btn btn-primary rounded-3 shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#modalNuevoUsuario">
                        <i class="bi bi-person-plus-fill"></i> Crear Usuario
                    </button>
                </div>

                <div class="table-container bg-white rounded-4 p-4 border shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle" style="font-size: 0.9rem;">
                            <thead class="table-light">
                                <tr>
                                    <th>Cédula / Usuario</th>
                                    <th>Nombre</th>
                                    <th>Departamento</th>
                                    <th>Rol</th>
                                    <th class="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-usuarios-main"></tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>