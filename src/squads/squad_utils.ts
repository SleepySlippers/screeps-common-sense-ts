import { CreepName, FormatCreepName, Role } from "roles/role";
import { Squad } from "./squad_loader";

export class SpawnTemplate {
    role: Role;
    count: number;
    name_additon: string;
    // TODO: find a better name
    settings: any;

    constructor(role: Role, name_additon: string, settings: any, count: number = 1){
        this.role = role;
        this.name_additon = name_additon;
        this.settings = settings;
        this.count = count;
    }
};

export type SpawnInfo = {
    creep_name: CreepName;
    role: Role;
    additional_spawn_info: any;
} & { readonly '': unique symbol };

export type SquadList = Map<string, SpawnInfo> & { readonly '': unique symbol };

export function GenerateSquadList(squad: Squad, spawn_sequence: SpawnTemplate[]): SquadList {
    let squad_list: Map<string, SpawnInfo> = new Map();
    for (const template of spawn_sequence) {
        let num = 1;
        for (let i = 0; i < template.count; ++i) {
            let get_name = (num: number) => FormatCreepName(squad, template.role, template.name_additon, num);
            while (squad_list.has(get_name(num))) {
                ++num;
            }
            squad_list.set(get_name(num),
                {
                    creep_name: get_name(num),
                    role: template.role,
                    additional_spawn_info: template.settings,
                } as SpawnInfo
            );
        }
    }
    return squad_list as SquadList;
}

// Returns whether tried to spawn or not
export function SpawnOrRun(spawner: StructureSpawn, spawn_info: SpawnInfo, spawn: boolean): boolean {
    try {
        let creep: Creep = Game.creeps[spawn_info.creep_name];
        if (creep) {
            spawn_info.role.Run(creep);
            return false;
        }
        if (!spawn){
            return false;
        }
        spawn_info.role.Spawn(spawner, spawn_info.creep_name, spawn_info.additional_spawn_info);
        return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}

export function SpawnOrOperateSquad(spawner: StructureSpawn, squad_list: SquadList, can_spawn: boolean = true) {
    let spawned = !can_spawn;
    for (const [_, spawn_info] of squad_list) {
        spawned ||= SpawnOrRun(spawner, spawn_info, !spawned);
    }
}
