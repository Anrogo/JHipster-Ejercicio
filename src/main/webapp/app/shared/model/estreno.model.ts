import { Moment } from 'moment';

export interface IEstreno {
  id?: number;
  fecha?: Moment;
  lugar?: string;
}

export class Estreno implements IEstreno {
  constructor(public id?: number, public fecha?: Moment, public lugar?: string) {}
}
