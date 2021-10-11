export interface ICategoria {
  id?: number;
  nombre?: string;
  imagenContentType?: string;
  imagen?: any;
}

export class Categoria implements ICategoria {
  constructor(public id?: number, public nombre?: string, public imagenContentType?: string, public imagen?: any) {}
}
