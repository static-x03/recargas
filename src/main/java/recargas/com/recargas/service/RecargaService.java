package recargas.com.recargas.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import recargas.com.recargas.entity.Operador;
import recargas.com.recargas.entity.Recarga;
import recargas.com.recargas.entity.Usuario;
import recargas.com.recargas.repository.OperadorRepository;
import recargas.com.recargas.repository.RecargaRepository;
import recargas.com.recargas.repository.UsuarioRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecargaService {

    private final RecargaRepository recargaRepository;
    private final OperadorRepository operadorRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Recarga> listarRecargas() {
        return recargaRepository.findAll();
    }

    public Recarga guardarRecarga(Recarga recarga) {
        Operador operador = operadorRepository.findById(recarga.getOperador().getId()).orElseThrow(()
                -> new RuntimeException("Operador no encontrado"));
        Usuario usuario = usuarioRepository.findById(recarga.getUsuario().getId()).orElseThrow(()
                -> new RuntimeException("Usuario no encontrado"));
        recarga.setOperador(operador);
        recarga.setUsuario(usuario);
        recarga.setFecha(LocalDateTime.now());
        return recargaRepository.save(recarga);
    }

    public List<Object[]> resumen() {
        return recargaRepository.resumen();
    }

}

