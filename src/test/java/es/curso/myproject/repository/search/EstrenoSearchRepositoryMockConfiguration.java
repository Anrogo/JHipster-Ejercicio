package es.curso.myproject.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link EstrenoSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class EstrenoSearchRepositoryMockConfiguration {

    @MockBean
    private EstrenoSearchRepository mockEstrenoSearchRepository;

}
