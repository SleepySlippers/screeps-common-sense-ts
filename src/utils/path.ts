export function MoveTowards(creep: Creep, pos: RoomPosition | { pos: RoomPosition }, highlight_path = false){
    if (highlight_path){
        creep.moveTo(pos, { visualizePathStyle: { stroke: '#ffaa00' } });
    } else {
        creep.moveTo(pos);
    }
}
