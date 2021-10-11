import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IPelicula, Pelicula } from 'app/shared/model/pelicula.model';
import { PeliculaService } from './pelicula.service';

@Component({
  selector: 'jhi-pelicula-update',
  templateUrl: './pelicula-update.component.html'
})
export class PeliculaUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    titulo: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    fechaEstreno: [],
    descricion: [null, [Validators.minLength(20), Validators.maxLength(500)]],
    enCines: []
  });

  constructor(protected peliculaService: PeliculaService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ pelicula }) => {
      this.updateForm(pelicula);
    });
  }

  updateForm(pelicula: IPelicula) {
    this.editForm.patchValue({
      id: pelicula.id,
      titulo: pelicula.titulo,
      fechaEstreno: pelicula.fechaEstreno != null ? pelicula.fechaEstreno.format(DATE_TIME_FORMAT) : null,
      descricion: pelicula.descricion,
      enCines: pelicula.enCines
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const pelicula = this.createFromForm();
    if (pelicula.id !== undefined) {
      this.subscribeToSaveResponse(this.peliculaService.update(pelicula));
    } else {
      this.subscribeToSaveResponse(this.peliculaService.create(pelicula));
    }
  }

  private createFromForm(): IPelicula {
    return {
      ...new Pelicula(),
      id: this.editForm.get(['id']).value,
      titulo: this.editForm.get(['titulo']).value,
      fechaEstreno:
        this.editForm.get(['fechaEstreno']).value != null ? moment(this.editForm.get(['fechaEstreno']).value, DATE_TIME_FORMAT) : undefined,
      descricion: this.editForm.get(['descricion']).value,
      enCines: this.editForm.get(['enCines']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPelicula>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
