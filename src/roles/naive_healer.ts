import { CreepName, Role } from "./role";
import { LogErr, ROOM_MIN_COORD, ROOM_MAX_COORD } from '../utils/utils';

export class NaiveHealerSettings {
    default_room_name?: string;
}

class NaiveHealerState {

}

interface NaiveHealerMemory extends CreepMemory {
    settings: NaiveHealerSettings;
    current_state: NaiveHealerState;
}

export class NaiveHealer implements Role {

    readonly role_name: string = "role_naive_healer";

    private GetMemory(creep: Creep): NaiveHealerMemory {
        return creep.memory;
    }

    Run(creep: Creep): void {
        const creep_mem = this.GetMemory(creep);

        LogErr(creep, "i'm alive")

        let ill = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (i) => i.hits < i.hitsMax
        })
        if (ill) {
            const ret = creep.heal(ill)
            if (creep.pos.findInRange(FIND_MY_CREEPS, 1, {
                filter: (i) => i.id == ill?.id
            }).length < 1) {
                creep.moveTo(ill)
            }
            return
        }

        for (const nm in Game.creeps) {
            const crep = Game.creeps[nm]
            if (crep.hits < crep.hitsMax) {
                const ret = creep.heal(crep)
                creep.moveTo(crep)
                return
            }
        }

        if (creep_mem.settings.default_room_name != null && creep_mem.settings.default_room_name != creep.room.name) {
            creep.moveTo(new RoomPosition(25, 25, creep_mem.settings.default_room_name))
        }
    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveHealerSettings): ScreepsReturnCode {
        let body = [HEAL, MOVE];
        return spawner.spawnCreep(body, creep_name, {
            memory: {
                spawner_id: spawner.id,
                role_name: this.role_name,
                settings: settings,
                current_state: new NaiveHealerState(),
            }
        })
    }

}

export const NaiveHealerInst = new NaiveHealer();
