import { NaiveAttackerInst } from "roles/naive_attacker";
import { SpawnTemplate } from './squad_utils';
import { NaiveAttackerSettings } from '../roles/naive_attacker';
import { SpawnConstructibleSquad } from './squad_base';
import { NaiveClaimerInst, NaiveClaimerSettings } from '../roles/naive_claimer';
import { DoubleSquadInst } from './double_squad';

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    // new SpawnTemplate(NaiveAttackerInst, "d#p#spwn",
    //     {
    //         target_room_name: 'E59N17',
    //     } as NaiveAttackerSettings,
    //     2),
    new SpawnTemplate(NaiveClaimerInst, "E59N17",
        {
            target_room_name: 'E59N17'
        } as NaiveClaimerSettings,
    ),
    // new SpawnTemplate(NaiveAttackerInst, "heavy",
    //     {
    //         target_room_name: 'E58N16',
    //         is_heavy: true
    //     } as NaiveAttackerSettings,
    //     4),
]

export class AttackSquad extends SpawnConstructibleSquad {
    constructor() {
        super("attack_squad", SPAWN_SEQUENCE);
    }

    IsActive(): boolean {
        return DoubleSquadInst.construct_from_spawner(this.spawner).IsActive();
    }
}

export const AttackSquadInst = new AttackSquad();
