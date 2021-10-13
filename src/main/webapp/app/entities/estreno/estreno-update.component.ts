import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { IEstreno, Estreno } from 'app/shared/model/estreno.model';
import { EstrenoService } from './estreno.service';

@Component({
  selector: 'jhi-estreno-update',
  templateUrl: './estreno-update.component.html'
})
export class EstrenoUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    fecha: [],
    lugar: [null, [Validators.minLength(4), Validators.maxLength(150)]]
  });

  constructor(protected estrenoService: EstrenoService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ estreno }) => {
      this.updateForm(estreno);
    });
  }

  updateForm(estreno: IEstreno) {
    this.editForm.patchValue({
      id: estreno.id,
      fecha: estreno.fecha != null ? estreno.fecha.format(DATE_TIME_FORMAT) : null,
      lugar: estreno.lugar
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
      lugar: this.editForm.get(['lugar']).value
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
}
