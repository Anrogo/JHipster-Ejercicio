import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IEstreno, Estreno } from 'app/shared/model/estreno.model';
import { EstrenoService } from './estreno.service';
import { IPelicula } from 'app/shared/model/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/pelicula.service';

@Component({
  selector: 'jhi-estreno-update',
  templateUrl: './estreno-update.component.html'
})
export class EstrenoUpdateComponent implements OnInit {
  isSaving: boolean;

  peliculas: IPelicula[];

  editForm = this.fb.group({
    id: [],
    fecha: [],
    lugar: [null, [Validators.minLength(4), Validators.maxLength(150)]],
    pelicula: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected estrenoService: EstrenoService,
    protected peliculaService: PeliculaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ estreno }) => {
      this.updateForm(estreno);
    });
    this.peliculaService
      .query({ filter: 'estreno-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IPelicula[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPelicula[]>) => response.body)
      )
      .subscribe(
        (res: IPelicula[]) => {
          if (!this.editForm.get('pelicula').value || !this.editForm.get('pelicula').value.id) {
            this.peliculas = res;
          } else {
            this.peliculaService
              .find(this.editForm.get('pelicula').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IPelicula>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IPelicula>) => subResponse.body)
              )
              .subscribe(
                (subRes: IPelicula) => (this.peliculas = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(estreno: IEstreno) {
    this.editForm.patchValue({
      id: estreno.id,
      fecha: estreno.fecha != null ? estreno.fecha.format(DATE_TIME_FORMAT) : null,
      lugar: estreno.lugar,
      pelicula: estreno.pelicula
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const estreno = this.createFromForm();
    if (estreno.id !== undefined) {
      this.subscribeToSaveResponse(this.estrenoService.update(estreno));
    } else {
      this.subscribeToSaveResponse(this.estrenoService.create(estreno));
    }
  }

  private createFromForm(): IEstreno {
    return {
      ...new Estreno(),
      id: this.editForm.get(['id']).value,
      fecha: this.editForm.get(['fecha']).value != null ? moment(this.editForm.get(['fecha']).value, DATE_TIME_FORMAT) : undefined,
      lugar: this.editForm.get(['lugar']).value,
      pelicula: this.editForm.get(['pelicula']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstreno>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackPeliculaById(index: number, item: IPelicula) {
    return item.id;
  }
}
