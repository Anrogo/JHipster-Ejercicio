import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ICategoria } from 'app/shared/model/categoria.model';

@Component({
  selector: 'jhi-categoria-detail',
  templateUrl: './categoria-detail.component.html'
})
export class CategoriaDetailComponent implements OnInit {
  categoria: ICategoria;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoria }) => {
      this.categoria = categoria;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
