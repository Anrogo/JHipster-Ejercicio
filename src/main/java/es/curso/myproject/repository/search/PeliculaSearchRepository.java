package es.curso.myproject.repository.search;
import es.curso.myproject.domain.Pelicula;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Pelicula} entity.
 */
public interface PeliculaSearchRepository extends ElasticsearchRepository<Pelicula, Long> {
}
