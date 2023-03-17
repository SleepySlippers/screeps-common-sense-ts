import { CreepName, Role } from "./role";
import { LogErr, ROOM_MIN_COORD, ROOM_MAX_COORD } from '../utils/utils';

export class NaiveHealerSettings {

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

        for (const nm in Game.creeps){
            const crep = Game.creeps[nm]
            if (crep.hits < crep.hitsMax){
                const ret = creep.heal(crep)
                if (ret == ERR_NOT_IN_RANGE){
                    creep.moveTo(crep)
                }
                return
            }
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
