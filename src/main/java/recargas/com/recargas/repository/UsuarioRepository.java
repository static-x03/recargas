package recargas.com.recargas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import recargas.com.recargas.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
