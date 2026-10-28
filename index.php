<?php 
session_start();
include 'includes/head.php'; 
?>

<!-- Estilos dinámicos para evitar el destello al recargar sin bloquear a JavaScript -->
<?php if (isset($_SESSION['usuario_id'])): ?>
    <style>
        #login-view { display: none; }
        #dashboard-view { display: block; }
    </style>
<?php else: ?>
    <style>
        #login-view { display: flex; }
        #dashboard-view { display: none; }
    </style>
<?php endif; ?>

<!-- ======================= PANTALLA DE LOGIN ======================= -->
<div id="login-view">
    <div class="login-card">
        <div class="text-center mb-4">
            <img src="assets/img/logocindu.png" alt="Cindu de Venezuela" class="login-logo">
            <h4 class="fw-bold text-dark mb-1">Insumos Control</h4>
            <p class="text-muted" style="font-size: 0.9rem;">Acceso al sistema corporativo</p>
        </div>
        <form id="login-form">
            <div class="mb-3">
                <label class="form-label text-muted fw-medium" style="font-size: 0.85rem;">Cédula o Usuario</label>
                <input type="text" class="form-control login-input" id="username" name="username" required placeholder="Ej. JVILCHEZ">
            </div>
            <div class="mb-4">
                <label class="form-label text-muted fw-medium" style="font-size: 0.85rem;">Clave</label>
                <input type="password" class="form-control login-input" id="password" name="password" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-brand w-100">Iniciar Sesión</button>
            
            <div id="login-alert" class="alert alert-danger d-none mt-3 p-2 text-center" style="font-size: 0.85rem; border-radius: 10px;"></div>
        </form>
    </div>
</div>

<!-- ======================= DASHBOARD PRINCIPAL ======================= -->
<?php include 'dashboard.php'; ?>

<!-- ======================= MODALES Y SCRIPTS ======================= -->
<?php include 'includes/modals.php'; ?>
<?php include 'includes/scripts.php'; ?>