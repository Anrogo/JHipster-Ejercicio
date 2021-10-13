import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IDirector, Director } from 'app/shared/model/director.model';
import { DirectorService } from './director.service';

@Component({
  selector: 'jhi-director-update',
  templateUrl: './director-update.component.html'
})
export class DirectorUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    nombre: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    apellidos: [null, [Validators.minLength(3), Validators.maxLength(70)]]
  });

  constructor(protected directorService: DirectorService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ director }) => {
      this.updateForm(director);
    });
  }

  updateForm(director: IDirector) {
    this.editForm.patchValue({
      id: director.id,
      nombre: director.nombre,
      apellidos: director.apellidos
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const director = this.createFromForm();
    if (director.id !== undefined) {
      this.subscribeToSaveResponse(this.directorService.update(director));
    } else {
      this.subscribeToSaveResponse(this.directorService.create(director));
    }
  }

  private createFromForm(): IDirector {
    return {
      ...new Director(),
      id: this.editForm.get(['id']).value,
      nombre: this.editForm.get(['nombre']).value,
      apellidos: this.editForm.get(['apellidos']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDirector>>) {
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
