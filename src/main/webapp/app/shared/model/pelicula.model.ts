import { Moment } from 'moment';
import { IEstreno } from 'app/shared/model/estreno.model';
import { IDirector } from 'app/shared/model/director.model';
import { IActor } from 'app/shared/model/actor.model';

export interface IPelicula {
  id?: number;
  titulo?: string;
  fechaEstreno?: Moment;
  descricion?: string;
  enCines?: boolean;
  estreno?: IEstreno;
  director?: IDirector;
  actors?: IActor[];
}

export class Pelicula implements IPelicula {
  constructor(
    public id?: number,
    public titulo?: string,
    public fechaEstreno?: Moment,
    public descricion?: string,
    public enCines?: boolean,
    public estreno?: IEstreno,
    public director?: IDirector,
    public actors?: IActor[]
  ) {
    this.enCines = this.enCines || false;
  }
}
