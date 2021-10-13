import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MyprojectTestModule } from '../../../test.module';
import { DirectorUpdateComponent } from 'app/entities/director/director-update.component';
import { DirectorService } from 'app/entities/director/director.service';
import { Director } from 'app/shared/model/director.model';

describe('Component Tests', () => {
  describe('Director Management Update Component', () => {
    let comp: DirectorUpdateComponent;
    let fixture: ComponentFixture<DirectorUpdateComponent>;
    let service: DirectorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [DirectorUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DirectorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DirectorUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DirectorService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Director(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Director();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
