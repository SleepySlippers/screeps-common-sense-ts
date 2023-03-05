import { NAME_SEPARATOR } from "roles/role";
import { SpawnTemplate, GenerateSquadList, SpawnOrOperateSquad } from "./squad_utils";

export interface Squad {
    readonly squad_name: string,
    readonly squad_prefix: string,
    IsActive(): boolean,
    Operate(): void,
}

export interface SpawnConstructible {
    construct_from_spawner(spawner: StructureSpawn): Squad;
}

export class SpawnConstructibleSquad implements Squad, SpawnConstructible {
    readonly squad_name: string;
    spawner!: StructureSpawn;
    readonly spawn_sequence?: SpawnTemplate[];

    public get squad_prefix(): string {
        return this.spawner.name + NAME_SEPARATOR + this.squad_name;
    }

    protected constructor(squad_name: string, spawn_sequence?: SpawnTemplate[]) {
        this.squad_name = squad_name;
        this.spawn_sequence = spawn_sequence;
    }

    construct_from_spawner(spawner: StructureSpawn): Squad {
        this.spawner = spawner;
        return this;
    }

    IsActive(): boolean {
        return true;
    }
    Operate(): void {
        const is_active = this.IsActive();
        if (Game.time % 128 == 0) {
            console.log(this.squad_name + " is " + is_active);
        }
        let squad_list = GenerateSquadList(this, this.spawn_sequence!);
        SpawnOrOperateSquad(this.spawner, squad_list, is_active);
    }

}
