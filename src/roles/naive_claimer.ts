import { CreepName, Role } from "./role";
import { LogErr } from '../utils/utils';

export class NaiveClaimerSettings {
    target_room_name!: string;
}

class NaiveClaimerState {

}

interface NaiveClaimerMemory extends CreepMemory {
    settings: NaiveClaimerSettings;
    current_state: NaiveClaimerState;
}

export class NaiveClaimer implements Role {

    readonly role_name: string = "role_naive_claimer";

    private GetMemory(creep: Creep): NaiveClaimerMemory {
        return creep.memory;
    }

    Run(creep: Creep): void {
        const creep_mem = this.GetMemory(creep);
        if (creep_mem.settings.target_room_name != creep.room.name) {
            const exitDir = Game.map.findExit(creep.room, creep_mem.settings.target_room_name);
            if (exitDir == -2 || exitDir == -10) {
                LogErr(creep, "Claimer cant find path");
                return
            }
            const exit = creep.pos.findClosestByRange(exitDir);
            if (exit) {
                creep.moveTo(exit);
                return
            }
            LogErr(creep, "Claimer has no exit");
            return
        }
        const controller = creep.room.controller;
        if (controller && (!controller.my || (controller.reservation?.username != creep.owner.username))) {
            const ret = creep.attackController(controller);
            if (ret == OK) {
                return
            }
            if (ret == ERR_INVALID_TARGET){
                creep.reserveController(controller);
                return
            }
            if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
                return
            }
            LogErr(creep, ret);
            return
        }
        LogErr(creep, "room has no controller");
    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveClaimerSettings): ScreepsReturnCode {
        let body = [CLAIM, MOVE];
        return spawner.spawnCreep(body, creep_name, {
            memory: {
                spawner_id: spawner.id,
                role_name: this.role_name,
                settings: settings,
                current_state: new NaiveClaimerState(),
            }
        })
    }

}

export const NaiveClaimerInst = new NaiveClaimer();
