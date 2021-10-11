import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { PeliculaService } from 'app/entities/pelicula/pelicula.service';
import { IPelicula, Pelicula } from 'app/shared/model/pelicula.model';

describe('Service Tests', () => {
  describe('Pelicula Service', () => {
    let injector: TestBed;
    let service: PeliculaService;
    let httpMock: HttpTestingController;
    let elemDefault: IPelicula;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(PeliculaService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Pelicula(0, 'AAAAAAA', currentDate, 'AAAAAAA', false);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fechaEstreno: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a Pelicula', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            fechaEstreno: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            fechaEstreno: currentDate
          },
          returnedFromService
        );
        service
          .create(new Pelicula(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Pelicula', () => {
        const returnedFromService = Object.assign(
          {
            titulo: 'BBBBBB',
            fechaEstreno: currentDate.format(DATE_TIME_FORMAT),
            descricion: 'BBBBBB',
            enCines: true
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaEstreno: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of Pelicula', () => {
        const returnedFromService = Object.assign(
          {
            titulo: 'BBBBBB',
            fechaEstreno: currentDate.format(DATE_TIME_FORMAT),
            descricion: 'BBBBBB',
            enCines: true
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            fechaEstreno: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Pelicula', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
