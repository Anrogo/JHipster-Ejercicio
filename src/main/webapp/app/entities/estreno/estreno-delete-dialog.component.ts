import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEstreno } from 'app/shared/model/estreno.model';
import { EstrenoService } from './estreno.service';

@Component({
  selector: 'jhi-estreno-delete-dialog',
  templateUrl: './estreno-delete-dialog.component.html'
})
export class EstrenoDeleteDialogComponent {
  estreno: IEstreno;

  constructor(protected estrenoService: EstrenoService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.estrenoService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'estrenoListModification',
        content: 'Deleted an estreno'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-estreno-delete-popup',
  template: ''
})
export class EstrenoDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ estreno }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(EstrenoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.estreno = estreno;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/estreno', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/estreno', { outlets: { popup: null } }]);
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
