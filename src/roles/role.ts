import { Squad } from "squads/squad_base";

export const NAME_SEPARATOR = "#";

export type CreepName = string & { readonly '': unique symbol };

export function FormatCreepName(squad: Squad, role: Role, name_addition: string, num: number): CreepName {
    return (squad.squad_prefix + NAME_SEPARATOR
        + role.role_name + NAME_SEPARATOR
        + name_addition + NAME_SEPARATOR
        + num) as CreepName;
}

export interface Role {
    readonly role_name: string;
    Run(creep: Creep): void;
    Spawn(spawner: StructureSpawn, creep_name: CreepName, additional_spawn_info: any): ScreepsReturnCode;
}
