export function contains(arr: any[], elem: any) {
    return arr.indexOf(elem) > -1;
}

export function LogErr(creep: Creep, message: any): void {
    console.log("Error in creep `" + creep.name + "`: " + message);
}
