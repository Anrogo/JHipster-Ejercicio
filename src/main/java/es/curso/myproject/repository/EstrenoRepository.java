package es.curso.myproject.repository;
import es.curso.myproject.domain.Estreno;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Estreno entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstrenoRepository extends JpaRepository<Estreno, Long> {

}
