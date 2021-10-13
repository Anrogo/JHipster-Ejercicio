import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { MyprojectTestModule } from '../../../test.module';
import { DirectorDeleteDialogComponent } from 'app/entities/director/director-delete-dialog.component';
import { DirectorService } from 'app/entities/director/director.service';

describe('Component Tests', () => {
  describe('Director Management Delete Component', () => {
    let comp: DirectorDeleteDialogComponent;
    let fixture: ComponentFixture<DirectorDeleteDialogComponent>;
    let service: DirectorService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [DirectorDeleteDialogComponent]
      })
        .overrideTemplate(DirectorDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DirectorDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DirectorService);
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
