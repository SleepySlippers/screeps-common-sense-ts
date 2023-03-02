import { NAME_SEPARATOR } from "roles/role";
import { SpawConstructibleSquad, Squad } from "./squad_loader";
import { GenerateSquadList, SpawnOrOperateSquad, SpawnTemplate } from "./squad_utils";

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    // TODO: hardcode SPAWN_SEQUENCE
]

export default class InitialSquad implements Squad, SpawConstructibleSquad {
    spawner!: StructureSpawn;
    readonly squad_name: string = "initial_squad";
    readonly squad_prefix = this.spawner + NAME_SEPARATOR + this.squad_name + "#";

    construct_from_spawner(spawner: StructureSpawn): Squad {
        let res = new InitialSquad();
        res.spawner = spawner;
        return res;
    }

    IsActive(): boolean {
        // TODO: turn off this squad when can handle cooler squad
        return true;
    }
    Operate(): void {
        const is_active = this.IsActive();
        let squad_list = GenerateSquadList(this, SPAWN_SEQUENCE);
        SpawnOrOperateSquad(this.spawner, squad_list, is_active);
    }

}
