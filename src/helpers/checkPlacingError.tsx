import {FieldType} from "../types/types";

export const aroundPointsDisplacement = [ // массив смещений ячеек области вокруг заданной ячейки
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
];

// проверка на то, что область (ее часть, находящаяся внутри игрового поля) вокруг ячейка толщиной в одну ячейку свободна
const checkOverlayError = (xIndex: number, zIndex: number, userField: FieldType) => {
    for (let i = 0; i < aroundPointsDisplacement.length; i++) {
        const xi = xIndex + aroundPointsDisplacement[i][0];
        const zi = zIndex + aroundPointsDisplacement[i][1];

        // если ячейка внутри игрового поля проверяем что она пустая
        if (!checkOutRangeError(xi, zi)) {
            if (userField[xi][zi].id !== 0) { // если не свободна, возвращаем ошибку
                return true
            }
        }
    }
    return false
}

// проверка на то,что ячейка находится внутри игрового поля
// возвращает true если ошибка
export const checkOutRangeError = (xIndex: number, zIndex: number): boolean => {
    return xIndex < 0 || xIndex > 9 || zIndex < 0 || zIndex > 9
}

// проверка на ошибку размещения корабля
export const checkPlacingError = (
    xIndex: number,
    zIndex: number,
    currentPlacingSize: number,
    rotateAngle: number,
    userField: FieldType
): boolean => {
    const xDelta = Math.round((currentPlacingSize - 1) * Math.cos(rotateAngle * Math.PI / 2));
    const zDelta = Math.round(-(currentPlacingSize - 1) * Math.sin(rotateAngle * Math.PI / 2));
    const xDeltaStep = xDelta === 0 ? 0 : xDelta > 0 ? 1 : -1;
    const zDeltaStep = zDelta === 0 ? 0 : zDelta > 0 ? 1 : -1;
    for (let i = 0; i < currentPlacingSize; i++) {
        const xCurr = xIndex + i * xDeltaStep;
        const zCurr = zIndex + i * zDeltaStep;
        if (checkOutRangeError(xCurr, zCurr) || checkOverlayError(xCurr, zCurr, userField)) {
            return true
        }
    }
    return false
}