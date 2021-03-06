package es.curso.myproject.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link es.curso.myproject.domain.Pelicula} entity. This class is used
 * in {@link es.curso.myproject.web.rest.PeliculaResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /peliculas?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class PeliculaCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter titulo;

    private InstantFilter fechaEstreno;

    private StringFilter descricion;

    private BooleanFilter enCines;

    private LongFilter estrenoId;

    private LongFilter directorId;

    private LongFilter actorId;

    public PeliculaCriteria(){
    }

    public PeliculaCriteria(PeliculaCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.titulo = other.titulo == null ? null : other.titulo.copy();
        this.fechaEstreno = other.fechaEstreno == null ? null : other.fechaEstreno.copy();
        this.descricion = other.descricion == null ? null : other.descricion.copy();
        this.enCines = other.enCines == null ? null : other.enCines.copy();
        this.estrenoId = other.estrenoId == null ? null : other.estrenoId.copy();
        this.directorId = other.directorId == null ? null : other.directorId.copy();
        this.actorId = other.actorId == null ? null : other.actorId.copy();
    }

    @Override
    public PeliculaCriteria copy() {
        return new PeliculaCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getTitulo() {
        return titulo;
    }

    public void setTitulo(StringFilter titulo) {
        this.titulo = titulo;
    }

    public InstantFilter getFechaEstreno() {
        return fechaEstreno;
    }

    public void setFechaEstreno(InstantFilter fechaEstreno) {
        this.fechaEstreno = fechaEstreno;
    }

    public StringFilter getDescricion() {
        return descricion;
    }

    public void setDescricion(StringFilter descricion) {
        this.descricion = descricion;
    }

    public BooleanFilter getEnCines() {
        return enCines;
    }

    public void setEnCines(BooleanFilter enCines) {
        this.enCines = enCines;
    }

    public LongFilter getEstrenoId() {
        return estrenoId;
    }

    public void setEstrenoId(LongFilter estrenoId) {
        this.estrenoId = estrenoId;
    }

    public LongFilter getDirectorId() {
        return directorId;
    }

    public void setDirectorId(LongFilter directorId) {
        this.directorId = directorId;
    }

    public LongFilter getActorId() {
        return actorId;
    }

    public void setActorId(LongFilter actorId) {
        this.actorId = actorId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final PeliculaCriteria that = (PeliculaCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(titulo, that.titulo) &&
            Objects.equals(fechaEstreno, that.fechaEstreno) &&
            Objects.equals(descricion, that.descricion) &&
            Objects.equals(enCines, that.enCines) &&
            Objects.equals(estrenoId, that.estrenoId) &&
            Objects.equals(directorId, that.directorId) &&
            Objects.equals(actorId, that.actorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        titulo,
        fechaEstreno,
        descricion,
        enCines,
        estrenoId,
        directorId,
        actorId
        );
    }

    @Override
    public String toString() {
        return "PeliculaCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (titulo != null ? "titulo=" + titulo + ", " : "") +
                (fechaEstreno != null ? "fechaEstreno=" + fechaEstreno + ", " : "") +
                (descricion != null ? "descricion=" + descricion + ", " : "") +
                (enCines != null ? "enCines=" + enCines + ", " : "") +
                (estrenoId != null ? "estrenoId=" + estrenoId + ", " : "") +
                (directorId != null ? "directorId=" + directorId + ", " : "") +
                (actorId != null ? "actorId=" + actorId + ", " : "") +
            "}";
    }

}
