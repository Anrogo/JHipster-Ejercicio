package es.curso.myproject.service;

import es.curso.myproject.domain.Pelicula;
import es.curso.myproject.repository.PeliculaRepository;
import es.curso.myproject.repository.search.PeliculaSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Pelicula}.
 */
@Service
@Transactional
public class PeliculaService {

    private final Logger log = LoggerFactory.getLogger(PeliculaService.class);

    private final PeliculaRepository peliculaRepository;

    private final PeliculaSearchRepository peliculaSearchRepository;

    public PeliculaService(PeliculaRepository peliculaRepository, PeliculaSearchRepository peliculaSearchRepository) {
        this.peliculaRepository = peliculaRepository;
        this.peliculaSearchRepository = peliculaSearchRepository;
    }

    /**
     * Save a pelicula.
     *
     * @param pelicula the entity to save.
     * @return the persisted entity.
     */
    public Pelicula save(Pelicula pelicula) {
        log.debug("Request to save Pelicula : {}", pelicula);
        Pelicula result = peliculaRepository.save(pelicula);
        peliculaSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the peliculas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pelicula> findAll(Pageable pageable) {
        log.debug("Request to get all Peliculas");
        return peliculaRepository.findAll(pageable);
    }

    /**
     * Get all the peliculas with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Pelicula> findAllWithEagerRelationships(Pageable pageable) {
        return peliculaRepository.findAllWithEagerRelationships(pageable);
    }
    


    /**
    *  Get all the peliculas where Estreno is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true) 
    public List<Pelicula> findAllWhereEstrenoIsNull() {
        log.debug("Request to get all peliculas where Estreno is null");
        return StreamSupport
            .stream(peliculaRepository.findAll().spliterator(), false)
            .filter(pelicula -> pelicula.getEstreno() == null)
            .collect(Collectors.toList());
    }

    /**
     * Get one pelicula by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Pelicula> findOne(Long id) {
        log.debug("Request to get Pelicula : {}", id);
        return peliculaRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the pelicula by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Pelicula : {}", id);
        peliculaRepository.deleteById(id);
        peliculaSearchRepository.deleteById(id);
    }

    /**
     * Search for the pelicula corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pelicula> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Peliculas for query {}", query);
        return peliculaSearchRepository.search(queryStringQuery(query), pageable);    }
}
