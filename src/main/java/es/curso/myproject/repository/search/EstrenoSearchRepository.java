package es.curso.myproject.repository.search;
import es.curso.myproject.domain.Estreno;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Estreno} entity.
 */
public interface EstrenoSearchRepository extends ElasticsearchRepository<Estreno, Long> {
}
