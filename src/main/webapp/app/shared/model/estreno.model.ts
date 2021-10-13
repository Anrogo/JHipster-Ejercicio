import { Moment } from 'moment';
import { IPelicula } from 'app/shared/model/pelicula.model';

export interface IEstreno {
  id?: number;
  fecha?: Moment;
  lugar?: string;
  pelicula?: IPelicula;
}

export class Estreno implements IEstreno {
  constructor(public id?: number, public fecha?: Moment, public lugar?: string, public pelicula?: IPelicula) {}
}
