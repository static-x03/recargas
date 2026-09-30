package recargas.com.recargas.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import recargas.com.recargas.entity.Operador;
import recargas.com.recargas.service.OperadorService;

import java.util.List;

@RestController
@RequestMapping("/operadores")
@RequiredArgsConstructor
public class OperadorController {

    private final OperadorService service;

    @PostMapping
    public Operador crear(@RequestBody Operador operador) {
        return service.crear(operador);
    }

    @PutMapping("/{id}")
    public Operador actualizar(
            @PathVariable Long id,
            @RequestBody Operador operador) {

        return service.actualizar(id, operador);
    }

    @GetMapping
    public List<Operador> listar() {
        return service.listar();
    }
}
