import { SpawnConstructibleSquad } from './squad_base';
import { SpawnTemplate } from './squad_utils';
import { NaiveHarvesterSettings, SourceMode, TargetMode, NaiveHarvesterInst } from '../roles/naive_harvester';
import { DoubleSquadInst } from './double_squad';

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    new SpawnTemplate(NaiveHarvesterInst, "p#spwn",
        {
            source: SourceMode.Primary,
            target: TargetMode.Spawner
        } as NaiveHarvesterSettings),
    new SpawnTemplate(NaiveHarvesterInst, "p#ctrl",
        {
            source: SourceMode.Primary,
            target: TargetMode.Controller
        } as NaiveHarvesterSettings),
    new SpawnTemplate(NaiveHarvesterInst, "p#bld",
        {
            source: SourceMode.Primary,
            target: TargetMode.Build
        } as NaiveHarvesterSettings),

    new SpawnTemplate(NaiveHarvesterInst, "d#p#spwn",
        {
            source: SourceMode.Secondary,
            target: TargetMode.Spawner,
            double_worker: true,
        } as NaiveHarvesterSettings),
    new SpawnTemplate(NaiveHarvesterInst, "d#p#ctrl",
        {
            source: SourceMode.Secondary,
            target: TargetMode.Controller,
            double_worker: true,
        } as NaiveHarvesterSettings),
    new SpawnTemplate(NaiveHarvesterInst, "d#p#bld",
        {
            source: SourceMode.Secondary,
            target: TargetMode.Build,
            double_worker: true,
        } as NaiveHarvesterSettings),
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
