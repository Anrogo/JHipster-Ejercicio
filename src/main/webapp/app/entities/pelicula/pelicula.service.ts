import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPelicula } from 'app/shared/model/pelicula.model';

type EntityResponseType = HttpResponse<IPelicula>;
type EntityArrayResponseType = HttpResponse<IPelicula[]>;

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  public resourceUrl = SERVER_API_URL + 'api/peliculas';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/peliculas';

  constructor(protected http: HttpClient) {}

  create(pelicula: IPelicula): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pelicula);
    return this.http
      .post<IPelicula>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pelicula: IPelicula): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pelicula);
    return this.http
      .put<IPelicula>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPelicula>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPelicula[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPelicula[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(pelicula: IPelicula): IPelicula {
    const copy: IPelicula = Object.assign({}, pelicula, {
      fechaEstreno: pelicula.fechaEstreno != null && pelicula.fechaEstreno.isValid() ? pelicula.fechaEstreno.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaEstreno = res.body.fechaEstreno != null ? moment(res.body.fechaEstreno) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pelicula: IPelicula) => {
        pelicula.fechaEstreno = pelicula.fechaEstreno != null ? moment(pelicula.fechaEstreno) : null;
      });
    }
    return res;
  }
}
