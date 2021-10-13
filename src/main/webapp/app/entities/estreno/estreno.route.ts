import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Estreno } from 'app/shared/model/estreno.model';
import { EstrenoService } from './estreno.service';
import { EstrenoComponent } from './estreno.component';
import { EstrenoDetailComponent } from './estreno-detail.component';
import { EstrenoUpdateComponent } from './estreno-update.component';
import { EstrenoDeletePopupComponent } from './estreno-delete-dialog.component';
import { IEstreno } from 'app/shared/model/estreno.model';

@Injectable({ providedIn: 'root' })
export class EstrenoResolve implements Resolve<IEstreno> {
  constructor(private service: EstrenoService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IEstreno> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Estreno>) => response.ok),
        map((estreno: HttpResponse<Estreno>) => estreno.body)
      );
    }
    return of(new Estreno());
  }
}

export const estrenoRoute: Routes = [
  {
    path: '',
    component: EstrenoComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'Estrenos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: EstrenoDetailComponent,
    resolve: {
      estreno: EstrenoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Estrenos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: EstrenoUpdateComponent,
    resolve: {
      estreno: EstrenoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Estrenos'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: EstrenoUpdateComponent,
    resolve: {
      estreno: EstrenoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Estrenos'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const estrenoPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: EstrenoDeletePopupComponent,
    resolve: {
      estreno: EstrenoResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Estrenos'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
