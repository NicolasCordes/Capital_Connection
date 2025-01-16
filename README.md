
# Capital Connection

Capital Connection es un proyecto de crowdfunding desarrollado con **Angular**, **TypeScript**, **HTML** y **CSS**. A continuación, encontrarás las instrucciones necesarias para levantar el entorno de desarrollo y configurar correctamente la aplicación.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados en tu equipo:
- **Node.js** (versión recomendada: 16 o superior)
- **npm** (gestor de paquetes de Node.js)
- **Angular CLI**
- **Java 21** (para la API)

## Instalación y configuración

### 1. Clonar el repositorio

Descarga o clona este repositorio utilizando el siguiente comando:

```
git clone https://github.com/NicolasCordes/Capital_Connection.git
```

### 2. Abrir el proyecto

Abre el proyecto en **Visual Studio Code (VSC)** o tu editor de código preferido.

### 3. Instalar dependencias

Dentro del directorio del proyecto, instala las dependencias de Node.js ejecutando:

```
npm install
```

### 4. Instalar JSON Server

JSON Server es necesario para simular un backend local. Instálalo de manera global ejecutando:

```
npm install -g json-server
```

### 5. Configurar y levantar JSON Server

Ejecuta el siguiente comando para iniciar el JSON Server utilizando el archivo `db.json`:

```
json-server db/db.json
```

### 6. Levantar la aplicación Angular

En una terminal separada, inicia el servidor de desarrollo de Angular con:

```
ng serve
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200).

### 7. Instalar y configurar la API

La aplicación utiliza **CrowdNet API**, desarrollada en **Java con Spring Boot**. Sigue estos pasos:

1. Clona el repositorio de la API desde el siguiente enlace:
   [CrowdNet API](https://github.com/julianpelle/CrowdNet-API)
2. Sigue las instrucciones en el archivo `README.md` del repositorio para instalar y ejecutar la API.

### 8. ¡Listo!

Con estos pasos, el proyecto estará funcionando correctamente.

---

## Sobre Nosotros

Somos estudiantes de la **Tecnicatura Universitaria en Programación** en la **Universidad Tecnológica Nacional (UTN)**. A continuación, te compartimos más sobre nosotros:

- **Nicolás Cordes**  
  [GitHub](https://github.com/NicolasCordes)

- **Santiago Fidelibus**  
  [GitHub](https://github.com/SantiagoFidelibus)

- **Nicolás Palacios Calvi**  
  [GitHub](https://github.com/NicolasPalaciosCalvi)

- **Julián Pellegrini**  
  [GitHub](https://github.com/julianpelle)

---

¡Gracias por interesarte en Capital Connection! 😊
