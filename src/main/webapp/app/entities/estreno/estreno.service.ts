import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEstreno } from 'app/shared/model/estreno.model';

type EntityResponseType = HttpResponse<IEstreno>;
type EntityArrayResponseType = HttpResponse<IEstreno[]>;

@Injectable({ providedIn: 'root' })
export class EstrenoService {
  public resourceUrl = SERVER_API_URL + 'api/estrenos';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/estrenos';

  constructor(protected http: HttpClient) {}

  create(estreno: IEstreno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estreno);
    return this.http
      .post<IEstreno>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(estreno: IEstreno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estreno);
    return this.http
      .put<IEstreno>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEstreno>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEstreno[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEstreno[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  protected convertDateFromClient(estreno: IEstreno): IEstreno {
    const copy: IEstreno = Object.assign({}, estreno, {
      fecha: estreno.fecha != null && estreno.fecha.isValid() ? estreno.fecha.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha != null ? moment(res.body.fecha) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((estreno: IEstreno) => {
        estreno.fecha = estreno.fecha != null ? moment(estreno.fecha) : null;
      });
    }
    return res;
  }
}
