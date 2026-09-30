package recargas.com.recargas.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import recargas.com.recargas.entity.Recarga;
import recargas.com.recargas.service.RecargaService;

import java.util.List;

@RestController
@RequestMapping("/recargas")
@RequiredArgsConstructor
public class RecargaController {

    private final RecargaService recargaService;

    @PostMapping
    public Recarga createRecarga(@RequestBody Recarga recarga) {
        return recargaService.guardarRecarga(recarga);
    }

    @GetMapping
    public List<Recarga> getAllRecargas() {
        return recargaService.listarRecargas();
    }

    @GetMapping("/resumen")
    public List<Object[]> getResumen() {
        return recargaService.resumen();
    }
}
