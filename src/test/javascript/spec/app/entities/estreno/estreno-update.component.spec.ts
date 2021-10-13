import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MyprojectTestModule } from '../../../test.module';
import { EstrenoUpdateComponent } from 'app/entities/estreno/estreno-update.component';
import { EstrenoService } from 'app/entities/estreno/estreno.service';
import { Estreno } from 'app/shared/model/estreno.model';

describe('Component Tests', () => {
  describe('Estreno Management Update Component', () => {
    let comp: EstrenoUpdateComponent;
    let fixture: ComponentFixture<EstrenoUpdateComponent>;
    let service: EstrenoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [EstrenoUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(EstrenoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EstrenoUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EstrenoService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Estreno(123);
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
        const entity = new Estreno();
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
