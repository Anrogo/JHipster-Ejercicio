package es.curso.myproject.web.rest;

import es.curso.myproject.domain.Pelicula;
import es.curso.myproject.service.PeliculaService;
import es.curso.myproject.web.rest.errors.BadRequestAlertException;
import es.curso.myproject.service.dto.PeliculaCriteria;
import es.curso.myproject.service.PeliculaQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link es.curso.myproject.domain.Pelicula}.
 */
@RestController
@RequestMapping("/api")
public class PeliculaResource {

    private final Logger log = LoggerFactory.getLogger(PeliculaResource.class);

    private static final String ENTITY_NAME = "pelicula";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PeliculaService peliculaService;

    private final PeliculaQueryService peliculaQueryService;

    public PeliculaResource(PeliculaService peliculaService, PeliculaQueryService peliculaQueryService) {
        this.peliculaService = peliculaService;
        this.peliculaQueryService = peliculaQueryService;
    }

    /**
     * {@code POST  /peliculas} : Create a new pelicula.
     *
     * @param pelicula the pelicula to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pelicula, or with status {@code 400 (Bad Request)} if the pelicula has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/peliculas")
    public ResponseEntity<Pelicula> createPelicula(@Valid @RequestBody Pelicula pelicula) throws URISyntaxException {
        log.debug("REST request to save Pelicula : {}", pelicula);
        if (pelicula.getId() != null) {
            throw new BadRequestAlertException("A new pelicula cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pelicula result = peliculaService.save(pelicula);
        return ResponseEntity.created(new URI("/api/peliculas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /peliculas} : Updates an existing pelicula.
     *
     * @param pelicula the pelicula to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pelicula,
     * or with status {@code 400 (Bad Request)} if the pelicula is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pelicula couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/peliculas")
    public ResponseEntity<Pelicula> updatePelicula(@Valid @RequestBody Pelicula pelicula) throws URISyntaxException {
        log.debug("REST request to update Pelicula : {}", pelicula);
        if (pelicula.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Pelicula result = peliculaService.save(pelicula);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, pelicula.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /peliculas} : get all the peliculas.
     *

     * @param pageable the pagination information.

     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of peliculas in body.
     */
    @GetMapping("/peliculas")
    public ResponseEntity<List<Pelicula>> getAllPeliculas(PeliculaCriteria criteria, Pageable pageable) {
        log.debug("REST request to get Peliculas by criteria: {}", criteria);
        Page<Pelicula> page = peliculaQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
    * {@code GET  /peliculas/count} : count all the peliculas.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
    @GetMapping("/peliculas/count")
    public ResponseEntity<Long> countPeliculas(PeliculaCriteria criteria) {
        log.debug("REST request to count Peliculas by criteria: {}", criteria);
        return ResponseEntity.ok().body(peliculaQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /peliculas/:id} : get the "id" pelicula.
     *
     * @param id the id of the pelicula to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pelicula, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/peliculas/{id}")
    public ResponseEntity<Pelicula> getPelicula(@PathVariable Long id) {
        log.debug("REST request to get Pelicula : {}", id);
        Optional<Pelicula> pelicula = peliculaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(pelicula);
    }

    /**
     * {@code DELETE  /peliculas/:id} : delete the "id" pelicula.
     *
     * @param id the id of the pelicula to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/peliculas/{id}")
    public ResponseEntity<Void> deletePelicula(@PathVariable Long id) {
        log.debug("REST request to delete Pelicula : {}", id);
        peliculaService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/peliculas?query=:query} : search for the pelicula corresponding
     * to the query.
     *
     * @param query the query of the pelicula search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/peliculas")
    public ResponseEntity<List<Pelicula>> searchPeliculas(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Peliculas for query {}", query);
        Page<Pelicula> page = peliculaService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
