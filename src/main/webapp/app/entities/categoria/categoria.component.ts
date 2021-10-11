import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ICategoria } from 'app/shared/model/categoria.model';
import { AccountService } from 'app/core/auth/account.service';
import { CategoriaService } from './categoria.service';

@Component({
  selector: 'jhi-categoria',
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent implements OnInit, OnDestroy {
  categorias: ICategoria[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected categoriaService: CategoriaService,
    protected jhiAlertService: JhiAlertService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.categoriaService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICategoria[]>) => res.ok),
          map((res: HttpResponse<ICategoria[]>) => res.body)
        )
        .subscribe((res: ICategoria[]) => (this.categorias = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.categoriaService
      .query()
      .pipe(
        filter((res: HttpResponse<ICategoria[]>) => res.ok),
        map((res: HttpResponse<ICategoria[]>) => res.body)
      )
      .subscribe(
        (res: ICategoria[]) => {
          this.categorias = res;
          this.currentSearch = '';
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCategorias();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategoria) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInCategorias() {
    this.eventSubscriber = this.eventManager.subscribe('categoriaListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
