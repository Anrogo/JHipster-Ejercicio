import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MyprojectTestModule } from '../../../test.module';
import { DirectorDetailComponent } from 'app/entities/director/director-detail.component';
import { Director } from 'app/shared/model/director.model';

describe('Component Tests', () => {
  describe('Director Management Detail Component', () => {
    let comp: DirectorDetailComponent;
    let fixture: ComponentFixture<DirectorDetailComponent>;
    const route = ({ data: of({ director: new Director(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MyprojectTestModule],
        declarations: [DirectorDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DirectorDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DirectorDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.director).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
