import InitialSquad from "./initial_squad";

export interface Squad {
    readonly squad_name: string,
    readonly squad_prefix: string,
    IsActive(): boolean,
    Operate(): void,
}

export interface SpawConstructibleSquad {
    construct_from_spawner(spawner: StructureSpawn): Squad,
}

export const spawn_constructible_squads: SpawConstructibleSquad[] = [
    new InitialSquad(),
];
