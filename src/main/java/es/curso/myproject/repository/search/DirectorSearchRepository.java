package es.curso.myproject.repository.search;
import es.curso.myproject.domain.Director;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Director} entity.
 */
public interface DirectorSearchRepository extends ElasticsearchRepository<Director, Long> {
}
