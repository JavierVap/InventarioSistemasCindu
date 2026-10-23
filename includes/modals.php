<!-- MODAL: AGREGAR INSUMO -->
<div class="modal fade" id="modalNuevoInsumo" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0" style="border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div class="modal-header border-0 pb-0 pt-4 px-4">
                <h5 class="modal-title fw-bold">Registrar Nuevo Insumo</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="form-nuevo-insumo">
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Nombre del artículo</label>
                        <input type="text" class="form-control login-input" id="nuevo-nombre" required placeholder="Ej. Tinta Negra T544">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-primary" style="font-size: 0.85rem;"><i class="bi bi-printer"></i> Modelo de Equipo (Opcional)</label>
                        <input type="text" class="form-control login-input" id="nuevo-modelo" placeholder="Ej. Epson EcoTank L3250">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Asignar a Departamento</label>
                        <select class="form-select login-input" id="nuevo-departamento" required>
                            <option value="">Cargando departamentos...</option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label text-muted" style="font-size: 0.85rem;">Stock Inicial</label>
                            <input type="number" class="form-control login-input" id="nuevo-stock" min="0" value="5" required>
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label text-muted" style="font-size: 0.85rem;">Alerta Mínima</label>
                            <input type="number" class="form-control login-input" id="nuevo-minimo" min="1" value="2" required>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button type="submit" class="btn btn-brand w-100 py-2">Guardar Insumo</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- MODAL: EDITAR INSUMO -->
<div class="modal fade" id="modalEditarInsumo" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0" style="border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div class="modal-header border-0 pb-0 pt-4 px-4">
                <h5 class="modal-title fw-bold">Editar Insumo</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="form-editar-insumo">
                    <input type="hidden" id="editar-id"> 
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Nombre del artículo</label>
                        <input type="text" class="form-control login-input" id="editar-nombre" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-primary" style="font-size: 0.85rem;"><i class="bi bi-printer"></i> Modelo de Equipo</label>
                        <input type="text" class="form-control login-input" id="editar-modelo">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Departamento</label>
                        <select class="form-select login-input" id="editar-departamento" required>
                            <option value="">Cargando departamentos...</option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label text-muted" style="font-size: 0.85rem;">Stock Actual</label>
                            <input type="number" class="form-control login-input" id="editar-stock" min="0" required>
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label text-muted" style="font-size: 0.85rem;">Alerta Mínima</label>
                            <input type="number" class="form-control login-input" id="editar-minimo" min="1" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Último cambio</label>
                        <input type="date" class="form-control login-input" id="editar-fecha">
                    </div>
                    <div class="mt-4">
                        <button type="submit" class="btn btn-dark w-100 py-2" style="border-radius: 12px; font-weight: 600;">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>


<!-- MODAL: GESTIÓN DE USUARIOS -->
<div class="modal fade" id="modalGestionUsuarios" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0" style="border-radius: 20px;">
            <div class="modal-header border-0 pt-4 px-4">
                <h5 class="modal-title fw-bold"><i class="bi bi-people-fill text-primary me-2"></i>Gestión de Usuarios</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-muted small">Listado de personal con acceso al sistema</span>
                    <button class="btn btn-sm btn-primary rounded-3" data-bs-toggle="modal" data-bs-target="#modalNuevoUsuario">
                        <i class="bi bi-person-plus-fill me-1"></i> Crear Usuario
                    </button>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover align-middle" style="font-size: 0.88rem;">
                        <thead class="table-light">
                            <tr>
                                <th>Cédula / Usuario</th>
                                <th>Nombre</th>
                                <th>Departamento</th>
                                <th>Rol</th>
                                <th class="text-end">Acción</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-usuarios">
                            <!-- Se llena dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- MODAL: NUEVO USUARIO -->
<div class="modal fade" id="modalNuevoUsuario" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0" style="border-radius: 20px;">
            <div class="modal-header border-0 pt-4 px-4">
                <h5 class="modal-title fw-bold">Crear Nuevo Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="form-nuevo-usuario">
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Cédula / Usuario</label>
                        <input type="text" class="form-control login-input" id="user-nuevo-cedula" required placeholder="Ej. JVILCHEZ">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Nombre Completo</label>
                        <input type="text" class="form-control login-input" id="user-nuevo-nombre" required placeholder="Ej. Javier Vilchez">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Contraseña Inicial</label>
                        <input type="password" class="form-control login-input" id="user-nuevo-password" required placeholder="••••••••">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Departamento Asignado</label>
                        <select class="form-select login-input" id="user-nuevo-departamento" required>
                            <option value="">Cargando departamentos...</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Rol de Sistema</label>
                        <select class="form-select login-input" id="user-nuevo-rol" required>
                            <option value="usuario">Usuario Estándar</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-brand w-100 py-2 mt-2">Guardar Usuario</button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- MODAL: EDITAR USUARIO -->
<div class="modal fade" id="modalEditarUsuario" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0" style="border-radius: 20px;">
            <div class="modal-header border-0 pt-4 px-4">
                <h5 class="modal-title fw-bold">Editar Usuario</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <form id="form-editar-usuario">
                    <input type="hidden" id="user-editar-id">
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Cédula / Usuario</label>
                        <input type="text" class="form-control login-input" id="user-editar-cedula" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Nombre Completo</label>
                        <input type="text" class="form-control login-input" id="user-editar-nombre" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Nueva Contraseña (Opcional)</label>
                        <input type="password" class="form-control login-input" id="user-editar-password" placeholder="Dejar en blanco para mantener actual">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Departamento</label>
                        <select class="form-select login-input" id="user-editar-departamento" required>
                            <option value="">Cargando departamentos...</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted" style="font-size: 0.85rem;">Rol de Sistema</label>
                        <select class="form-select login-input" id="user-editar-rol" required>
                            <option value="usuario">Usuario Estándar</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-dark w-100 py-2 mt-2" style="border-radius: 12px; font-weight: 600;">Actualizar Usuario</button>
                </form>
            </div>
        </div>
    </div>
</div>