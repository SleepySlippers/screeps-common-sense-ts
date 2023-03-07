import { SpawnConstructibleSquad } from './squad_base';
import { InitialSquad } from './initial_squad';
import { DoubleSquad } from './double_squad';
import { AttackSquad } from './attack_squad';

export let spawn_constructible_squads: (() => SpawnConstructibleSquad)[] = [
    () => new InitialSquad(),
    () => new DoubleSquad(),
    () => new AttackSquad(),
];
