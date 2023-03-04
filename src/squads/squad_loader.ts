import { SpawnConstructibleSquad } from './squad_base';
import { InitialSquadInst } from './initial_squad';
import { DoubleSquadInst } from './double_squad';

export let spawn_constructible_squads: SpawnConstructibleSquad[] = [
    InitialSquadInst,
    DoubleSquadInst,
];
