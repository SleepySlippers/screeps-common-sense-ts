import { GetSourcesByDistance } from "memory";
import { CreepName, Role } from "./role";
import { MoveTowards } from '../utils/path';

// priorotize delivery
export const enum TargetMode {
    Spawner,
    Extentions,
    Container,
    Storage,
    Build,
    Controller,
}

const GREATEST_TARGET_MODE = TargetMode.Controller;

export const enum SourceMode {
    Primary, // choose source closest to spawner
    Secondary, // choose source second closest to spawner
}

export class NaiveSettings {
    source: SourceMode = SourceMode.Primary;
    target: TargetMode = TargetMode.Spawner;
    double_worker: boolean = false;
    double_carry: boolean = false;
}

class NaiveState {
    harvest: boolean = true;
}

interface NaiveMemory extends CreepMemory {
    settings: NaiveSettings;
    current_state: NaiveState;
}

function GetSource(spawner: StructureSpawn, mode: SourceMode): Source | null {
    const srcs = GetSourcesByDistance(spawner);
    let src_ind: number | null = null;
    if (mode == SourceMode.Primary) {
        src_ind = 0;
    } else if (mode = SourceMode.Secondary) {
        src_ind = 1;
    }
    if (src_ind == null || src_ind >= srcs.length) {
        console.log("Room has no required source");
        return null
    }
    return Game.getObjectById(srcs[src_ind]);
}

function LogErr(creep: Creep, message: any): void {
    console.log("Error in creep `" + creep.name + "`: " + message);
}

type Actionable = StructureController | ConstructionSite | Structure | Source;

function CarryAction(creep: Creep, target: Actionable) {
    if (target instanceof StructureController) {
        return creep.upgradeController(target);
    }
    if (target instanceof ConstructionSite) {
        return creep.build(target);
    }
    if (target instanceof Source) {
        return creep.harvest(target);
    }
    if (target instanceof Structure) {
        return creep.transfer(target, RESOURCE_ENERGY);
    }
    return null;
}

function ActionOrMove(creep: Creep, target: Actionable | null | undefined): boolean {
    if (!target) {
        return false;
    }
    const ret = CarryAction(creep, target);
    if (ret == ERR_NOT_IN_RANGE) {
        MoveTowards(creep, target, true);
        return true;
    }
    if (ret != OK) {
        LogErr(creep, ret);
        return false;
    }
    return true;
}

function GetClosestFreeStructure(creep: Creep, type: any) {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (i: any) => i.structureType == type &&
            i.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
}

function GetStructureType(mode: number){
    if (mode == TargetMode.Container){
        return STRUCTURE_CONTAINER;
    } else if (mode == TargetMode.Extentions){
        return STRUCTURE_EXTENSION;
    } else if (mode == TargetMode.Spawner){
        return STRUCTURE_SPAWN;
    } else if (mode == TargetMode.Storage){
        return STRUCTURE_STORAGE;
    }
    return null;
}

export class NaiveHarvester implements Role {

    readonly role_name: string = "role_naive_harvester";

    private UpdateState(creep: Creep): void {
        if (this.GetMemory(creep).current_state.harvest == true && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.current_state.harvest = false;
            creep.say('🚗 carry');
        }
        if (this.GetMemory(creep).current_state.harvest == false && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.current_state.harvest = true;
            creep.say('🔄 harvest');
        }
    }

    private GetMemory(creep: Creep): NaiveMemory {
        return creep.memory;
    }

    private GoCarry(creep: Creep): boolean {
        const creep_mem = this.GetMemory(creep);
        const target_mode = creep_mem.settings.target;
        let targets: (Actionable | undefined | null)[] = [];
        if (target_mode == TargetMode.Controller) {
            targets.push(creep.room.controller);
        } else if (target_mode == TargetMode.Build) {
            const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            targets.push(target);
        } else {
            const structure_type = GetStructureType(target_mode);
            targets.push(GetClosestFreeStructure(creep, structure_type));
        }

        for (let i = 0; i < GREATEST_TARGET_MODE; ++i){
            const structure_type = GetStructureType(i);
            if (!structure_type){
                continue;
            }
            targets.push(GetClosestFreeStructure(creep, structure_type));
        }
        targets.push(creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES));
        targets.push(creep.room.controller);

        for (const target of targets) {
            if (ActionOrMove(creep, target)) {
                return true;
            }
        }
        return false;
    }

    Run(creep: Creep): void {
        let creep_mem = this.GetMemory(creep);
        const spawner: StructureSpawn = Game.getObjectById(creep_mem.spawner_id)!;
        this.UpdateState(creep);

        if (creep_mem.current_state.harvest) {
            const src = GetSource(spawner, this.GetMemory(creep).settings.source);
            ActionOrMove(creep, src);
        } else {

            this.GoCarry(creep);
        }
        throw new Error("Method not implemented.");
    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveSettings): ScreepsReturnCode {
        let body = [WORK, CARRY, MOVE];
        // TODO: make body builder
        if (settings.double_worker) {
            body = [WORK, WORK, CARRY, MOVE];
            if (settings.double_carry) {
                body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            }
        } else if (settings.double_carry) {
            body = [WORK, CARRY, CARRY, MOVE];
        }
        return spawner.spawnCreep(body, creep_name, {
            memory: {
                spawner_id: spawner.id,
                role_name: this.role_name,
                settings: settings,
                current_state: new NaiveState(),
            }
        })
    }

}

export const NaiveHarvesterInst = new NaiveHarvester();
