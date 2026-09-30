package recargas.com.recargas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import recargas.com.recargas.entity.Recarga;

import java.util.List;

public interface RecargaRepository extends JpaRepository<Recarga, Long> {

    @Query("""
SELECT r.operador.nombre, r.usuario.nombre, SUM(r.valor) FROM Recarga r GROUP BY r.operador.nombre, r.usuario.nombre
""")
    List<Object[]> resumen();
}
