import { CreepName, Role } from "./role";
import { LogErr } from '../utils/utils';

export class NaiveAttackerSettings {
    target_room_name!: string;
    is_heavy: boolean = false;
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

        let target_room: Room | null = null;
        for (const key in Game.creeps) {
            if (Game.creeps[key].room.name == creep_mem.settings.target_room_name) {
                target_room = Game.creeps[key].room;
                break
            }
        }
        if (target_room != null && creep_mem.settings.target_room_name != creep.room.name) {
            const hostile_spawns = target_room.find(FIND_HOSTILE_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_SPAWN
            })
            let hostile_spawn: StructureSpawn | null = null;
            if (hostile_spawns.length > 0) {
                hostile_spawn = hostile_spawns[0] as StructureSpawn;
            }
            if (hostile_spawn) {
                const hostile_ramparts = target_room.find(FIND_HOSTILE_STRUCTURES, {
                    filter: (i) => i.structureType == STRUCTURE_RAMPART
                });

                let ret = creep.attack(hostile_spawn);
                if (ret == OK) {
                    return
                }
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile_spawn, { ignore: hostile_ramparts });
                    const hostile_rampart = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_RAMPART
                    });
                    if (hostile_rampart) {
                        creep.attack(hostile_rampart);
                    }
                    return
                }
                LogErr(creep, ret);
                return
            }
        }

        if (creep_mem.settings.target_room_name != creep.room.name) {
            const exitDir = Game.map.findExit(creep.room, creep_mem.settings.target_room_name);
            if (exitDir == -2 || exitDir == -10) {
                console.log("Attacker cant find path");
                return
            }
            LogErr(creep, "here" + creep.room.name + " " + creep_mem.settings.target_room_name);
            const exit = creep.pos.findClosestByRange(exitDir);
            if (exit) {
                creep.moveTo(exit);
                return
            }
            console.log("Attacker has no exit");
            return
        }
        // LogErr(creep, "here" + creep.room.name + " " + creep_mem.settings.target_room_name);
        const hostile_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_SPAWN
        })
        const hostile_ramparts = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_RAMPART
        });

        do {
            if (Math.floor(Game.time / 100) % 2 == 0) {
                // break;
            }
            if (hostile_spawn) {
                let ret = creep.attack(hostile_spawn);
                if (ret == OK) {
                    return
                }
                if (ret == ERR_NOT_IN_RANGE) {
                    const rett = creep.moveTo(hostile_spawn, { ignore: hostile_ramparts });
                    if (rett == ERR_NO_PATH) {
                        break;
                    }
                    const hostile_rampart = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                        filter: (i) => i.structureType == STRUCTURE_RAMPART
                    });
                    if (hostile_rampart) {
                        creep.attack(hostile_rampart);
                    }
                    return
                }
                LogErr(creep, ret);
                return
            }
        } while (false);

        const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS
            // ,{
            //     filter: (i) => {
            //         const look = creep.room.lookAt(i.pos);
            //         for (const lookObject of look) {
            //             if (lookObject.type == LOOK_STRUCTURES) {
            //                 if (lookObject.structure?.structureType == STRUCTURE_RAMPART) {
            //                     return false
            //                 }
            //             }
            //         }
            //         return true
            //     }
            // }
        );
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

        const hostile_structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (i) => i.structureType != STRUCTURE_CONTROLLER && i.structureType != STRUCTURE_RAMPART
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


    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveAttackerSettings): ScreepsReturnCode {
        let body: (TOUGH | ATTACK | MOVE)[] = [ATTACK, ATTACK, MOVE, MOVE];
        if (settings.is_heavy) {
            body = [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE];
        }
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
