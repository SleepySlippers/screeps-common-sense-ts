import { SpawnConstructibleSquad } from "./squad_base";
import { SpawnTemplate } from './squad_utils';
import { NaiveSettings, SourceMode, TargetMode, NaiveHarvesterInst } from '../roles/naive_harvester';

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    new SpawnTemplate(NaiveHarvesterInst, "d#p#ctrl",
        {
            source: SourceMode.Primary,
            target: TargetMode.Controller,
            double_worker: true,
        } as NaiveSettings),
    new SpawnTemplate(NaiveHarvesterInst, "d#p#spwn",
        {
            source: SourceMode.Primary,
            target: TargetMode.Spawner,
            double_worker: true,
        } as NaiveSettings),
    new SpawnTemplate(NaiveHarvesterInst, "d#p#bld",
        {
            source: SourceMode.Primary,
            target: TargetMode.Build,
            double_worker: true,
        } as NaiveSettings),

    new SpawnTemplate(NaiveHarvesterInst, "dd#s#ctrl",
        {
            source: SourceMode.Secondary,
            target: TargetMode.Controller,
            double_worker: true,
            double_carry: true,
        } as NaiveSettings),
    new SpawnTemplate(NaiveHarvesterInst, "dd#s#spwn",
        {
            source: SourceMode.Secondary,
            target: TargetMode.Spawner,
            double_worker: true,
            double_carry: true,
        } as NaiveSettings),
    new SpawnTemplate(NaiveHarvesterInst, "dd#s#bld",
        {
            source: SourceMode.Secondary,
            target: TargetMode.Build,
            double_worker: true,
            double_carry: true,
        } as NaiveSettings),
]

export class DoubleSquad extends SpawnConstructibleSquad {
    constructor() {
        super("double_squad", SPAWN_SEQUENCE);
    }

    IsActive(): boolean {
        const extensions = this.spawner.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_EXTENSION
        }) as StructureExtension[];
        if (extensions.length < 2) {
            return false;
        }
        const nonempty_container = this.spawner.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                i.store[RESOURCE_ENERGY] >= 200
        });
        if (!nonempty_container) {
            return false;
        }
        return true;
    }
}

export const DoubleSquadInst = new DoubleSquad();
