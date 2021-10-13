package es.curso.myproject.repository.search;
import es.curso.myproject.domain.Actor;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Actor} entity.
 */
public interface ActorSearchRepository extends ElasticsearchRepository<Actor, Long> {
}
