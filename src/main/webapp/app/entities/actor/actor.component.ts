import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IActor } from 'app/shared/model/actor.model';
import { AccountService } from 'app/core/auth/account.service';
import { ActorService } from './actor.service';

@Component({
  selector: 'jhi-actor',
  templateUrl: './actor.component.html'
})
export class ActorComponent implements OnInit, OnDestroy {
  actors: IActor[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected actorService: ActorService,
    protected jhiAlertService: JhiAlertService,
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
      this.actorService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<IActor[]>) => res.ok),
          map((res: HttpResponse<IActor[]>) => res.body)
        )
        .subscribe((res: IActor[]) => (this.actors = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.actorService
      .query()
      .pipe(
        filter((res: HttpResponse<IActor[]>) => res.ok),
        map((res: HttpResponse<IActor[]>) => res.body)
      )
      .subscribe(
        (res: IActor[]) => {
          this.actors = res;
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
    this.registerChangeInActors();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IActor) {
    return item.id;
  }

  registerChangeInActors() {
    this.eventSubscriber = this.eventManager.subscribe('actorListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
