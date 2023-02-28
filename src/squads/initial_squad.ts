import { SpawConstructibleSquad, Squad } from "./squad_loader";

export default class InitialSquad implements Squad, SpawConstructibleSquad {
    construct_from_spawn(spawner: StructureSpawn): Squad {
        throw new Error("Method not implemented.");
    }
    squad_name: string = "";
    IsActive(): boolean {
        throw new Error("Method not implemented.");
    }
    Operate(): void {
        throw new Error("Method not implemented.");
    }

}
