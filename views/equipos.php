<div id="sec-equipos" class="module-section d-none">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Inventario de Equipos</h5>
        <button class="btn btn-brand shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#modalNuevoEquipo">
            <i class="bi bi-laptop"></i> Registrar Equipo
        </button>
    </div>

    <div class="table-container bg-white rounded-4 p-4 border shadow-sm">
        <div class="table-responsive">
            <table class="table table-hover align-middle" style="font-size: 0.9rem;">
                <thead class="table-light">
                    <tr>
                        <th>Tipo</th>
                        <th>Marca</th>
                        <th>Serial</th>
                        <th>Departamento</th>
                        <th>Usuario / Responsable</th>
                        <th>Última modificación</th>
                        <th>Notas</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="tabla-equipos"></tbody>
            </table>
        </div>
    </div>
</div>
