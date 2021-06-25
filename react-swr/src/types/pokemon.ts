export type PokemonType = {
  name: string;
  url: string;
}

export interface IPoke {
  slot: number;
  type: {
    name: string;
    url: string;
  }
}