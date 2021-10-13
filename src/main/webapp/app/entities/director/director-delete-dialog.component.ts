import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDirector } from 'app/shared/model/director.model';
import { DirectorService } from './director.service';

@Component({
  selector: 'jhi-director-delete-dialog',
  templateUrl: './director-delete-dialog.component.html'
})
export class DirectorDeleteDialogComponent {
  director: IDirector;

  constructor(protected directorService: DirectorService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.directorService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'directorListModification',
        content: 'Deleted an director'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-director-delete-popup',
  template: ''
})
export class DirectorDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ director }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DirectorDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.director = director;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/director', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/director', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
