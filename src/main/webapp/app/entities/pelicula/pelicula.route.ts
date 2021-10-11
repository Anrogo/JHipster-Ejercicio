import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Pelicula } from 'app/shared/model/pelicula.model';
import { PeliculaService } from './pelicula.service';
import { PeliculaComponent } from './pelicula.component';
import { PeliculaDetailComponent } from './pelicula-detail.component';
import { PeliculaUpdateComponent } from './pelicula-update.component';
import { PeliculaDeletePopupComponent } from './pelicula-delete-dialog.component';
import { IPelicula } from 'app/shared/model/pelicula.model';

@Injectable({ providedIn: 'root' })
export class PeliculaResolve implements Resolve<IPelicula> {
  constructor(private service: PeliculaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPelicula> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Pelicula>) => response.ok),
        map((pelicula: HttpResponse<Pelicula>) => pelicula.body)
      );
    }
    return of(new Pelicula());
  }
}

export const peliculaRoute: Routes = [
  {
    path: '',
    component: PeliculaComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'Peliculas'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: PeliculaDetailComponent,
    resolve: {
      pelicula: PeliculaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Peliculas'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: PeliculaUpdateComponent,
    resolve: {
      pelicula: PeliculaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Peliculas'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: PeliculaUpdateComponent,
    resolve: {
      pelicula: PeliculaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Peliculas'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const peliculaPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: PeliculaDeletePopupComponent,
    resolve: {
      pelicula: PeliculaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Peliculas'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
