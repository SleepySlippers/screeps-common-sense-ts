import { NAME_SEPARATOR } from "roles/role";
import { SpawnConstructibleSquad, Squad } from "./squad_loader";
import { GenerateSquadList, SpawnOrOperateSquad, SpawnTemplate } from "./squad_utils";

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    // TODO: hardcode SPAWN_SEQUENCE
]

export class InitialSquad extends SpawnConstructibleSquad {
    constructor(){
        super("initial_squad", SPAWN_SEQUENCE);
    }

    IsActive(): boolean {
        // TODO: turn off this squad when can handle cooler squad
        return true
    }
}
