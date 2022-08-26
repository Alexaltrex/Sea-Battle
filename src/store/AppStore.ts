import {action, computed, makeObservable, observable} from "mobx";
import {FieldType, ICell, ICoord, IMoveListItem, IShips, MoverEnum, PlacingTypeEnum, StatusEnum} from "../types/types";
import {aroundPointsDisplacement, checkOutRangeError} from "../helpers/checkPlacingError";

const defaultField = () => {
    const result = [] as ICell[][]
    for (let i = 0; i < 10; i++) {
        result[i] = [] as ICell[]
        for (let j = 0; j < 10; j++) {
            result[i][j] = {id: 0, shot: false}
        }
    }
    return result
}

export const defaultShips = {
    "1": {id: 1, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "2": {id: 2, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "3": {id: 3, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "4": {id: 4, size: 1, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "5": {id: 5, size: 2, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "6": {id: 6, size: 2, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "7": {id: 7, size: 2, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "8": {id: 8, size: 3, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "9": {id: 9, size: 3, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
    "10": {id: 10, size: 4, status: StatusEnum.alive, hitCount: 0, xIndex: 0, zIndex: 0, rotateAngle: 0},
}

export class AppStore {
    gameRunning = false
    placing = false // режим размещения кораблей
    placingType = PlacingTypeEnum.notSelect // тип режима размещения - ручной или автоматический
    placingError = false // ошибка размещения корабля
    currentPlacingSize = 0 // размер выбранного корабля
    selectedShipId = 0 // id выбранного для размещения корабля
    placedShipIndexes = [] as number[] // массив индексов размещенных кораблей
    onUserField = false // курсор на поле пользователя
    onEnemyField = false // курсор на поле противника
    xIndex = 0 // индексы положения курсора на своем поле
    zIndex = 0
    rotateAngle = 0 // угол поворота засмещаемого корабля
    userField = JSON.parse(JSON.stringify(defaultField())) as FieldType
    userShips = {} as IShips // JSON.parse(JSON.stringify(defaultShips)) as IShips
    enemyField = JSON.parse(JSON.stringify(defaultField())) as FieldType
    enemyShips = {} as IShips
    userMove = false // очередь хода пользователя

    userInjuredCell = null as null | ICoord // последняя ячейка юзера (если есть) которую ранил противник
    userInjuredCells = [] as ICoord[] // массив раненных ячеек одного корабля
    enemyMoveCount = 0 // используется для повторных ходов противника

    moveList = [] as IMoveListItem[] // запись ходов игроков
    winner = null as null | MoverEnum // победитель
    showWinnerModal = false

    constructor() {
        makeObservable(this,
            {
                gameRunning: observable,
                placing: observable,
                placingType: observable,
                placingError: observable,
                currentPlacingSize: observable,
                selectedShipId: observable,
                placedShipIndexes: observable,
                onUserField: observable,
                onEnemyField: observable,
                rotateAngle: observable,
                xIndex: observable,
                zIndex: observable,
                userField: observable,
                enemyField: observable,
                userShips: observable,
                enemyShips: observable,
                userMove: observable,
                userInjuredCell: observable,
                userInjuredCells: observable,
                enemyMoveCount: observable,
                moveList: observable,
                winner: observable,
                showWinnerModal: observable,

                setGameRunning: action.bound,
                setPlacing: action.bound,
                setPlacingType: action.bound,
                setCurrentPlacingSize: action.bound,
                setSelectedShipId: action.bound,
                setPlacedShipIndexes: action.bound,
                clearPlacedShipIndexes: action.bound,
                setOnUserField: action.bound,
                setOnEnemyField: action.bound,
                setPlacingError: action.bound,
                setRotateAngle: action.bound,
                clearRotateAngle: action.bound,
                setXIndex: action.bound,
                setZIndex: action.bound,
                setUserField: action.bound,
                addShipToUserField: action.bound,
                resetUserField: action.bound,
                setEnemyField: action.bound,
                setShotAtEnemyField: action.bound,
                resetEnemyField: action.bound,
                setUserShips: action.bound,
                setEnemyShips: action.bound,
                setHitOnEnemyShip: action.bound,
                setHitOnUserShip: action.bound,
                setUserMove: action.bound,
                setUserInjuredCell: action.bound,
                setShotAtUserField: action.bound,
                setEnemyMoveCount: action.bound,
                addToMoveList: action.bound,
                resetMoveList: action.bound,
                populateUserFieldAroundKilledShip: action.bound,
                populateEnemyFieldAroundKilledShip: action.bound,
                setWinner: action.bound,
                setShowWinnerModal: action.bound,
                addToUserInjuredCells: action.bound,
                clearUserInjuredCells: action.bound,

                userShipsKilledCount: computed,
                enemyShipsKilledCount: computed,
            }
        )
    }

    setGameRunning(gameRunning: boolean) {
        this.gameRunning = gameRunning
    }

    setPlacing(placing: boolean) {
        this.placing = placing
    }

    setPlacingType(placingType: PlacingTypeEnum) {
        this.placingType = placingType
    }

    setPlacingError(placingError: boolean) {
        this.placingError = placingError
    }

    setCurrentPlacingSize(currentPlacingSize: number) {
        this.currentPlacingSize = currentPlacingSize
    }

    setSelectedShipId(id: number) {
        this.selectedShipId = id
    }

    setPlacedShipIndexes(index: number) {
        this.placedShipIndexes.push(index)
    }

    clearPlacedShipIndexes() {
        this.placedShipIndexes = []
    }

    setOnUserField(onUserField: boolean) {
        this.onUserField = onUserField
    }

    setOnEnemyField(onEnemyField: boolean) {
        this.onEnemyField = onEnemyField
    }

    setRotateAngle() {
        this.rotateAngle -= 1 //Math.PI / 2
    }

    clearRotateAngle() {
        this.rotateAngle = 0
    }

    setXIndex(xIndex: number) {
        this.xIndex = xIndex
    }

    setZIndex(zIndex: number) {
        this.zIndex = zIndex
    }

    setUserField(field: FieldType) {
        this.userField = field
    }

    addShipToUserField(
        id: number,
        xIndex: number,
        zIndex: number,
        size: number,
        rotateAngle: number) {
        const xDelta = Math.round((size - 1) * Math.cos(rotateAngle * Math.PI / 2));
        const zDelta = Math.round(-(size - 1) * Math.sin(rotateAngle * Math.PI / 2));
        const xDeltaStep = xDelta === 0 ? 0 : xDelta > 0 ? 1 : -1;
        const zDeltaStep = zDelta === 0 ? 0 : zDelta > 0 ? 1 : -1;
        for (let i = 0; i < size; i++) {
            const xCurr = xIndex + i * xDeltaStep;
            const zCurr = zIndex + i * zDeltaStep;
            this.userField[xCurr][zCurr].id = id
        }
    }

    resetUserField() {
        this.userField = JSON.parse(JSON.stringify(defaultField())) as FieldType
    }

    setEnemyField(field: FieldType) {
        this.enemyField = field
    }

    setShotAtEnemyField(xIndex: number, zIndex: number) {
        this.enemyField[xIndex][zIndex].shot = true
    }

    setShotAtUserField(xIndex: number, zIndex: number) {
        this.userField[xIndex][zIndex].shot = true
    }

    resetEnemyField() {
        this.enemyField = JSON.parse(JSON.stringify(defaultField())) as FieldType
    }

    setUserShips(userShips: IShips) {
        this.userShips = userShips
    }

    setHitOnEnemyShip(shipId: number) {
        this.enemyShips[shipId].hitCount += 1;
        if (this.enemyShips[shipId].hitCount === this.enemyShips[shipId].size) {
            this.enemyShips[shipId].status = StatusEnum.killed
        } else {
            this.enemyShips[shipId].status = StatusEnum.injury
        }
    }

    setHitOnUserShip(shipId: number) {
        this.userShips[shipId].hitCount += 1;
        if (this.userShips[shipId].hitCount === this.userShips[shipId].size) {
            this.userShips[shipId].status = StatusEnum.killed
        } else {
            this.userShips[shipId].status = StatusEnum.injury
        }
    }

    setEnemyShips(enemyShips: IShips) {
        this.enemyShips = enemyShips
    }

    setUserMove(userMove: boolean) {
        this.userMove = userMove
    }

    setUserInjuredCell(coord: ICoord | null) {
        this.userInjuredCell = coord
    }

    setEnemyMoveCount() {
        this.enemyMoveCount += 1
    }

    addToMoveList(moveListItem: IMoveListItem) {
        this.moveList.push(moveListItem)
    }

    resetMoveList() {
        this.moveList = []
    }

    populateUserFieldAroundKilledShip(shipId: number) {
        const size = this.userShips[shipId].size;
        const rotateAngle = this.userShips[shipId].rotateAngle;
        const xIndex = this.userShips[shipId].xIndex;
        const zIndex = this.userShips[shipId].zIndex;

        const xDelta = Math.round((size - 1) * Math.cos(rotateAngle * Math.PI / 2));
        const zDelta = Math.round(-(size - 1) * Math.sin(rotateAngle * Math.PI / 2));
        const xDeltaStep = xDelta === 0 ? 0 : xDelta > 0 ? 1 : -1;
        const zDeltaStep = zDelta === 0 ? 0 : zDelta > 0 ? 1 : -1;

        // обход ячеек, занимаемых кораблем
        for (let i = 0; i < size; i++) {
            const xCurr = xIndex + i * xDeltaStep;
            const zCurr = zIndex + i * zDeltaStep;

            // обход ячеек вокруг ячейки, занимаемой кораблем
            for (let i = 0; i < aroundPointsDisplacement.length; i++) {
                const xi = xCurr + aroundPointsDisplacement[i][0];
                const zi = zCurr + aroundPointsDisplacement[i][1];

                // если ячейка внутри игрового поля
                if (!checkOutRangeError(xi, zi)) {
                    this.userField[xi][zi].shot = true;
                }
            }
        }
    }

    populateEnemyFieldAroundKilledShip(shipId: number) {
        const size = this.enemyShips[shipId].size;
        const rotateAngle = this.enemyShips[shipId].rotateAngle;
        const xIndex = this.enemyShips[shipId].xIndex;
        const zIndex = this.enemyShips[shipId].zIndex;

        const xDelta = Math.round((size - 1) * Math.cos(rotateAngle * Math.PI / 2));
        const zDelta = Math.round(-(size - 1) * Math.sin(rotateAngle * Math.PI / 2));
        const xDeltaStep = xDelta === 0 ? 0 : xDelta > 0 ? 1 : -1;
        const zDeltaStep = zDelta === 0 ? 0 : zDelta > 0 ? 1 : -1;

        // обход ячеек, занимаемых кораблем
        for (let i = 0; i < size; i++) {
            const xCurr = xIndex + i * xDeltaStep;
            const zCurr = zIndex + i * zDeltaStep;

            // обход ячеек вокруг ячейки, занимаемой кораблем
            for (let i = 0; i < aroundPointsDisplacement.length; i++) {
                const xi = xCurr + aroundPointsDisplacement[i][0];
                const zi = zCurr + aroundPointsDisplacement[i][1];

                // если ячейка внутри игрового поля
                if (!checkOutRangeError(xi, zi)) {
                    this.enemyField[xi][zi].shot = true;
                }
            }
        }
    }

    setWinner(winner: null | MoverEnum) {
        this.winner = winner
    }

    setShowWinnerModal(showWinnerModal: boolean) {
        this.showWinnerModal = showWinnerModal
    }

    addToUserInjuredCells(cell: ICoord) {
        this.userInjuredCells.push(cell)
    }

    clearUserInjuredCells() {
        this.userInjuredCells = [];
    }


    get userShipsKilledCount() {
        return Object.values(this.userShips).reduce((acc, curr) => {
           if (curr.status === StatusEnum.killed)  {
               acc +=1;
           }
           return acc
        }, 0)
    }

    get enemyShipsKilledCount() {
        return Object.values(this.enemyShips).reduce((acc, curr) => {
            if (curr.status === StatusEnum.killed)  {
                acc +=1;
            }
            return acc
        }, 0)
    }

}