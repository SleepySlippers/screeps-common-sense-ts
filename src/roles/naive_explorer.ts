import { CreepName, Role } from "./role";

export class NaiveExplorerSettings {
    target_room_name!: string;
}

class NaiveExplorerState {

}

interface NaiveExplorerMemory extends CreepMemory {
    settings: NaiveExplorerSettings;
    current_state: NaiveExplorerState;
}

export class NaiveExplorer implements Role {

    readonly role_name: string = "role_naive_explorer";

    private GetMemory(creep: Creep): NaiveExplorerMemory {
        return creep.memory;
    }

    Run(creep: Creep): void {
        const creep_mem = this.GetMemory(creep);
        creep.moveTo(new RoomPosition(25, 25, creep_mem.settings.target_room_name));
    }
    Spawn(spawner: StructureSpawn, creep_name: CreepName, settings: NaiveExplorerSettings): ScreepsReturnCode {
        let body = [MOVE];
        return spawner.spawnCreep(body, creep_name, {
            memory: {
                spawner_id: spawner.id,
                role_name: this.role_name,
                settings: settings,
                current_state: new NaiveExplorerState(),
            }
        })
    }

}

export const NaiveExplorerInst = new NaiveExplorer();
