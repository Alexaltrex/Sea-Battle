import {FieldType, ICoord, IShips} from "../types/types";
import {getRandomIntInclusive} from "./shipsDeployment";
import {checkOutRangeError} from "./checkPlacingError";

// получить координаты случайной ячейки, в которую еще не было выстрела
export const getRandomIndexes = (userField: FieldType): {xIndex: number, zIndex: number} => {
    let noShot = false;
    let xIndex = 0;
    let zIndex = 0;

    while (!noShot) {
        xIndex = getRandomIntInclusive(0, 9);
        zIndex = getRandomIntInclusive(0, 9);
        if (!userField[xIndex][zIndex].shot) {
            noShot = true
        }
    }
    return { xIndex, zIndex }
}

// выбрать соседнюю с раненной непрострелянную ячейку, из 4 возможных
export const getNearbyCellFrom4 = (injuredCell: ICoord, userField: FieldType): ICoord | null => {
    // возвращает
    // или координаты соседней непростреляной ячейки
    // или null если такой радом нет
    // let xIndexNearby = 0;
    // let zIndexNearby = 0;

    // массив смещений ячеек области вокруг заданной ячейки
    const aroundPointsDisplacement = [[0, -1], [-1, 0], [1, 0], [0, 1]];

    let nearbyCell = null as null | ICoord;
    for (let i = 0; i < aroundPointsDisplacement.length; i++) {
        const xi = injuredCell.xIndex + aroundPointsDisplacement[i][0];
        const zi = injuredCell.zIndex + aroundPointsDisplacement[i][1];
        // если есть ячейка, которая внутри игрового поля и непрострелянная, присваиваем nearbyCell и выходим
        if (!checkOutRangeError(xi, zi) && !userField[xi][zi].shot) {
            nearbyCell = {
                xIndex: xi,
                zIndex: zi
            }
            break;
        }
    }
    return nearbyCell
}

function getMaxOfArray(numArray: number[]) {
    return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray: number[]) {
    return Math.min.apply(null, numArray);
}

// выбрать соседнюю с раненной непрострелянную ячейку, из 2 возможных
export const getNearbyCellFrom2 = (injuredCells: ICoord[], userField: FieldType): ICoord | null => {
    // возвращает
    // или координаты соседней непростреляной ячейки
    // или null если такой радом нет

    let nearbyCell = null as null | ICoord;
    const cellMin = { xIndex:0, zIndex: 0 } as ICoord;
    const cellMax = { xIndex:0, zIndex: 0 } as ICoord;

    const cellsForChoose = [] as ICoord[]

    // если раненные точки расположены горизонтально
    if (injuredCells[0].zIndex === injuredCells[1].zIndex) {
        const zI = injuredCells[0].zIndex;
        const xIMin = getMinOfArray(injuredCells.map(cell => cell.xIndex));
        const xIMax = getMaxOfArray(injuredCells.map(cell => cell.xIndex));
        cellsForChoose.push({xIndex: xIMin - 1, zIndex: zI})
        cellsForChoose.push({xIndex: xIMax + 1, zIndex: zI})
    }
    // если раненные точки расположены вертикально
    if (injuredCells[0].xIndex === injuredCells[1].xIndex) {
        const xI = injuredCells[0].xIndex;
        const zIMin = getMinOfArray(injuredCells.map(cell => cell.zIndex));
        const zIMax = getMaxOfArray(injuredCells.map(cell => cell.zIndex));
        cellsForChoose.push({xIndex: xI, zIndex: zIMin - 1})
        cellsForChoose.push({xIndex: xI, zIndex: zIMax + 1})
    }

    //!checkOutRangeError(xi, zi) && !userField[xi][zi].shot

    for (let i = 0; i < cellsForChoose.length; i++ ) {
        if (
            !checkOutRangeError(cellsForChoose[i].xIndex, cellsForChoose[i].zIndex) &&
            !userField[cellsForChoose[i].xIndex][cellsForChoose[i].zIndex].shot
        ) {
            nearbyCell = cellsForChoose[i]
            break;
        }
    }

    return nearbyCell
}

