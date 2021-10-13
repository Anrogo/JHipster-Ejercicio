import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyprojectSharedModule } from 'app/shared/shared.module';
import { ActorComponent } from './actor.component';
import { ActorDetailComponent } from './actor-detail.component';
import { ActorUpdateComponent } from './actor-update.component';
import { ActorDeletePopupComponent, ActorDeleteDialogComponent } from './actor-delete-dialog.component';
import { actorRoute, actorPopupRoute } from './actor.route';

const ENTITY_STATES = [...actorRoute, ...actorPopupRoute];

@NgModule({
  imports: [MyprojectSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [ActorComponent, ActorDetailComponent, ActorUpdateComponent, ActorDeleteDialogComponent, ActorDeletePopupComponent],
  entryComponents: [ActorDeleteDialogComponent]
})
export class MyprojectActorModule {}
