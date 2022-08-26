export interface ICell {
    id: number // id > 0 - id корабля, id: 0 - пусто
    shot: boolean // был или нет выстрел в эту клетку
    // если нет - пустое поле
    // если да и не попал - мимо - точка
    // если да и ранил - попал - огонь
    // если да и убил - убил - огонь и показать корабль
}

export type FieldType = ICell[][]

export enum StatusEnum {
    alive = "alive",
    injury = "injury",
    killed = "killed"
}

export enum PlacingTypeEnum {
    notSelect = "notSelect",
    manually = "manually",
    randomly = "randomly"
}


export interface IShip {
    id: number // id = 1...10
    size: number // размер, 1...4
    status: StatusEnum // целый, ранен, убит
    hitCount: number // 0...size - количество ячеек, в которые попал противник
    xIndex: number // 0...9 - положение
    zIndex: number // 0...9
    rotateAngle: number // 0...3 - поворот
}

export interface IShips {
    [key: number]: IShip
}

export interface ICoord {
    xIndex: number
    zIndex: number
}

// алгоритм
// 1 - выбирается ячейка на поле противника в которую еще не было выстрела (ceil.shot = false)
// 2 - если ceil.id = 0 - мимо, ceil.shot = true
// 3 - если ceil.id != 0, ship(id).hitCount += 1, добавить огонь на эту клетку
// 5 - если ship(id).hitCount != ship(id).size ---> ship(id).status = "injury"
// 4 - если ship(id).hitCount = ship(id).size ---> ship(id).status = "killed" - показать корабль

export enum MoverEnum {
    user = "user",
    pc = "pc"
}

export enum MoveStatusEnum {
    miss = "miss",
    injury = "injury",
    killed = "killed"
}

export interface IMoveListItem {
    mover: MoverEnum
    coord: ICoord
    status: MoveStatusEnum
}