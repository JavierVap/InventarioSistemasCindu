<div id="sec-usuarios" class="module-section d-none">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Maestro de Usuarios</h5>
        <button class="btn btn-brand shadow-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#modalNuevoUsuario">
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
