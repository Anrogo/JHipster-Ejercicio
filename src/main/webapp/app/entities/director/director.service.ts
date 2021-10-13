import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IDirector } from 'app/shared/model/director.model';

type EntityResponseType = HttpResponse<IDirector>;
type EntityArrayResponseType = HttpResponse<IDirector[]>;

@Injectable({ providedIn: 'root' })
export class DirectorService {
  public resourceUrl = SERVER_API_URL + 'api/directors';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/directors';

  constructor(protected http: HttpClient) {}

  create(director: IDirector): Observable<EntityResponseType> {
    return this.http.post<IDirector>(this.resourceUrl, director, { observe: 'response' });
  }

  update(director: IDirector): Observable<EntityResponseType> {
    return this.http.put<IDirector>(this.resourceUrl, director, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDirector>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDirector[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDirector[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
