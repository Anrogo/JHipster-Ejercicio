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
      },
      {
        path: 'estreno',
        loadChildren: () => import('./estreno/estreno.module').then(m => m.MyprojectEstrenoModule)
      },
      {
        path: 'director',
        loadChildren: () => import('./director/director.module').then(m => m.MyprojectDirectorModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class MyprojectEntityModule {}
