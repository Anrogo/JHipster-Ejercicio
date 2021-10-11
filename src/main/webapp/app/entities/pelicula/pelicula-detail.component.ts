import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPelicula } from 'app/shared/model/pelicula.model';

@Component({
  selector: 'jhi-pelicula-detail',
  templateUrl: './pelicula-detail.component.html'
})
export class PeliculaDetailComponent implements OnInit {
  pelicula: IPelicula;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ pelicula }) => {
      this.pelicula = pelicula;
    });
  }

  previousState() {
    window.history.back();
  }
}
