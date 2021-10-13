import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MyprojectTestModule } from '../../../test.module';
import { EstrenoDeleteDialogComponent } from 'app/entities/estreno/estreno-delete-dialog.component';
import { EstrenoService } from 'app/entities/estreno/estreno.service';

describe('Component Tests', () => {
  describe('Estreno Management Delete Component', () => {
    let comp: EstrenoDeleteDialogComponent;
    let fixture: ComponentFixture<EstrenoDeleteDialogComponent>;
    let service: EstrenoService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [EstrenoDeleteDialogComponent]
      })
        .overrideTemplate(EstrenoDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EstrenoDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EstrenoService);
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
