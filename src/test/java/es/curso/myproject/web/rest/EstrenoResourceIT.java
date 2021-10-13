package es.curso.myproject.web.rest;

import es.curso.myproject.MyprojectApp;
import es.curso.myproject.domain.Estreno;
import es.curso.myproject.repository.EstrenoRepository;
import es.curso.myproject.repository.search.EstrenoSearchRepository;
import es.curso.myproject.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static es.curso.myproject.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link EstrenoResource} REST controller.
 */
@SpringBootTest(classes = MyprojectApp.class)
public class EstrenoResourceIT {

    private static final Instant DEFAULT_FECHA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_FECHA = Instant.ofEpochMilli(-1L);

    private static final String DEFAULT_LUGAR = "AAAAAAAAAA";
    private static final String UPDATED_LUGAR = "BBBBBBBBBB";

    @Autowired
    private EstrenoRepository estrenoRepository;

    /**
     * This repository is mocked in the es.curso.myproject.repository.search test package.
     *
     * @see es.curso.myproject.repository.search.EstrenoSearchRepositoryMockConfiguration
     */
    @Autowired
    private EstrenoSearchRepository mockEstrenoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restEstrenoMockMvc;

    private Estreno estreno;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EstrenoResource estrenoResource = new EstrenoResource(estrenoRepository, mockEstrenoSearchRepository);
        this.restEstrenoMockMvc = MockMvcBuilders.standaloneSetup(estrenoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estreno createEntity(EntityManager em) {
        Estreno estreno = new Estreno()
            .fecha(DEFAULT_FECHA)
            .lugar(DEFAULT_LUGAR);
        return estreno;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Estreno createUpdatedEntity(EntityManager em) {
        Estreno estreno = new Estreno()
            .fecha(UPDATED_FECHA)
            .lugar(UPDATED_LUGAR);
        return estreno;
    }

    @BeforeEach
    public void initTest() {
        estreno = createEntity(em);
    }

    @Test
    @Transactional
    public void createEstreno() throws Exception {
        int databaseSizeBeforeCreate = estrenoRepository.findAll().size();

        // Create the Estreno
        restEstrenoMockMvc.perform(post("/api/estrenos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(estreno)))
            .andExpect(status().isCreated());

        // Validate the Estreno in the database
        List<Estreno> estrenoList = estrenoRepository.findAll();
        assertThat(estrenoList).hasSize(databaseSizeBeforeCreate + 1);
        Estreno testEstreno = estrenoList.get(estrenoList.size() - 1);
        assertThat(testEstreno.getFecha()).isEqualTo(DEFAULT_FECHA);
        assertThat(testEstreno.getLugar()).isEqualTo(DEFAULT_LUGAR);

        // Validate the Estreno in Elasticsearch
        verify(mockEstrenoSearchRepository, times(1)).save(testEstreno);
    }

    @Test
    @Transactional
    public void createEstrenoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = estrenoRepository.findAll().size();

        // Create the Estreno with an existing ID
        estreno.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEstrenoMockMvc.perform(post("/api/estrenos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(estreno)))
            .andExpect(status().isBadRequest());

        // Validate the Estreno in the database
        List<Estreno> estrenoList = estrenoRepository.findAll();
        assertThat(estrenoList).hasSize(databaseSizeBeforeCreate);

        // Validate the Estreno in Elasticsearch
        verify(mockEstrenoSearchRepository, times(0)).save(estreno);
    }


    @Test
    @Transactional
    public void getAllEstrenos() throws Exception {
        // Initialize the database
        estrenoRepository.saveAndFlush(estreno);

        // Get all the estrenoList
        restEstrenoMockMvc.perform(get("/api/estrenos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estreno.getId().intValue())))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(DEFAULT_FECHA.toString())))
            .andExpect(jsonPath("$.[*].lugar").value(hasItem(DEFAULT_LUGAR.toString())));
    }
    
    @Test
    @Transactional
    public void getEstreno() throws Exception {
        // Initialize the database
        estrenoRepository.saveAndFlush(estreno);

        // Get the estreno
        restEstrenoMockMvc.perform(get("/api/estrenos/{id}", estreno.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(estreno.getId().intValue()))
            .andExpect(jsonPath("$.fecha").value(DEFAULT_FECHA.toString()))
            .andExpect(jsonPath("$.lugar").value(DEFAULT_LUGAR.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEstreno() throws Exception {
        // Get the estreno
        restEstrenoMockMvc.perform(get("/api/estrenos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEstreno() throws Exception {
        // Initialize the database
        estrenoRepository.saveAndFlush(estreno);

        int databaseSizeBeforeUpdate = estrenoRepository.findAll().size();

        // Update the estreno
        Estreno updatedEstreno = estrenoRepository.findById(estreno.getId()).get();
        // Disconnect from session so that the updates on updatedEstreno are not directly saved in db
        em.detach(updatedEstreno);
        updatedEstreno
            .fecha(UPDATED_FECHA)
            .lugar(UPDATED_LUGAR);

        restEstrenoMockMvc.perform(put("/api/estrenos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEstreno)))
            .andExpect(status().isOk());

        // Validate the Estreno in the database
        List<Estreno> estrenoList = estrenoRepository.findAll();
        assertThat(estrenoList).hasSize(databaseSizeBeforeUpdate);
        Estreno testEstreno = estrenoList.get(estrenoList.size() - 1);
        assertThat(testEstreno.getFecha()).isEqualTo(UPDATED_FECHA);
        assertThat(testEstreno.getLugar()).isEqualTo(UPDATED_LUGAR);

        // Validate the Estreno in Elasticsearch
        verify(mockEstrenoSearchRepository, times(1)).save(testEstreno);
    }

    @Test
    @Transactional
    public void updateNonExistingEstreno() throws Exception {
        int databaseSizeBeforeUpdate = estrenoRepository.findAll().size();

        // Create the Estreno

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEstrenoMockMvc.perform(put("/api/estrenos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(estreno)))
            .andExpect(status().isBadRequest());

        // Validate the Estreno in the database
        List<Estreno> estrenoList = estrenoRepository.findAll();
        assertThat(estrenoList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Estreno in Elasticsearch
        verify(mockEstrenoSearchRepository, times(0)).save(estreno);
    }

    @Test
    @Transactional
    public void deleteEstreno() throws Exception {
        // Initialize the database
        estrenoRepository.saveAndFlush(estreno);

        int databaseSizeBeforeDelete = estrenoRepository.findAll().size();

        // Delete the estreno
        restEstrenoMockMvc.perform(delete("/api/estrenos/{id}", estreno.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Estreno> estrenoList = estrenoRepository.findAll();
        assertThat(estrenoList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Estreno in Elasticsearch
        verify(mockEstrenoSearchRepository, times(1)).deleteById(estreno.getId());
    }

    @Test
    @Transactional
    public void searchEstreno() throws Exception {
        // Initialize the database
        estrenoRepository.saveAndFlush(estreno);
        when(mockEstrenoSearchRepository.search(queryStringQuery("id:" + estreno.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(estreno), PageRequest.of(0, 1), 1));
        // Search the estreno
        restEstrenoMockMvc.perform(get("/api/_search/estrenos?query=id:" + estreno.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(estreno.getId().intValue())))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(DEFAULT_FECHA.toString())))
            .andExpect(jsonPath("$.[*].lugar").value(hasItem(DEFAULT_LUGAR)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estreno.class);
        Estreno estreno1 = new Estreno();
        estreno1.setId(1L);
        Estreno estreno2 = new Estreno();
        estreno2.setId(estreno1.getId());
        assertThat(estreno1).isEqualTo(estreno2);
        estreno2.setId(2L);
        assertThat(estreno1).isNotEqualTo(estreno2);
        estreno1.setId(null);
        assertThat(estreno1).isNotEqualTo(estreno2);
    }
}
