package recargas.com.recargas.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import recargas.com.recargas.entity.Usuario;
import recargas.com.recargas.service.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return service.crear(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuario) {

        return service.actualizar(id, usuario);
    }

    @GetMapping
    public List<Usuario> listar() {
        return service.listar();
    }
}