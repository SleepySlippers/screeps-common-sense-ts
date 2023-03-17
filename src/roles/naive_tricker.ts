import { CreepName, Role } from "./role";
import { LogErr, ROOM_MIN_COORD, ROOM_MAX_COORD } from '../utils/utils';

export class NaiveTrickerSettings {
    target_room_name!: string;
}

class NaiveTrickerState {

}

interface NaiveTrickerMemory extends CreepMemory {
    settings: NaiveTrickerSettings;
    current_state: NaiveTrickerState;
}

export class NaiveTricker implements Role {

    readonly role_name: string = "role_naive_tricker";

    private GetMemory(creep: Creep): NaiveTrickerMemory {
        return creep.memory;
    }

    Run(creep: Creep): void {
        const creep_mem = this.GetMemory(creep);

        if (creep.hits < creep.hitsMax && creep_mem.settings.target_room_name != creep.room.name) {
            // move out of border
            if (creep.pos.x <= ROOM_MIN_COORD + 2) {
                creep.moveTo(creep.pos.x + 2, creep.pos.y, {reusePath: 0});
                return
            }
            if (creep.pos.y <= ROOM_MIN_COORD + 2) {
                creep.moveTo(creep.pos.x, creep.pos.y + 2, {reusePath: 0});
                return
            }
            if (creep.pos.x >= ROOM_MAX_COORD - 2) {
                creep.moveTo(creep.pos.x - 2, creep.pos.y, {reusePath: 0});
                return
            }
            if (creep.pos.y >= ROOM_MAX_COORD - 2) {
                creep.moveTo(creep.pos.x, creep.pos.y - 2, {reusePath: 0});
                return
            }
            return
        }

        if (creep_mem.settings.target_room_name != creep.room.name) {
            const terrain = Game.map.getRoomTerrain(creep_mem.settings.target_room_name);

            const backwardExit = Game.map.findExit(creep_mem.settings.target_room_name, creep.room);

            let poses: RoomPosition[] = [];
            for (let i = ROOM_MIN_COORD; i <= ROOM_MAX_COORD; ++i){
                if (backwardExit == FIND_EXIT_LEFT && terrain.get(ROOM_MIN_COORD, i) != TERRAIN_MASK_WALL){
                    poses.push(new RoomPosition(ROOM_MIN_COORD, i, creep_mem.settings.target_room_name));
                }
                if (backwardExit == FIND_EXIT_RIGHT && terrain.get(ROOM_MAX_COORD, i) != TERRAIN_MASK_WALL){
                    poses.push(new RoomPosition(ROOM_MAX_COORD, i, creep_mem.settings.target_room_name));
                }
                if (backwardExit == FIND_EXIT_TOP && terrain.get(i, ROOM_MIN_COORD) != TERRAIN_MASK_WALL){
                    poses.push(new RoomPosition(i, ROOM_MIN_COORD, creep_mem.settings.target_room_name));
                }
                if (backwardExit == FIND_EXIT_BOTTOM && terrain.get(i, ROOM_MAX_COORD) != TERRAIN_MASK_WALL){
                    poses.push(new RoomPosition(i, ROOM_MAX_COORD, creep_mem.settings.target_room_name));
                }
            }
            if (poses.length > 0){
                let randInd = creep.id.charCodeAt(creep.id.length - 1) % poses.length
                creep.moveTo(poses[randInd])
                return
            }
            const exitDir = Game.map.findExit(creep.room, creep_mem.settings.target_room_name);
            if (exitDir == -2 || exitDir == -10) {
                console.log("Tricker cant find path");
                return
            }
            LogErr(creep, "here" + creep.room.name + " " + creep_mem.settings.target_room_name);
            const exit = creep.pos.findClosestByRange(exitDir);
            if (exit) {
                creep.moveTo(exit);
                return
            }
            console.log("Tricker has no exit");
            return
        }

    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveTrickerSettings): ScreepsReturnCode {
        let body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE];
        return spawner.spawnCreep(body, creep_name, {
            memory: {
                spawner_id: spawner.id,
                role_name: this.role_name,
                settings: settings,
                current_state: new NaiveTrickerState(),
            }
        })
    }

}

export const NaiveTrickerInst = new NaiveTricker();
