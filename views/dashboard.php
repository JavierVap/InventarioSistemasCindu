<div id="sec-dashboard" class="module-section">
    <div class="d-flex justify-content-end gap-2 mb-4">
        <button class="btn btn-outline-success rounded-3 d-flex align-items-center gap-2" id="btn-export-excel">
            <i class="bi bi-file-earmark-excel"></i> Exportar Excel
        </button>
        <button class="btn btn-outline-danger rounded-3 d-flex align-items-center gap-2" id="btn-export-pdf">
            <i class="bi bi-file-earmark-pdf"></i> Generar Reporte PDF
        </button>
    </div>

    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div class="d-flex align-items-center gap-3">
                    <div class="bg-primary bg-opacity-10 p-3 rounded-3 text-primary"><i class="bi bi-boxes fs-3"></i></div>
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
                    <div class="bg-danger bg-opacity-10 p-3 rounded-3 text-danger"><i class="bi bi-exclamation-triangle fs-3"></i></div>
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
                    <div class="bg-success bg-opacity-10 p-3 rounded-3 text-success"><i class="bi bi-check-circle fs-3"></i></div>
                    <div>
                        <span class="text-muted small">Stock Óptimo</span>
                        <h3 class="fw-bold mb-0 text-success" id="metric-optimo">0</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-6 mb-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h6 class="fw-bold mb-3">Estado del Inventario</h6>
                <div style="position: relative; height:280px;"><canvas id="chartEstado"></canvas></div>
            </div>
        </div>
        <div class="col-md-6 mb-4">
            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <h6 class="fw-bold mb-3">Stock por Departamento</h6>
                <div style="position: relative; height:280px;"><canvas id="chartDepartamentos"></canvas></div>
            </div>
        </div>
    </div>
</div>
