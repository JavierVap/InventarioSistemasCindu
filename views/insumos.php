<div id="sec-insumos" class="module-section d-none">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Maestro de Insumos</h5>
        <button class="btn btn-brand shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#modalNuevoInsumo">
            <i class="bi bi-plus-lg"></i> Nuevo Insumo
        </button>
    </div>

    <div class="row">
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
                <div class="d-flex justify-content-between align-items-center mt-3 gap-3">
                    <small id="inventario-paginacion-info" class="text-muted" aria-live="polite"></small>
                    <nav aria-label="Paginación del inventario">
                        <ul id="inventario-paginacion" class="pagination pagination-sm mb-0"></ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</div>
