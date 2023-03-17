export function contains(arr: any[], elem: any) {
    return arr.indexOf(elem) > -1;
}

export function LogErr(creep: Creep, message: any): void {
    console.log("Error in creep `" + creep.name + "` from here:" + creep.pos + ": " + message);
}

export const ROOM_MAX_COORD = 49;
export const ROOM_MIN_COORD = 0;
