# Instrucciones del proyecto Recargas

Aplicación Spring Boot para registrar recargas de teléfono, usuarios y operadores. El panel web se sirve desde la misma aplicación y consume la API REST.

## Requisitos

- Java 21.
- PostgreSQL.
- Una base de datos llamada `recargas_db`.

## Preparar la base de datos

Crea la base de datos si todavía no existe:

```sql
CREATE DATABASE recargas_db;
```

Conéctate a `recargas_db` y crea las tablas y datos iniciales:

```sql
CREATE TABLE operador (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE recarga (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(20) NOT NULL,
    valor NUMERIC(15,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    operador_id BIGINT REFERENCES operador(id),
    usuario_id BIGINT REFERENCES usuario(id)
);

INSERT INTO operador (nombre) VALUES ('Tigo'), ('Comcel'), ('Uff');
INSERT INTO usuario (nombre) VALUES ('Juan'), ('Maria');
```

La aplicación usa `spring.jpa.hibernate.ddl-auto=validate`: Hibernate comprueba que las tablas existan y sean compatibles, pero no las crea ni las modifica automáticamente.

## Configurar la conexión

En `src/main/resources/application.properties` la configuración predeterminada es:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/recargas_db
spring.datasource.username=postgres
spring.datasource.password=root
```

Si tu usuario, contraseña, servidor o puerto de PostgreSQL son distintos, actualiza esas propiedades antes de iniciar la aplicación.

## Iniciar la aplicación

Desde la carpeta del proyecto, en PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

En Linux o macOS:

```bash
./mvnw spring-boot:run
```

Cuando Spring Boot indique que inició correctamente, abre [http://localhost:8080](http://localhost:8080). La página está en `src/main/resources/static` y se sirve junto con la API.

## Usar el panel

1. En **Usuarios** y **Operadores**, los datos de ejemplo se cargan desde la base de datos. Puedes agregar más registros con los formularios.
2. En **Registrar recarga**, escribe el teléfono, selecciona usuario y operador, y escribe un valor mayor que cero.
3. El teléfono admite de 7 a 15 dígitos. El formulario elimina caracteres que no sean dígitos.
4. Los nombres son obligatorios, aceptan letras y espacios, y deben tener entre 2 y 80 caracteres.
5. El historial muestra las recargas recientes y el panel permite actualizar los datos.

## API disponible

- `GET /usuarios` y `POST /usuarios`
- `GET /operadores` y `POST /operadores`
- `GET /recargas` y `POST /recargas`
- `GET /recargas/resumen`

Para registrar una recarga, la API espera las referencias de usuario y operador por ID. Por ejemplo:

```json
{
  "numero": "3001234567",
  "valor": 10000,
  "usuario": { "id": 1 },
  "operador": { "id": 1 }
}
```

La fecha se asigna en el servidor al crear la recarga.
