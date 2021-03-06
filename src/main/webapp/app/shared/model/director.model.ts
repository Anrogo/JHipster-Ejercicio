import { IPelicula } from 'app/shared/model/pelicula.model';

export interface IDirector {
  id?: number;
  nombre?: string;
  apellidos?: string;
  peliculas?: IPelicula[];
}

export class Director implements IDirector {
  constructor(public id?: number, public nombre?: string, public apellidos?: string, public peliculas?: IPelicula[]) {}
}
