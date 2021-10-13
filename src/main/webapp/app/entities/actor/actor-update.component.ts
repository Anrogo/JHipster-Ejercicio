import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IActor, Actor } from 'app/shared/model/actor.model';
import { ActorService } from './actor.service';
import { IPelicula } from 'app/shared/model/pelicula.model';
import { PeliculaService } from 'app/entities/pelicula/pelicula.service';

@Component({
  selector: 'jhi-actor-update',
  templateUrl: './actor-update.component.html'
})
export class ActorUpdateComponent implements OnInit {
  isSaving: boolean;

  peliculas: IPelicula[];

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.minLength(3), Validators.maxLength(40)]],
    apellidos: [null, [Validators.minLength(3), Validators.maxLength(70)]]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected actorService: ActorService,
    protected peliculaService: PeliculaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ actor }) => {
      this.updateForm(actor);
    });
    this.peliculaService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IPelicula[]>) => mayBeOk.ok),
        map((response: HttpResponse<IPelicula[]>) => response.body)
      )
      .subscribe((res: IPelicula[]) => (this.peliculas = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(actor: IActor) {
    this.editForm.patchValue({
      id: actor.id,
      nombre: actor.nombre,
      apellidos: actor.apellidos
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const actor = this.createFromForm();
    if (actor.id !== undefined) {
      this.subscribeToSaveResponse(this.actorService.update(actor));
    } else {
      this.subscribeToSaveResponse(this.actorService.create(actor));
    }
  }

  private createFromForm(): IActor {
    return {
      ...new Actor(),
      id: this.editForm.get(['id']).value,
      nombre: this.editForm.get(['nombre']).value,
      apellidos: this.editForm.get(['apellidos']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActor>>) {
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
