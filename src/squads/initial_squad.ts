import { SpawnConstructibleSquad } from './squad_base';
import { SpawnTemplate } from './squad_utils';
import { NaiveSettings, SourceMode, TargetMode, NaiveHarvesterInst } from '../roles/naive_harvester';
import { DoubleSquadInst } from './double_squad';

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    new SpawnTemplate(NaiveHarvesterInst, "p#ctrl",
        {
            source: SourceMode.Primary,
            target: TargetMode.Controller
        } as NaiveSettings),
    new SpawnTemplate(NaiveHarvesterInst, "p#spwn",
        {
            source: SourceMode.Primary,
            target: TargetMode.Spawner
        } as NaiveSettings),
    new SpawnTemplate(NaiveHarvesterInst, "p#bld",
        {
            source: SourceMode.Primary,
            target: TargetMode.Build
        } as NaiveSettings),
]

export class InitialSquad extends SpawnConstructibleSquad {
    constructor() {
        super("initial_squad", SPAWN_SEQUENCE);
    }

    IsActive(): boolean {
        return !DoubleSquadInst.construct_from_spawner(this.spawner).IsActive();
    }
}

export const InitialSquadInst = new InitialSquad();
