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

/**
 * Criteria class for the {@link es.curso.myproject.domain.Actor} entity. This class is used
 * in {@link es.curso.myproject.web.rest.ActorResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /actors?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ActorCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter nombre;

    private StringFilter apellidos;

    private LongFilter peliculaId;

    public ActorCriteria(){
    }

    public ActorCriteria(ActorCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.nombre = other.nombre == null ? null : other.nombre.copy();
        this.apellidos = other.apellidos == null ? null : other.apellidos.copy();
        this.peliculaId = other.peliculaId == null ? null : other.peliculaId.copy();
    }

    @Override
    public ActorCriteria copy() {
        return new ActorCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getNombre() {
        return nombre;
    }

    public void setNombre(StringFilter nombre) {
        this.nombre = nombre;
    }

    public StringFilter getApellidos() {
        return apellidos;
    }

    public void setApellidos(StringFilter apellidos) {
        this.apellidos = apellidos;
    }

    public LongFilter getPeliculaId() {
        return peliculaId;
    }

    public void setPeliculaId(LongFilter peliculaId) {
        this.peliculaId = peliculaId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ActorCriteria that = (ActorCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(nombre, that.nombre) &&
            Objects.equals(apellidos, that.apellidos) &&
            Objects.equals(peliculaId, that.peliculaId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        nombre,
        apellidos,
        peliculaId
        );
    }

    @Override
    public String toString() {
        return "ActorCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (nombre != null ? "nombre=" + nombre + ", " : "") +
                (apellidos != null ? "apellidos=" + apellidos + ", " : "") +
                (peliculaId != null ? "peliculaId=" + peliculaId + ", " : "") +
            "}";
    }

}
