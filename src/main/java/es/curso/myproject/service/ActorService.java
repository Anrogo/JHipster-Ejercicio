package es.curso.myproject.service;

import es.curso.myproject.domain.Actor;
import es.curso.myproject.repository.ActorRepository;
import es.curso.myproject.repository.search.ActorSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Actor}.
 */
@Service
@Transactional
public class ActorService {

    private final Logger log = LoggerFactory.getLogger(ActorService.class);

    private final ActorRepository actorRepository;

    private final ActorSearchRepository actorSearchRepository;

    public ActorService(ActorRepository actorRepository, ActorSearchRepository actorSearchRepository) {
        this.actorRepository = actorRepository;
        this.actorSearchRepository = actorSearchRepository;
    }

    /**
     * Save a actor.
     *
     * @param actor the entity to save.
     * @return the persisted entity.
     */
    public Actor save(Actor actor) {
        log.debug("Request to save Actor : {}", actor);
        Actor result = actorRepository.save(actor);
        actorSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the actors.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Actor> findAll() {
        log.debug("Request to get all Actors");
        return actorRepository.findAll();
    }


    /**
     * Get one actor by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Actor> findOne(Long id) {
        log.debug("Request to get Actor : {}", id);
        return actorRepository.findById(id);
    }

    /**
     * Delete the actor by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Actor : {}", id);
        actorRepository.deleteById(id);
        actorSearchRepository.deleteById(id);
    }

    /**
     * Search for the actor corresponding to the query.
     *
     * @param query the query of the search.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Actor> search(String query) {
        log.debug("Request to search Actors for query {}", query);
        return StreamSupport
            .stream(actorSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }
}
