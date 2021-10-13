import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyprojectTestModule } from '../../../test.module';
import { EstrenoDetailComponent } from 'app/entities/estreno/estreno-detail.component';
import { Estreno } from 'app/shared/model/estreno.model';

describe('Component Tests', () => {
  describe('Estreno Management Detail Component', () => {
    let comp: EstrenoDetailComponent;
    let fixture: ComponentFixture<EstrenoDetailComponent>;
    const route = ({ data: of({ estreno: new Estreno(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [EstrenoDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EstrenoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EstrenoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.estreno).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
