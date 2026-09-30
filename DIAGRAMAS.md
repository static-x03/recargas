# Diagramas del sistema de recargas

Diagramas correspondientes a la implementación actual del proyecto. Se pueden visualizar en editores compatibles con Mermaid, por ejemplo GitHub o la vista previa de Markdown de VS Code.

## 1. Diagrama relacional

Representa las tablas PostgreSQL y sus claves. Una recarga puede asociarse con un usuario y un operador; tanto `operador_id` como `usuario_id` son claves foráneas.

```mermaid
erDiagram
    OPERADOR ||--o{ RECARGA : "atiende"
    USUARIO ||--o{ RECARGA : "solicita"

    OPERADOR {
        BIGINT id PK
        VARCHAR_50 nombre
    }
    USUARIO {
        BIGINT id PK
        VARCHAR_100 nombre
    }
    RECARGA {
        BIGINT id PK
        VARCHAR_20 numero
        NUMERIC_15_2 valor
        TIMESTAMP fecha
        BIGINT operador_id FK
        BIGINT usuario_id FK
    }
```

## 2. Diagrama de casos de uso

El usuario del panel puede consultar información, mantener los catálogos y registrar recargas.

```mermaid
flowchart LR
    persona[Usuario del sistema]
    subgraph sistema[Panel de gestión de recargas]
        consultar[Consultar resumen e historial]
        listar[Consultar usuarios y operadores]
        crearUsuario[Registrar usuario]
        crearOperador[Registrar operador]
        validar[Validar datos del formulario]
        recargar[Registrar recarga]
    end
    persona --> consultar
    persona --> listar
    persona --> crearUsuario
    persona --> crearOperador
    persona --> recargar
    recargar -. incluye .-> validar
```

## 3. Diagrama de secuencia: registrar una recarga

El navegador valida los campos y envía el identificador del usuario y del operador seleccionados. El servicio busca esas entidades y guarda la recarga con la fecha actual.

```mermaid
sequenceDiagram
    actor Persona as Usuario del sistema
    participant Front as Panel web
    participant Controller as RecargaController
    participant Service as RecargaService
    participant OperadorRepo as OperadorRepository
    participant UsuarioRepo as UsuarioRepository
    participant RecargaRepo as RecargaRepository
    participant DB as PostgreSQL

    Persona->>Front: Ingresa teléfono, valor, usuario y operador
    Front->>Front: Valida campos de texto y número
    alt Datos inválidos
        Front-->>Persona: Muestra errores de validación
    else Datos válidos
        Front->>Controller: POST /recargas (JSON)
        Controller->>Service: guardarRecarga(recarga)
        Service->>OperadorRepo: Busca operador por ID
        OperadorRepo->>DB: SELECT operador
        DB-->>OperadorRepo: Operador encontrado
        Service->>UsuarioRepo: Busca usuario por ID
        UsuarioRepo->>DB: SELECT usuario
        DB-->>UsuarioRepo: Usuario encontrado
        Service->>Service: Asigna entidades y fecha actual
        Service->>RecargaRepo: Guarda recarga
        RecargaRepo->>DB: INSERT recarga
        DB-->>RecargaRepo: Recarga guardada
        RecargaRepo-->>Service: Recarga persistida
        Service-->>Controller: Recarga creada
        Controller-->>Front: 200 OK con la recarga
        Front-->>Persona: Confirma registro y actualiza el historial
    end
```

## 4. Diagrama de clases

Resume las entidades, controladores, servicios y repositorios presentes en el código.

```mermaid
classDiagram
    class Usuario {
        +Long id
        +String nombre
    }
    class Operador {
        +Long id
        +String nombre
    }
    class Recarga {
        +Long id
        +String numero
        +BigDecimal valor
        +LocalDateTime fecha
        +Operador operador
        +Usuario usuario
    }
    class UsuarioController {
        +crear(Usuario) Usuario
        +actualizar(Long, Usuario) Usuario
        +listar() List~Usuario~
    }
    class OperadorController {
        +crear(Operador) Operador
        +actualizar(Long, Operador) Operador
        +listar() List~Operador~
    }
    class RecargaController {
        +createRecarga(Recarga) Recarga
        +getAllRecargas() List~Recarga~
        +getResumen() List~Object[]~
    }
    class UsuarioService {
        +crear(Usuario) Usuario
        +actualizar(Long, Usuario) Usuario
        +listar() List~Usuario~
    }
    class OperadorService {
        +crear(Operador) Operador
        +actualizar(Long, Operador) Operador
        +listar() List~Operador~
    }
    class RecargaService {
        +guardarRecarga(Recarga) Recarga
        +listarRecargas() List~Recarga~
        +resumen() List~Object[]~
    }
    class UsuarioRepository
    class OperadorRepository
    class RecargaRepository

    Recarga "0..*" --> "1" Usuario : usuario
    Recarga "0..*" --> "1" Operador : operador
    UsuarioController --> UsuarioService
    OperadorController --> OperadorService
    RecargaController --> RecargaService
    UsuarioService --> UsuarioRepository
    OperadorService --> OperadorRepository
    RecargaService --> UsuarioRepository
    RecargaService --> OperadorRepository
    RecargaService --> RecargaRepository
```

## Correspondencia con el código

- Entidades: `Usuario`, `Operador` y `Recarga`.
- Endpoints: `/usuarios`, `/operadores` y `/recargas`.
- La relación de `Recarga` con `Usuario` y `Operador` es de muchos a uno.
- Las validaciones básicas de nombre, teléfono y valor están actualmente en el front web.
