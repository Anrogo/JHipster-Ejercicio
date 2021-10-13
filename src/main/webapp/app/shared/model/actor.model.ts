import { IPelicula } from 'app/shared/model/pelicula.model';

export interface IActor {
  id?: number;
  nombre?: string;
  apellidos?: string;
  peliculas?: IPelicula[];
}

export class Actor implements IActor {
  constructor(public id?: number, public nombre?: string, public apellidos?: string, public peliculas?: IPelicula[]) {}
}
