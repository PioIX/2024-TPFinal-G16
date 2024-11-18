# Owl - Red Social Estilo Twitter

Owl es una red social inspirada en Twitter, donde los usuarios pueden compartir sus pensamientos, interactuar con publicaciones de otros y explorar contenido en tiempo real. El proyecto está construido con **Next.js** en el frontend y un **backend en Express** con conexión a una **base de datos SQL**.

## Requisitos

Antes de comenzar, debes tener instalado lo siguiente:

- **Node.js** (versión recomendada: 16.x o superior)
- **npm** (viene incluido con Node.js)
- **Base de datos SQL** (MySQL, PostgreSQL, etc.)


## Instalación

Sigue los pasos a continuación para configurar el proyecto en tu máquina local:

### 1. Clona el repositorio:

```bash
git clone https://github.com/PioIX/2024-TPFinal-G16.git
cd 2024-TPFinal-G16
```
### 2. Instala las dependencias:

```bash
npm install
```
### 3. Configura las variables de entorno:
Nosotros usamos AUTH0 para el registro de usuarios y para iniciar sesión:  
Los datos del usuario quedan guardados en una Base de Datos privada, en la que se garantiza que el contenido no sea posible de filtrar fácilmente. 
```bash
# Variables de Auth0
NEXT_PUBLIC_AUTH0_DOMAIN=tu-dominio.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret

# Configuración de base de datos SQL
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=nombre_de_base_de_datos

```
### 4. Inicia el servidor en modo desarrollo:
```bash
npm run dev
```
Esto levantará el servidor localmente. Por defecto, la aplicación estará disponible en:
```bash
http://localhost:3000
```





