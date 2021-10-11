import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MyprojectTestModule } from '../../../test.module';
import { PeliculaUpdateComponent } from 'app/entities/pelicula/pelicula-update.component';
import { PeliculaService } from 'app/entities/pelicula/pelicula.service';
import { Pelicula } from 'app/shared/model/pelicula.model';

describe('Component Tests', () => {
  describe('Pelicula Management Update Component', () => {
    let comp: PeliculaUpdateComponent;
    let fixture: ComponentFixture<PeliculaUpdateComponent>;
    let service: PeliculaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [PeliculaUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(PeliculaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PeliculaUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PeliculaService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Pelicula(123);
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
        const entity = new Pelicula();
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
