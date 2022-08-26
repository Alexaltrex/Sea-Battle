import {consts} from "../consts/consts";

export const getXIndex = (coord: number, userField = true): number => {
    const x0 = userField
        ? -(10 * consts.CELL_SIZE + 0.5 * consts.DISTANCE_BETWEEN)
        : 0.5 * consts.DISTANCE_BETWEEN;
    return Math.floor((coord - x0) / consts.CELL_SIZE)
}
export const getZIndex = (coord: number): number => {
    const x0 = -5 * consts.CELL_SIZE;
    return Math.floor((coord - x0) / consts.CELL_SIZE)
}

export const getCoordinateXByIndex = (index: number, userField = true): number => {
    const x0 = userField
        ? -(10 * consts.CELL_SIZE + 0.5 * consts.DISTANCE_BETWEEN)
        : 0.5 * consts.DISTANCE_BETWEEN;
    return consts.CELL_SIZE * index + x0 + 0.5 * consts.CELL_SIZE
}

export const getCoordinateZByIndex = (index: number): number => {
    const x0 = -5 * consts.CELL_SIZE;
    return consts.CELL_SIZE * index + x0 + 0.5 * consts.CELL_SIZE
}
