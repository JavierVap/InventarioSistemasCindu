<!-- Sidebar Adaptativo: Fijo en Desktop / Offcanvas en Móvil -->
<div class="offcanvas-md offcanvas-start col-md-2 sidebar p-4 d-flex flex-column bg-white border-end" id="sidebarMenu" tabindex="-1" aria-labelledby="sidebarMenuLabel" style="min-height: 100vh;">
    
    <!-- Encabezado exclusivo para pantalla móvil -->
    <div class="offcanvas-header px-0 pt-0 pb-3 d-md-none border-bottom mb-3">
        <h5 class="offcanvas-title fw-bold text-dark d-flex flex-column align-items-start" id="sidebarMenuLabel">
            <img src="assets/img/logocindu.png" alt="Cindu de Venezuela" class="sidebar-logo">
            <span class="text-muted small mt-1">RIF: J-00026092-3</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
    </div>

    <!-- Encabezado para pantalla de escritorio -->
    <h5 class="fw-bold text-dark mb-4 d-none d-md-flex flex-column align-items-start">
        <img src="assets/img/logocindu.png" alt="Cindu de Venezuela" class="sidebar-logo">
        <span class="text-muted small mt-1">RIF: J-00026092-3</span>
    </h5>
    
    <!-- Menú de Módulos -->
    <ul class="nav flex-column gap-2" id="sidebar-menu">
        <li class="nav-item">
            <a class="nav-link active rounded-3 nav-module" href="#" data-section="sec-dashboard" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
                <i class="bi bi-pie-chart me-2"></i> Dashboard
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link rounded-3 nav-module" href="#" data-section="sec-insumos" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
                <i class="bi bi-box me-2"></i> Insumos
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link rounded-3 nav-module" href="#" data-section="sec-usuarios" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
                <i class="bi bi-people me-2"></i> Usuarios
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link rounded-3 nav-module" href="#" data-section="sec-equipos" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu">
                <i class="bi bi-laptop me-2"></i> Equipos
            </a>
        </li>
    </ul>

    <!-- Botón Salir -->
    <div class="mt-auto pt-4">
        <hr class="text-muted opacity-25">
        <button id="btn-logout" class="btn btn-light w-100 text-start text-danger fw-medium rounded-3">
            <i class="bi bi-box-arrow-left me-2"></i> Salir
        </button>
    </div>
</div>