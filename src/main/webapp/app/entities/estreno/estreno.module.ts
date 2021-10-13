import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyprojectSharedModule } from 'app/shared/shared.module';
import { EstrenoComponent } from './estreno.component';
import { EstrenoDetailComponent } from './estreno-detail.component';
import { EstrenoUpdateComponent } from './estreno-update.component';
import { EstrenoDeletePopupComponent, EstrenoDeleteDialogComponent } from './estreno-delete-dialog.component';
import { estrenoRoute, estrenoPopupRoute } from './estreno.route';

const ENTITY_STATES = [...estrenoRoute, ...estrenoPopupRoute];

@NgModule({
  imports: [MyprojectSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EstrenoComponent,
    EstrenoDetailComponent,
    EstrenoUpdateComponent,
    EstrenoDeleteDialogComponent,
    EstrenoDeletePopupComponent
  ],
  entryComponents: [EstrenoDeleteDialogComponent]
})
export class MyprojectEstrenoModule {}
