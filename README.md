# Sistema de recargas

Aplicación web para administrar usuarios y operadores, registrar recargas telefónicas y consultar el historial. Está construida con Spring Boot, Spring Data JPA y PostgreSQL; el panel web se sirve desde la misma aplicación.

## Documentación

- [Instrucciones de instalación, configuración y uso](INSTRUCCIONES.md)
- [Diagramas relacional, de casos de uso, secuencia y clases](DIAGRAMAS.md)

## Inicio rápido

Requisitos: Java 21 y PostgreSQL. Crea la base de datos `recargas_db` y sus tablas siguiendo [INSTRUCCIONES.md](INSTRUCCIONES.md). Configura la variable de entorno `DB_PASSWORD` con la contraseña de PostgreSQL y ejecuta desde la carpeta del proyecto:

```powershell
./mvnw.cmd spring-boot:run
```

Abre [http://localhost:8080](http://localhost:8080) para utilizar el panel. La documentación incluye los pasos completos y el SQL de preparación.
