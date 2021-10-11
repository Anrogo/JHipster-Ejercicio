package es.curso.myproject.web.rest;

import es.curso.myproject.MyprojectApp;
import es.curso.myproject.domain.Pelicula;
import es.curso.myproject.repository.PeliculaRepository;
import es.curso.myproject.repository.search.PeliculaSearchRepository;
import es.curso.myproject.service.PeliculaService;
import es.curso.myproject.web.rest.errors.ExceptionTranslator;
import es.curso.myproject.service.dto.PeliculaCriteria;
import es.curso.myproject.service.PeliculaQueryService;

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
 * Integration tests for the {@link PeliculaResource} REST controller.
 */
@SpringBootTest(classes = MyprojectApp.class)
public class PeliculaResourceIT {

    private static final String DEFAULT_TITULO = "AAAAAAAAAA";
    private static final String UPDATED_TITULO = "BBBBBBBBBB";

    private static final Instant DEFAULT_FECHA_ESTRENO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_ESTRENO = Instant.now().truncatedTo(ChronoUnit.MILLIS);
    private static final Instant SMALLER_FECHA_ESTRENO = Instant.ofEpochMilli(-1L);

    private static final String DEFAULT_DESCRICION = "AAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_DESCRICION = "BBBBBBBBBBBBBBBBBBBB";

    private static final Boolean DEFAULT_EN_CINES = false;
    private static final Boolean UPDATED_EN_CINES = true;

    @Autowired
    private PeliculaRepository peliculaRepository;

    @Autowired
    private PeliculaService peliculaService;

    /**
     * This repository is mocked in the es.curso.myproject.repository.search test package.
     *
     * @see es.curso.myproject.repository.search.PeliculaSearchRepositoryMockConfiguration
     */
    @Autowired
    private PeliculaSearchRepository mockPeliculaSearchRepository;

    @Autowired
    private PeliculaQueryService peliculaQueryService;

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

    private MockMvc restPeliculaMockMvc;

    private Pelicula pelicula;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final PeliculaResource peliculaResource = new PeliculaResource(peliculaService, peliculaQueryService);
        this.restPeliculaMockMvc = MockMvcBuilders.standaloneSetup(peliculaResource)
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
    public static Pelicula createEntity(EntityManager em) {
        Pelicula pelicula = new Pelicula()
            .titulo(DEFAULT_TITULO)
            .fechaEstreno(DEFAULT_FECHA_ESTRENO)
            .descricion(DEFAULT_DESCRICION)
            .enCines(DEFAULT_EN_CINES);
        return pelicula;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Pelicula createUpdatedEntity(EntityManager em) {
        Pelicula pelicula = new Pelicula()
            .titulo(UPDATED_TITULO)
            .fechaEstreno(UPDATED_FECHA_ESTRENO)
            .descricion(UPDATED_DESCRICION)
            .enCines(UPDATED_EN_CINES);
        return pelicula;
    }

    @BeforeEach
    public void initTest() {
        pelicula = createEntity(em);
    }

    @Test
    @Transactional
    public void createPelicula() throws Exception {
        int databaseSizeBeforeCreate = peliculaRepository.findAll().size();

        // Create the Pelicula
        restPeliculaMockMvc.perform(post("/api/peliculas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pelicula)))
            .andExpect(status().isCreated());

        // Validate the Pelicula in the database
        List<Pelicula> peliculaList = peliculaRepository.findAll();
        assertThat(peliculaList).hasSize(databaseSizeBeforeCreate + 1);
        Pelicula testPelicula = peliculaList.get(peliculaList.size() - 1);
        assertThat(testPelicula.getTitulo()).isEqualTo(DEFAULT_TITULO);
        assertThat(testPelicula.getFechaEstreno()).isEqualTo(DEFAULT_FECHA_ESTRENO);
        assertThat(testPelicula.getDescricion()).isEqualTo(DEFAULT_DESCRICION);
        assertThat(testPelicula.isEnCines()).isEqualTo(DEFAULT_EN_CINES);

        // Validate the Pelicula in Elasticsearch
        verify(mockPeliculaSearchRepository, times(1)).save(testPelicula);
    }

    @Test
    @Transactional
    public void createPeliculaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = peliculaRepository.findAll().size();

        // Create the Pelicula with an existing ID
        pelicula.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPeliculaMockMvc.perform(post("/api/peliculas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pelicula)))
            .andExpect(status().isBadRequest());

        // Validate the Pelicula in the database
        List<Pelicula> peliculaList = peliculaRepository.findAll();
        assertThat(peliculaList).hasSize(databaseSizeBeforeCreate);

        // Validate the Pelicula in Elasticsearch
        verify(mockPeliculaSearchRepository, times(0)).save(pelicula);
    }


    @Test
    @Transactional
    public void checkTituloIsRequired() throws Exception {
        int databaseSizeBeforeTest = peliculaRepository.findAll().size();
        // set the field null
        pelicula.setTitulo(null);

        // Create the Pelicula, which fails.

        restPeliculaMockMvc.perform(post("/api/peliculas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pelicula)))
            .andExpect(status().isBadRequest());

        List<Pelicula> peliculaList = peliculaRepository.findAll();
        assertThat(peliculaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPeliculas() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList
        restPeliculaMockMvc.perform(get("/api/peliculas?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pelicula.getId().intValue())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO.toString())))
            .andExpect(jsonPath("$.[*].fechaEstreno").value(hasItem(DEFAULT_FECHA_ESTRENO.toString())))
            .andExpect(jsonPath("$.[*].descricion").value(hasItem(DEFAULT_DESCRICION.toString())))
            .andExpect(jsonPath("$.[*].enCines").value(hasItem(DEFAULT_EN_CINES.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getPelicula() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get the pelicula
        restPeliculaMockMvc.perform(get("/api/peliculas/{id}", pelicula.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(pelicula.getId().intValue()))
            .andExpect(jsonPath("$.titulo").value(DEFAULT_TITULO.toString()))
            .andExpect(jsonPath("$.fechaEstreno").value(DEFAULT_FECHA_ESTRENO.toString()))
            .andExpect(jsonPath("$.descricion").value(DEFAULT_DESCRICION.toString()))
            .andExpect(jsonPath("$.enCines").value(DEFAULT_EN_CINES.booleanValue()));
    }

    @Test
    @Transactional
    public void getAllPeliculasByTituloIsEqualToSomething() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where titulo equals to DEFAULT_TITULO
        defaultPeliculaShouldBeFound("titulo.equals=" + DEFAULT_TITULO);

        // Get all the peliculaList where titulo equals to UPDATED_TITULO
        defaultPeliculaShouldNotBeFound("titulo.equals=" + UPDATED_TITULO);
    }

    @Test
    @Transactional
    public void getAllPeliculasByTituloIsInShouldWork() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where titulo in DEFAULT_TITULO or UPDATED_TITULO
        defaultPeliculaShouldBeFound("titulo.in=" + DEFAULT_TITULO + "," + UPDATED_TITULO);

        // Get all the peliculaList where titulo equals to UPDATED_TITULO
        defaultPeliculaShouldNotBeFound("titulo.in=" + UPDATED_TITULO);
    }

    @Test
    @Transactional
    public void getAllPeliculasByTituloIsNullOrNotNull() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where titulo is not null
        defaultPeliculaShouldBeFound("titulo.specified=true");

        // Get all the peliculaList where titulo is null
        defaultPeliculaShouldNotBeFound("titulo.specified=false");
    }

    @Test
    @Transactional
    public void getAllPeliculasByFechaEstrenoIsEqualToSomething() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where fechaEstreno equals to DEFAULT_FECHA_ESTRENO
        defaultPeliculaShouldBeFound("fechaEstreno.equals=" + DEFAULT_FECHA_ESTRENO);

        // Get all the peliculaList where fechaEstreno equals to UPDATED_FECHA_ESTRENO
        defaultPeliculaShouldNotBeFound("fechaEstreno.equals=" + UPDATED_FECHA_ESTRENO);
    }

    @Test
    @Transactional
    public void getAllPeliculasByFechaEstrenoIsInShouldWork() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where fechaEstreno in DEFAULT_FECHA_ESTRENO or UPDATED_FECHA_ESTRENO
        defaultPeliculaShouldBeFound("fechaEstreno.in=" + DEFAULT_FECHA_ESTRENO + "," + UPDATED_FECHA_ESTRENO);

        // Get all the peliculaList where fechaEstreno equals to UPDATED_FECHA_ESTRENO
        defaultPeliculaShouldNotBeFound("fechaEstreno.in=" + UPDATED_FECHA_ESTRENO);
    }

    @Test
    @Transactional
    public void getAllPeliculasByFechaEstrenoIsNullOrNotNull() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where fechaEstreno is not null
        defaultPeliculaShouldBeFound("fechaEstreno.specified=true");

        // Get all the peliculaList where fechaEstreno is null
        defaultPeliculaShouldNotBeFound("fechaEstreno.specified=false");
    }

    @Test
    @Transactional
    public void getAllPeliculasByDescricionIsEqualToSomething() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where descricion equals to DEFAULT_DESCRICION
        defaultPeliculaShouldBeFound("descricion.equals=" + DEFAULT_DESCRICION);

        // Get all the peliculaList where descricion equals to UPDATED_DESCRICION
        defaultPeliculaShouldNotBeFound("descricion.equals=" + UPDATED_DESCRICION);
    }

    @Test
    @Transactional
    public void getAllPeliculasByDescricionIsInShouldWork() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where descricion in DEFAULT_DESCRICION or UPDATED_DESCRICION
        defaultPeliculaShouldBeFound("descricion.in=" + DEFAULT_DESCRICION + "," + UPDATED_DESCRICION);

        // Get all the peliculaList where descricion equals to UPDATED_DESCRICION
        defaultPeliculaShouldNotBeFound("descricion.in=" + UPDATED_DESCRICION);
    }

    @Test
    @Transactional
    public void getAllPeliculasByDescricionIsNullOrNotNull() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where descricion is not null
        defaultPeliculaShouldBeFound("descricion.specified=true");

        // Get all the peliculaList where descricion is null
        defaultPeliculaShouldNotBeFound("descricion.specified=false");
    }

    @Test
    @Transactional
    public void getAllPeliculasByEnCinesIsEqualToSomething() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where enCines equals to DEFAULT_EN_CINES
        defaultPeliculaShouldBeFound("enCines.equals=" + DEFAULT_EN_CINES);

        // Get all the peliculaList where enCines equals to UPDATED_EN_CINES
        defaultPeliculaShouldNotBeFound("enCines.equals=" + UPDATED_EN_CINES);
    }

    @Test
    @Transactional
    public void getAllPeliculasByEnCinesIsInShouldWork() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where enCines in DEFAULT_EN_CINES or UPDATED_EN_CINES
        defaultPeliculaShouldBeFound("enCines.in=" + DEFAULT_EN_CINES + "," + UPDATED_EN_CINES);

        // Get all the peliculaList where enCines equals to UPDATED_EN_CINES
        defaultPeliculaShouldNotBeFound("enCines.in=" + UPDATED_EN_CINES);
    }

    @Test
    @Transactional
    public void getAllPeliculasByEnCinesIsNullOrNotNull() throws Exception {
        // Initialize the database
        peliculaRepository.saveAndFlush(pelicula);

        // Get all the peliculaList where enCines is not null
        defaultPeliculaShouldBeFound("enCines.specified=true");

        // Get all the peliculaList where enCines is null
        defaultPeliculaShouldNotBeFound("enCines.specified=false");
    }
    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultPeliculaShouldBeFound(String filter) throws Exception {
        restPeliculaMockMvc.perform(get("/api/peliculas?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pelicula.getId().intValue())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].fechaEstreno").value(hasItem(DEFAULT_FECHA_ESTRENO.toString())))
            .andExpect(jsonPath("$.[*].descricion").value(hasItem(DEFAULT_DESCRICION)))
            .andExpect(jsonPath("$.[*].enCines").value(hasItem(DEFAULT_EN_CINES.booleanValue())));

        // Check, that the count call also returns 1
        restPeliculaMockMvc.perform(get("/api/peliculas/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultPeliculaShouldNotBeFound(String filter) throws Exception {
        restPeliculaMockMvc.perform(get("/api/peliculas?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restPeliculaMockMvc.perform(get("/api/peliculas/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingPelicula() throws Exception {
        // Get the pelicula
        restPeliculaMockMvc.perform(get("/api/peliculas/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePelicula() throws Exception {
        // Initialize the database
        peliculaService.save(pelicula);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockPeliculaSearchRepository);

        int databaseSizeBeforeUpdate = peliculaRepository.findAll().size();

        // Update the pelicula
        Pelicula updatedPelicula = peliculaRepository.findById(pelicula.getId()).get();
        // Disconnect from session so that the updates on updatedPelicula are not directly saved in db
        em.detach(updatedPelicula);
        updatedPelicula
            .titulo(UPDATED_TITULO)
            .fechaEstreno(UPDATED_FECHA_ESTRENO)
            .descricion(UPDATED_DESCRICION)
            .enCines(UPDATED_EN_CINES);

        restPeliculaMockMvc.perform(put("/api/peliculas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPelicula)))
            .andExpect(status().isOk());

        // Validate the Pelicula in the database
        List<Pelicula> peliculaList = peliculaRepository.findAll();
        assertThat(peliculaList).hasSize(databaseSizeBeforeUpdate);
        Pelicula testPelicula = peliculaList.get(peliculaList.size() - 1);
        assertThat(testPelicula.getTitulo()).isEqualTo(UPDATED_TITULO);
        assertThat(testPelicula.getFechaEstreno()).isEqualTo(UPDATED_FECHA_ESTRENO);
        assertThat(testPelicula.getDescricion()).isEqualTo(UPDATED_DESCRICION);
        assertThat(testPelicula.isEnCines()).isEqualTo(UPDATED_EN_CINES);

        // Validate the Pelicula in Elasticsearch
        verify(mockPeliculaSearchRepository, times(1)).save(testPelicula);
    }

    @Test
    @Transactional
    public void updateNonExistingPelicula() throws Exception {
        int databaseSizeBeforeUpdate = peliculaRepository.findAll().size();

        // Create the Pelicula

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPeliculaMockMvc.perform(put("/api/peliculas")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(pelicula)))
            .andExpect(status().isBadRequest());

        // Validate the Pelicula in the database
        List<Pelicula> peliculaList = peliculaRepository.findAll();
        assertThat(peliculaList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Pelicula in Elasticsearch
        verify(mockPeliculaSearchRepository, times(0)).save(pelicula);
    }

    @Test
    @Transactional
    public void deletePelicula() throws Exception {
        // Initialize the database
        peliculaService.save(pelicula);

        int databaseSizeBeforeDelete = peliculaRepository.findAll().size();

        // Delete the pelicula
        restPeliculaMockMvc.perform(delete("/api/peliculas/{id}", pelicula.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Pelicula> peliculaList = peliculaRepository.findAll();
        assertThat(peliculaList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Pelicula in Elasticsearch
        verify(mockPeliculaSearchRepository, times(1)).deleteById(pelicula.getId());
    }

    @Test
    @Transactional
    public void searchPelicula() throws Exception {
        // Initialize the database
        peliculaService.save(pelicula);
        when(mockPeliculaSearchRepository.search(queryStringQuery("id:" + pelicula.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(pelicula), PageRequest.of(0, 1), 1));
        // Search the pelicula
        restPeliculaMockMvc.perform(get("/api/_search/peliculas?query=id:" + pelicula.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(pelicula.getId().intValue())))
            .andExpect(jsonPath("$.[*].titulo").value(hasItem(DEFAULT_TITULO)))
            .andExpect(jsonPath("$.[*].fechaEstreno").value(hasItem(DEFAULT_FECHA_ESTRENO.toString())))
            .andExpect(jsonPath("$.[*].descricion").value(hasItem(DEFAULT_DESCRICION)))
            .andExpect(jsonPath("$.[*].enCines").value(hasItem(DEFAULT_EN_CINES.booleanValue())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pelicula.class);
        Pelicula pelicula1 = new Pelicula();
        pelicula1.setId(1L);
        Pelicula pelicula2 = new Pelicula();
        pelicula2.setId(pelicula1.getId());
        assertThat(pelicula1).isEqualTo(pelicula2);
        pelicula2.setId(2L);
        assertThat(pelicula1).isNotEqualTo(pelicula2);
        pelicula1.setId(null);
        assertThat(pelicula1).isNotEqualTo(pelicula2);
    }
}
