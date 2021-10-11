import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MyprojectTestModule } from '../../../test.module';
import { PeliculaDeleteDialogComponent } from 'app/entities/pelicula/pelicula-delete-dialog.component';
import { PeliculaService } from 'app/entities/pelicula/pelicula.service';

describe('Component Tests', () => {
  describe('Pelicula Management Delete Component', () => {
    let comp: PeliculaDeleteDialogComponent;
    let fixture: ComponentFixture<PeliculaDeleteDialogComponent>;
    let service: PeliculaService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [PeliculaDeleteDialogComponent]
      })
        .overrideTemplate(PeliculaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PeliculaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PeliculaService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
