package es.curso.myproject.web.rest;

import es.curso.myproject.domain.Estreno;
import es.curso.myproject.repository.EstrenoRepository;
import es.curso.myproject.repository.search.EstrenoSearchRepository;
import es.curso.myproject.web.rest.errors.BadRequestAlertException;

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
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link es.curso.myproject.domain.Estreno}.
 */
@RestController
@RequestMapping("/api")
public class EstrenoResource {

    private final Logger log = LoggerFactory.getLogger(EstrenoResource.class);

    private static final String ENTITY_NAME = "estreno";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EstrenoRepository estrenoRepository;

    private final EstrenoSearchRepository estrenoSearchRepository;

    public EstrenoResource(EstrenoRepository estrenoRepository, EstrenoSearchRepository estrenoSearchRepository) {
        this.estrenoRepository = estrenoRepository;
        this.estrenoSearchRepository = estrenoSearchRepository;
    }

    /**
     * {@code POST  /estrenos} : Create a new estreno.
     *
     * @param estreno the estreno to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new estreno, or with status {@code 400 (Bad Request)} if the estreno has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/estrenos")
    public ResponseEntity<Estreno> createEstreno(@Valid @RequestBody Estreno estreno) throws URISyntaxException {
        log.debug("REST request to save Estreno : {}", estreno);
        if (estreno.getId() != null) {
            throw new BadRequestAlertException("A new estreno cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Estreno result = estrenoRepository.save(estreno);
        estrenoSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/estrenos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /estrenos} : Updates an existing estreno.
     *
     * @param estreno the estreno to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated estreno,
     * or with status {@code 400 (Bad Request)} if the estreno is not valid,
     * or with status {@code 500 (Internal Server Error)} if the estreno couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/estrenos")
    public ResponseEntity<Estreno> updateEstreno(@Valid @RequestBody Estreno estreno) throws URISyntaxException {
        log.debug("REST request to update Estreno : {}", estreno);
        if (estreno.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Estreno result = estrenoRepository.save(estreno);
        estrenoSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, estreno.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /estrenos} : get all the estrenos.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of estrenos in body.
     */
    @GetMapping("/estrenos")
    public ResponseEntity<List<Estreno>> getAllEstrenos(Pageable pageable) {
        log.debug("REST request to get a page of Estrenos");
        Page<Estreno> page = estrenoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /estrenos/:id} : get the "id" estreno.
     *
     * @param id the id of the estreno to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the estreno, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/estrenos/{id}")
    public ResponseEntity<Estreno> getEstreno(@PathVariable Long id) {
        log.debug("REST request to get Estreno : {}", id);
        Optional<Estreno> estreno = estrenoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(estreno);
    }

    /**
     * {@code DELETE  /estrenos/:id} : delete the "id" estreno.
     *
     * @param id the id of the estreno to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/estrenos/{id}")
    public ResponseEntity<Void> deleteEstreno(@PathVariable Long id) {
        log.debug("REST request to delete Estreno : {}", id);
        estrenoRepository.deleteById(id);
        estrenoSearchRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/estrenos?query=:query} : search for the estreno corresponding
     * to the query.
     *
     * @param query the query of the estreno search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/estrenos")
    public ResponseEntity<List<Estreno>> searchEstrenos(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Estrenos for query {}", query);
        Page<Estreno> page = estrenoSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
