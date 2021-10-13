import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyprojectSharedModule } from 'app/shared/shared.module';
import { DirectorComponent } from './director.component';
import { DirectorDetailComponent } from './director-detail.component';
import { DirectorUpdateComponent } from './director-update.component';
import { DirectorDeletePopupComponent, DirectorDeleteDialogComponent } from './director-delete-dialog.component';
import { directorRoute, directorPopupRoute } from './director.route';

const ENTITY_STATES = [...directorRoute, ...directorPopupRoute];

@NgModule({
  imports: [MyprojectSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DirectorComponent,
    DirectorDetailComponent,
    DirectorUpdateComponent,
    DirectorDeleteDialogComponent,
    DirectorDeletePopupComponent
  ],
  entryComponents: [DirectorDeleteDialogComponent]
})
export class MyprojectDirectorModule {}
