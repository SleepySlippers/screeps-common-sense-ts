import { ErrorMapper } from "utils/ErrorMapper";
import { spawn_constructible_squads } from './squads/squad_loader';
import { Squad } from './squads/squad_base';

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    spawner_id: Id<StructureSpawn>;
    role_name: string;
    settings: any;
    current_state: any;
  }

  interface SpawnMemory {
    sources: Id<Source>[];
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = //ErrorMapper.wrapLoop(
  () => {
  // console.log(`Current game tick is ${Game.time}. No way. Wait`);

  if (Game.cpu.bucket == 10000) {
    Game.cpu.generatePixel();
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  let squads: Squad[] = [];
  for (const spawn_key in Game.spawns) {
    const spawner = Game.spawns[spawn_key];
    for (const spawn_constructible_squad of spawn_constructible_squads) {
      squads.push(spawn_constructible_squad().construct_from_spawner(spawner));
    }
  }

  for (const squad of squads) {
    squad.Operate();
  }

  for (const spawn_key in Game.spawns) {
    const spawner = Game.spawns[spawn_key];
    const towers: StructureTower[] = spawner.room.find(FIND_STRUCTURES, {
      filter: (i) => i.structureType == STRUCTURE_TOWER
    });
    for (const tower of towers){
      const hostile_creep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (hostile_creep){
        tower.attack(hostile_creep);

      }
    }
  }
}
//);
