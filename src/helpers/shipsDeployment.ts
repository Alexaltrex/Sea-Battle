import {FieldType, ICell, IShips, StatusEnum} from "../types/types";
import {defaultShips} from "../store/AppStore";
import {checkPlacingError} from "./checkPlacingError";
import {log} from "util";

// случайное целое в диапазоне [min, max]
export const getRandomIntInclusive = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

// выбор случайного id, не входящего в deploymentIdArray
export const getRandomId = (deploymentIdArray: number[]): number => {
    let chosen = false
    let result = 0
    while (!chosen) {
        const  id = getRandomIntInclusive(1, 10);
        if (!deploymentIdArray.includes(id)) {
            chosen = true;
            result = id
        }
    }
    return result
}

//
const pushShipDataInField = (id: number, xIndex: number, zIndex: number, size: number, rotateAngle: number, field: FieldType): void => {
    const xDelta = Math.round((size - 1) * Math.cos(rotateAngle * Math.PI / 2));
    const zDelta = Math.round(-(size - 1) * Math.sin(rotateAngle * Math.PI / 2));
    const xDeltaStep = xDelta === 0 ? 0 : xDelta > 0 ? 1 : -1;
    const zDeltaStep = zDelta === 0 ? 0 : zDelta > 0 ? 1 : -1;

    for (let i = 0; i < size; i++) {
        const xCurr = xIndex + i * xDeltaStep;
        const zCurr = zIndex + i * zDeltaStep;
        // console.log(xCurr, zCurr)
        // console.log(field[xCurr][zCurr])
        field[xCurr][zCurr].id = id
    }
}

// случайное размещение кораблей на игровом поле
export const shipsDeployment = (): {ships: IShips, field: FieldType} => {
    const field = [[{id: 0, shot: false}]] as FieldType;
    for (let x = 0; x < 10; x++) {
        field[x] = [] as ICell[]
        for (let z = 0; z < 10; z++) {
            field[x][z] = {id: 0, shot: false}
        }
    }

    const ships: IShips = {
        "1": { id: 1, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "2": { id: 2, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "3": { id: 3, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "4": { id: 4, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "5": { id: 5, size: 2, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "6": { id: 6, size: 2, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "7": { id: 7, size: 2, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "8": { id: 8, size: 3, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "9": { id: 9, size: 3, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
        "10": { id: 10, size: 4, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0 },
    };

    const deploymentIdArray = [] as number[]

    while (deploymentIdArray.length < 10) { // пока не разместим все корабли
        const id = getRandomId(deploymentIdArray);
        let placingError = true
        let xIndex = 0;
        let zIndex = 0;
        let rotateAngle = 0;
        while (placingError) { // генерируем правильные данные корабля
            const xIndexCurrent = getRandomIntInclusive(0, 9);
            const zIndexCurrent = getRandomIntInclusive(0, 9);
            const rotateAngleCurrent = getRandomIntInclusive(0, 3);
            const placingErrorCurrent = checkPlacingError(
                xIndexCurrent,
                zIndexCurrent,
                ships[id].size,
                rotateAngleCurrent,
                field
            )
            if (!placingErrorCurrent) {
                placingError = false
                xIndex = xIndexCurrent;
                zIndex = zIndexCurrent;
                rotateAngle = rotateAngleCurrent;
            }
        }

        // заносим сгенерированные данные в ships
        ships[id].xIndex = xIndex;
        ships[id].zIndex = zIndex;
        ships[id].rotateAngle = rotateAngle;


        // заносим сгенерированные данные в deploymentIdArray
        deploymentIdArray.push(id)

        // заносим сгенерированные данные в field
        pushShipDataInField(id, xIndex, zIndex, ships[id].size, rotateAngle, field)

    }
    return {field, ships}
}