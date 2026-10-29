# Despliegue sin Internet

El sistema no necesita acceso a Internet para funcionar. Bootstrap, Bootstrap
Icons, Chart.js, ExcelJS, jsPDF y jsPDF-AutoTable se sirven desde
`assets/vendor/`; la tipografía usa fuentes instaladas en el sistema operativo.
Al copiar o respaldar la aplicación, conserva esa carpeta junto con el resto
del proyecto.

Versiones incluidas: Bootstrap 5.3.2, Bootstrap Icons 1.11.1, Chart.js 4.4.0,
ExcelJS 4.4.0, jsPDF 2.5.1 y jsPDF-AutoTable 3.5.31.

## Requisitos del servidor

- Apache y PHP. La base de datos actual se generó con PHP 8.0.30; usa esa
  versión o una compatible.
- MySQL o MariaDB. El volcado actual se generó con MariaDB 10.4.32.
- La extensión `pdo_mysql` habilitada en PHP.
- `mod_rewrite` habilitado y `AllowOverride` configurado para que Apache lea
  el archivo `.htaccess`.
- Un navegador en los equipos que usarán el sistema.

## Preparación

1. Copia el proyecto completo a la carpeta web de la máquina virtual.
2. Crea la base de datos `cindu_inventario` e importa
   `database/cindu_inventario.sql`.
3. Ajusta host, usuario y contraseña de MySQL en `config/conexion.php`.
4. Inicia Apache y MySQL/MariaDB. En la VM, abre
   `http://localhost/InvCindu/`; desde otros equipos de la red, usa la
   dirección IP local de la VM, por ejemplo `http://<IP-de-la-VM>/InvCindu/`.
5. Si otros equipos de la red acceden a la VM, permite el tráfico HTTP en el
   firewall local.

La aplicación y sus archivos estáticos no llaman a servicios externos. La
conexión de los navegadores a la VM y la conexión de PHP a la base de datos
local seguirán siendo necesarias.

Las versiones y licencias de las bibliotecas incluidas están en
`assets/vendor/licenses/`.
