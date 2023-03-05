import { NaiveAttackerInst } from "roles/naive_attacker";
import { SpawnTemplate } from './squad_utils';
import { NaiveAttackerSettings } from '../roles/naive_attacker';
import { SpawnConstructibleSquad } from './squad_base';
import { NaiveClaimerInst, NaiveClaimerSettings } from '../roles/naive_claimer';

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    new SpawnTemplate(NaiveAttackerInst, "d#p#spwn",
        {
            target_room_name: 'E59N17',
        } as NaiveAttackerSettings,
        2),
    new SpawnTemplate(NaiveClaimerInst, "E59N17",
        {
            target_room_name: 'E59N17'
        } as NaiveClaimerSettings,
    )
]

export class AttackSquad extends SpawnConstructibleSquad {
    constructor() {
        super("attack_squad", SPAWN_SEQUENCE);
    }

    IsActive(): boolean {
        return Game.time < 46274495 + 4000;
    }
}

export const AttackSquadInst = new AttackSquad();
