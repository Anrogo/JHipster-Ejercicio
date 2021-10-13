export interface IDirector {
  id?: number;
  nombre?: string;
  apellidos?: string;
}

export class Director implements IDirector {
  constructor(public id?: number, public nombre?: string, public apellidos?: string) {}
}
