export interface Squad {
    squad_name: string,
    IsActive(): boolean,
    Operate(): void,
}

export interface SpawConstructibleSquad {
    construct_from_spawn(spawner: StructureSpawn): Squad,
}

export const spawn_constructible_squads = [

];
