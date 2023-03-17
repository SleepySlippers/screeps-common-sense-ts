import { NaiveAttackerInst } from "roles/naive_attacker";
import { SpawnTemplate } from './squad_utils';
import { NaiveAttackerSettings } from '../roles/naive_attacker';
import { SpawnConstructibleSquad } from './squad_base';
import { NaiveClaimerInst, NaiveClaimerSettings } from '../roles/naive_claimer';
import { DoubleSquadInst } from './double_squad';
import { NaiveHarvesterInst, SourceMode, TargetMode, NaiveHarvesterSettings } from '../roles/naive_harvester';
import { NaiveExplorer, NaiveExplorerInst, NaiveExplorerSettings } from '../roles/naive_explorer';
import { NaiveTricker, NaiveTrickerInst, NaiveTrickerSettings } from '../roles/naive_tricker';
import { NaiveHealerInst, NaiveHealerSettings } from '../roles/naive_healer';

const SPAWN_SEQUENCE: SpawnTemplate[] = [
    // new SpawnTemplate(NaiveAttackerInst, "light",
    //     {
    //         target_room_name: 'E58N17',
    //     } as NaiveAttackerSettings,
    //     2),
    // new SpawnTemplate(NaiveClaimerInst, "E59N17",
    //     {
    //         target_room_name: 'E59N17'
    //     } as NaiveClaimerSettings,
    // ),
    // new SpawnTemplate(NaiveHarvesterInst, "dd#foreign#bld",
    //     {
    //         source: SourceMode.Primary,
    //         target: TargetMode.Build,
    //         double_worker: true,
    //         double_carry: true,
    //         foreign_room: 'E58N16',
    //     } as NaiveHarvesterSettings, 1),
    // new SpawnTemplate(NaiveTrickerInst, "hehe",
    //     {
    //         target_room_name: 'E58N14'
    //     } as NaiveTrickerSettings
    // ),
    // new SpawnTemplate(NaiveHealerInst, "light",
    //     {
    //         default_room_name: 'E58N15'
    //     } as NaiveHealerSettings
    // ),
    // new SpawnTemplate(NaiveExplorerInst, "light",
    //     {
    //         target_room_name: 'E59N12'
    //     } as NaiveExplorerSettings
    // ),
    // new SpawnTemplate(NaiveAttackerInst, "heavy",
    //     {
    //         target_room_name: 'E59N12',
    //         is_heavy: true
    //     } as NaiveAttackerSettings,
    //     4),
    // new SpawnTemplate(NaiveClaimerInst, "E58N16",
    //     {
    //         target_room_name: 'E58N16'
    //     } as NaiveClaimerSettings,
    // ),
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
