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
import { IPelicula, Pelicula } from 'app/shared/model/pelicula.model';
import { PeliculaService } from './pelicula.service';
import { IEstreno } from 'app/shared/model/estreno.model';
import { EstrenoService } from 'app/entities/estreno/estreno.service';
import { IDirector } from 'app/shared/model/director.model';
import { DirectorService } from 'app/entities/director/director.service';
import { IActor } from 'app/shared/model/actor.model';
import { ActorService } from 'app/entities/actor/actor.service';

@Component({
  selector: 'jhi-pelicula-update',
  templateUrl: './pelicula-update.component.html'
})
export class PeliculaUpdateComponent implements OnInit {
  isSaving: boolean;

  estrenos: IEstreno[];

  directors: IDirector[];

  actors: IActor[];

  editForm = this.fb.group({
    id: [],
    titulo: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    fechaEstreno: [],
    descricion: [null, [Validators.minLength(20), Validators.maxLength(500)]],
    enCines: [],
    director: [],
    actors: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected peliculaService: PeliculaService,
    protected estrenoService: EstrenoService,
    protected directorService: DirectorService,
    protected actorService: ActorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ pelicula }) => {
      this.updateForm(pelicula);
    });
    this.estrenoService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEstreno[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEstreno[]>) => response.body)
      )
      .subscribe((res: IEstreno[]) => (this.estrenos = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.directorService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDirector[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDirector[]>) => response.body)
      )
      .subscribe((res: IDirector[]) => (this.directors = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.actorService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IActor[]>) => mayBeOk.ok),
        map((response: HttpResponse<IActor[]>) => response.body)
      )
      .subscribe((res: IActor[]) => (this.actors = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(pelicula: IPelicula) {
    this.editForm.patchValue({
      id: pelicula.id,
      titulo: pelicula.titulo,
      fechaEstreno: pelicula.fechaEstreno != null ? pelicula.fechaEstreno.format(DATE_TIME_FORMAT) : null,
      descricion: pelicula.descricion,
      enCines: pelicula.enCines,
      director: pelicula.director,
      actors: pelicula.actors
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
      enCines: this.editForm.get(['enCines']).value,
      director: this.editForm.get(['director']).value,
      actors: this.editForm.get(['actors']).value
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
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackEstrenoById(index: number, item: IEstreno) {
    return item.id;
  }

  trackDirectorById(index: number, item: IDirector) {
    return item.id;
  }

  trackActorById(index: number, item: IActor) {
    return item.id;
  }

  getSelected(selectedVals: any[], option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
