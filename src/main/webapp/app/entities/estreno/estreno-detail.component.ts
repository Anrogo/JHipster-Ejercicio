import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstreno } from 'app/shared/model/estreno.model';

@Component({
  selector: 'jhi-estreno-detail',
  templateUrl: './estreno-detail.component.html'
})
export class EstrenoDetailComponent implements OnInit {
  estreno: IEstreno;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ estreno }) => {
      this.estreno = estreno;
    });
  }

  previousState() {
    window.history.back();
  }
}
