package es.curso.myproject.repository.search;
import es.curso.myproject.domain.Categoria;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Categoria} entity.
 */
public interface CategoriaSearchRepository extends ElasticsearchRepository<Categoria, Long> {
}
