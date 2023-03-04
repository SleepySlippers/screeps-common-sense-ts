import { contains } from './utils';
// TODO: move memory staff here

if (!Memory.spawns) {
    Memory.spawns = {};
}

export function GetSourcesByDistance(spawner: StructureSpawn): Id<Source>[] {
    if (!Memory.spawns[spawner.name]) {
        Memory.spawns[spawner.name] = { sources: [] };
    }
    if (Memory.spawns[spawner.name].sources.length > 0 && Game.time % 128 != 0) {
        return Memory.spawns[spawner.name].sources;
    }
    let srcs: Id<Source>[] = [];
    while (true) {
        const src = spawner.pos.findClosestByRange(FIND_SOURCES, {
            filter: (i) => !contains(srcs, i.id)
        });
        if (!src) {
            break;
        }
        srcs.push(src.id);
    }
    return Memory.spawns[spawner.name].sources = srcs;
}
