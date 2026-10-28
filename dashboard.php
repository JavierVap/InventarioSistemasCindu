<div id="dashboard-view" class="container-fluid" data-authenticated="<?php echo isset($_SESSION['usuario_id']) ? 'true' : 'false'; ?>">
    <div class="row">
        <?php include 'includes/sidebar.php'; ?>

        <div class="col-md-10 p-4 pb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-3">
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

            <?php include 'views/dashboard.php'; ?>
            <?php include 'views/insumos.php'; ?>
            <?php include 'views/usuarios.php'; ?>
            <?php include 'views/equipos.php'; ?>
        </div>
    </div>
</div>
