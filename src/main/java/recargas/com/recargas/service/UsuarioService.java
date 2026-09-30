package recargas.com.recargas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import recargas.com.recargas.entity.Usuario;
import recargas.com.recargas.repository.UsuarioRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repository;

    public Usuario crear(Usuario usuario) {
        return repository.save(usuario);
    }

    public Usuario actualizar(Long id, Usuario datos) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(datos.getNombre());

        return repository.save(usuario);
    }

    public List<Usuario> listar() {
        return repository.findAll();
    }
}
