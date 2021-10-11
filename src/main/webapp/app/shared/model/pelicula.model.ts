import { Moment } from 'moment';

export interface IPelicula {
  id?: number;
  titulo?: string;
  fechaEstreno?: Moment;
  descricion?: string;
  enCines?: boolean;
}

export class Pelicula implements IPelicula {
  constructor(
    public id?: number,
    public titulo?: string,
    public fechaEstreno?: Moment,
    public descricion?: string,
    public enCines?: boolean
  ) {
    this.enCines = this.enCines || false;
  }
}
