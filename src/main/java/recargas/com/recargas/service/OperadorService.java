package recargas.com.recargas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import recargas.com.recargas.entity.Operador;
import recargas.com.recargas.repository.OperadorRepository;

import java.util.List;
@Service
@RequiredArgsConstructor
public class OperadorService {

    private final OperadorRepository repository;

    public Operador crear(Operador operador) {
        return repository.save(operador);
    }

    public Operador actualizar(Long id, Operador datos) {

        Operador operador = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Operador no encontrado"));

        operador.setNombre(datos.getNombre());

        return repository.save(operador);
    }

    public List<Operador> listar() {
        return repository.findAll();
    }
}
