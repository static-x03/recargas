package recargas.com.recargas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Recarga {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    private String numero;
    private BigDecimal valor;
    private LocalDateTime fecha;
    @ManyToOne
    @JoinColumn(name = "operador_id")
    private Operador operador;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
