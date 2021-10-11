import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'categoria',
        loadChildren: () => import('./categoria/categoria.module').then(m => m.MyprojectCategoriaModule)
      },
      {
        path: 'pelicula',
        loadChildren: () => import('./pelicula/pelicula.module').then(m => m.MyprojectPeliculaModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class MyprojectEntityModule {}
