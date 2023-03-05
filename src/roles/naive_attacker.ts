import { CreepName, Role } from "./role";
import { LogErr } from '../utils/utils';

export class NaiveAttackerSettings {
    target_room_name!: string;
}

class NaiveAttackerState {

}

interface NaiveAttackerMemory extends CreepMemory {
    settings: NaiveAttackerSettings;
    current_state: NaiveAttackerState;
}

export class NaiveAttacker implements Role {

    readonly role_name: string = "role_naive_attacker";

    private GetMemory(creep: Creep): NaiveAttackerMemory {
        return creep.memory;
    }

    Run(creep: Creep): void {
        const creep_mem = this.GetMemory(creep);
        if (creep_mem.settings.target_room_name != creep.room.name) {
            const exitDir = Game.map.findExit(creep.room, creep_mem.settings.target_room_name);
            if (exitDir == -2 || exitDir == -10) {
                console.log("Attacker cant find path");
                return
            }
            const exit = creep.pos.findClosestByRange(exitDir);
            if (exit) {
                creep.moveTo(exit);
                return
            }
            console.log("Attacker has no exit");
            return
        }
        const hostile_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_SPAWN
        })
        if (hostile_spawn) {
            let ret = creep.attack(hostile_spawn);
            if (ret == OK) {
                return
            }
            if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile_spawn);
                return
            }
            LogErr(creep, ret);
            return
        }
        const hostile_structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (i) => i.structureType != STRUCTURE_CONTROLLER
        });
        if (hostile_structure) {
            let ret = creep.attack(hostile_structure);
            if (ret == OK) {
                return
            }
            if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile_structure);
                return
            }
            LogErr(creep, ret);
            return
        }

        const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostile) {
            let ret = creep.attack(hostile);
            if (ret == OK) {
                return
            }
            if (ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile);
                return
            }
            LogErr(creep, ret);
            return
        }
    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveAttackerSettings): ScreepsReturnCode {
        let body = [ATTACK, ATTACK, MOVE, MOVE];
        return spawner.spawnCreep(body, creep_name, {
            memory: {
                spawner_id: spawner.id,
                role_name: this.role_name,
                settings: settings,
                current_state: new NaiveAttackerState(),
            }
        })
    }

}

export const NaiveAttackerInst = new NaiveAttacker();
