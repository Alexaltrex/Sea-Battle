import React, {useEffect} from "react";
import * as THREE from "three";
import {ShipModel} from "./ShipModel";
import {observer} from "mobx-react-lite";
import {store} from "../../store/RootStore";
import {getCoordinateXByIndex, getCoordinateZByIndex} from "../../helpers/getDiscreteCoord";
import {checkPlacingError} from "../../helpers/checkPlacingError";
import {shipsDeployment} from "../../helpers/shipsDeployment";
import {ShotModel} from "./ShotModel";
import {MissModel} from "./MissModel";
import {FireModel} from "./Fire/FireModel";
import {ICoord, MoverEnum, MoveStatusEnum, PlacingTypeEnum, StatusEnum} from "../../types/types";
import {getNearbyCellFrom2, getNearbyCellFrom4, getRandomIndexes} from "../../helpers/makeEnemyMove";
import {EnemyField} from "./EnemyField";
import {UserField, userFieldPosition} from "./UserField";
import {FieldScale} from "./models/FieldScale";
import {consts} from "../../consts/consts";
import {Base} from "./Base";

export const GameField = observer(() => {
    const {
        appStore: {
            gameRunning, setGameRunning,
            placing, setPlacing,
            placingType, setPlacingType,
            onUserField,
            currentPlacingSize,
            rotateAngle,
            xIndex,
            zIndex,
            userField, setUserField,
            placingError, setPlacingError,
            enemyShips, setEnemyShips,
            enemyField, setEnemyField,
            userShips, setUserShips,
            placedShipIndexes, clearPlacedShipIndexes,
            userMove, setUserMove,
            onEnemyField,
            userInjuredCell, setUserInjuredCell,
            setShotAtUserField, setHitOnUserShip,
            enemyMoveCount, setEnemyMoveCount,
            addToMoveList, populateUserFieldAroundKilledShip,
            userShipsKilledCount, enemyShipsKilledCount,
            setWinner, setShowWinnerModal,
            userInjuredCells, addToUserInjuredCells, clearUserInjuredCells,
        }
    } = store

    // проверка на ошибку при размещении корабля юзером
    useEffect(() => {
        if (placing && onUserField && currentPlacingSize !== 0) {
            const placingError = checkPlacingError(xIndex, zIndex, currentPlacingSize, rotateAngle, userField)
            setPlacingError(placingError);
        }
    }, [placing, onUserField, currentPlacingSize, rotateAngle, xIndex, zIndex])

    // размещение кораблей противника при запуске игры
    useEffect(() => {
        if (gameRunning) {
            const {field, ships} = shipsDeployment();
            setEnemyShips(ships);
            setEnemyField(field);
        }
    }, [gameRunning])

    // автоматическое размещение кораблей пользователя
    useEffect(() => {
        if (placingType === PlacingTypeEnum.randomly) {
            const {field, ships} = shipsDeployment();
            setUserField(field)
            setUserShips(ships);
            setPlacing(false);
            setUserMove(true);
            setPlacingType(PlacingTypeEnum.notSelect)
        }
    }, [placingType])

    // ручное размещение кораблей окончено
    useEffect(() => {
        if (placing && placedShipIndexes.length === 10) {
            setPlacing(false);
            setPlacingType(PlacingTypeEnum.notSelect);
            clearPlacedShipIndexes();
            setUserMove(true);
        }
    }, [placing, placedShipIndexes.length])

    const makeEnemyMove = () => {
        if (!userMove && gameRunning && !placing) {
            let newCellToShot = {xIndex: 0, zIndex: 0} as ICoord;

            if (!userInjuredCell) { // если раненной нет, выбираем случайную непрострелянную ячейку
                newCellToShot = {...getRandomIndexes(userField)};
            } else { // если раненная есть, пытаемся найти соседнюю непрострелянную
                const nearbyCell = getNearbyCellFrom4(userInjuredCell, userField);
                if (nearbyCell) { // если соседняя непрострелянная существует
                    newCellToShot = {...nearbyCell}
                } else { // если соседней непрострелянной нет
                    setUserInjuredCell(null);
                    // выбираем случайную непрострелянную
                    newCellToShot = {...getRandomIndexes(userField)};
                }
            }

            // анализ newCellToShot
            // если промах - переход хода
            // если ранение - прираванивание новой userInjuredCell, новый ход
            // если убил - userInjuredCell = null, автозаполнение ближайших ячеек, новый ход
            setShotAtUserField(newCellToShot.xIndex, newCellToShot.zIndex); // запись выстрела в userField
            const id = userField[newCellToShot.xIndex][newCellToShot.zIndex].id;
            const moveStatus = id === 0
                ? MoveStatusEnum.miss
                : userShips[id].hitCount === userShips[id].size - 1
                    ? MoveStatusEnum.killed
                    : MoveStatusEnum.injury;
            addToMoveList({
                mover: MoverEnum.pc,
                coord: newCellToShot,
                status: moveStatus
            })

            if (id) { // если попал
                if (userShips[id].hitCount === userShips[id].size - 1) { // если убил
                    setUserInjuredCell(null);
                    populateUserFieldAroundKilledShip(id);
                } else { // если ранил
                    setUserInjuredCell(newCellToShot);
                }
                setHitOnUserShip(userField[newCellToShot.xIndex][newCellToShot.zIndex].id); // запись попадения в userShips
                setEnemyMoveCount(); // для повторного хода противника
            } else { // если промахнулся
                setUserMove(true) // переход хода к пользователю
            }
        }
    }

    const makeEnemyMove2 = () => {
        if (!userMove && gameRunning && !placing) {
            let newCellToShot = {xIndex: 0, zIndex: 0} as ICoord;

            // если массив ячеек с ранениями пуст, выбираем случайную непрострелянную ячейку
            if (userInjuredCells.length === 0) {
                newCellToShot = {...getRandomIndexes(userField)};
            }
            // если массив ячеек с ранениями содержит 1 ячейку, выбираем одну непрострелянную из 4 возможных
            if (userInjuredCells.length === 1) {
                const nearbyCell = getNearbyCellFrom4(userInjuredCells[0], userField);
                if (nearbyCell) { // если соседняя непрострелянная существует
                    newCellToShot = {...nearbyCell}
                }
            }
            // если массив ячеек с ранениями содержит >=2 ячеек, выбираем одну непрострелянную из 2 возможных
            if (userInjuredCells.length > 1) {
                const nearbyCell = getNearbyCellFrom2(userInjuredCells, userField);
                if (nearbyCell) { // если соседняя непрострелянная существует
                    newCellToShot = {...nearbyCell}
                }
            }

            // анализ newCellToShot
            // если промах - переход хода,
            // если ранение - добавление в userInjuredCells новой ячейки, новый ход
            // если убил - userInjuredCells = [], автозаполнение ближайших ячеек, новый ход
            setShotAtUserField(newCellToShot.xIndex, newCellToShot.zIndex); // запись выстрела в userField
            const id = userField[newCellToShot.xIndex][newCellToShot.zIndex].id;
            const moveStatus = id === 0
                ? MoveStatusEnum.miss
                : userShips[id].hitCount === userShips[id].size - 1
                    ? MoveStatusEnum.killed
                    : MoveStatusEnum.injury;
            addToMoveList({
                mover: MoverEnum.pc,
                coord: newCellToShot,
                status: moveStatus
            })

            if (id) { // если попал
                if (userShips[id].hitCount === userShips[id].size - 1) { // если убил
                    clearUserInjuredCells(); // обнуление массива раненных точек
                    populateUserFieldAroundKilledShip(id); // автозаполнение ближайших ячеек
                } else { // если ранил
                    addToUserInjuredCells(newCellToShot);
                }
                setHitOnUserShip(userField[newCellToShot.xIndex][newCellToShot.zIndex].id); // запись попадения в userShips
                setEnemyMoveCount(); // для повторного хода противника
            } else { // если промахнулся
                setUserMove(true) // переход хода к пользователю
            }
        }
    }

    // ход противника
    useEffect(makeEnemyMove2, [userMove])

    // повторный ход противника
    useEffect(makeEnemyMove2, [enemyMoveCount])

    // конец игры
    useEffect(() => {
        if (enemyShipsKilledCount === 10 || userShipsKilledCount === 10) {
            setGameRunning(false)
            setShowWinnerModal(true)
        }
        if (enemyShipsKilledCount === 10) {
            setWinner(MoverEnum.user)
        }
        if (userShipsKilledCount === 10) {
            setWinner(MoverEnum.pc)
        }
    }, [userShipsKilledCount, enemyShipsKilledCount])

    return (
        <group>
            <Base/>
            <UserField/>
            <EnemyField/>


            <FieldScale
                position={new THREE.Vector3(-10 * consts.CELL_SIZE - consts.DISTANCE_BETWEEN / 2, 0, -5 * consts.CELL_SIZE)}/>
            <FieldScale position={new THREE.Vector3(consts.DISTANCE_BETWEEN / 2, 0, -5 * consts.CELL_SIZE)}
                        enemy={true}
            />


            {/* КОРАБЛИ ПРОТИВНИКА */}
            <>
                {
                    Object.values(enemyShips).map((ship) => {
                            if (ship.status !== StatusEnum.killed) {
                                return null
                            }
                            return (
                                <ShipModel key={ship.id}
                                           currentPlacingSize={ship.size}
                                           position={new THREE.Vector3(
                                               getCoordinateXByIndex(ship.xIndex, false),
                                               0,
                                               getCoordinateZByIndex(ship.zIndex)
                                           )}
                                           isRollOver={false}
                                           rotateAngle={ship.rotateAngle}
                                           enemy={true}
                                           killed={false}
                                />
                            )
                        }
                    )
                }
            </>

            {/* КОРАБЛИ ПОЛЬЗОВАТЕЛЯ */}
            <>
                {
                    Object.values(userShips).map((ship) => (
                        <ShipModel key={ship.id}
                                   currentPlacingSize={ship.size}
                                   position={new THREE.Vector3(
                                       getCoordinateXByIndex(ship.xIndex, true),
                                       0,
                                       getCoordinateZByIndex(ship.zIndex)
                                   )}
                                   isRollOver={false}
                                   rotateAngle={ship.rotateAngle}
                                   killed={ship.status === StatusEnum.killed}
                        />
                    ))
                }
            </>

            {/* ПРОМАХИ И ПОПАДАНИЯ НА ПОЛЕ ПРОТИВНИКА */}
            {
                enemyField.map((row, xIndex) => (
                    <React.Fragment key={xIndex}>
                        {
                            row.map((cell, zIndex) => {
                                let y = 0;
                                if (enemyField[xIndex][zIndex].id !== 0 && enemyField[xIndex][zIndex].shot) {
                                    //console.log(enemyField[xIndex][zIndex].id)
                                    const killed = enemyShips[enemyField[xIndex][zIndex].id].status === StatusEnum.killed
                                    //console.log(killed)
                                    y = killed ? 4 : 0;
                                }
                                    return (
                                        <group key={`${xIndex}` + `${zIndex}`}>
                                            {
                                                enemyField[xIndex][zIndex].id === 0 && enemyField[xIndex][zIndex].shot && (
                                                    <MissModel position={new THREE.Vector3(
                                                        getCoordinateXByIndex(xIndex, false),
                                                        0,
                                                        getCoordinateZByIndex(zIndex)
                                                    )}/>
                                                )
                                            }
                                            {
                                                enemyField[xIndex][zIndex].id !== 0 && enemyField[xIndex][zIndex].shot && (
                                                    <FireModel position={new THREE.Vector3(
                                                        getCoordinateXByIndex(xIndex, false),
                                                        y,
                                                        getCoordinateZByIndex(zIndex)
                                                    )}/>
                                                )
                                            }

                                        </group>
                                    )
                                }
                            )
                        }
                    </React.Fragment>
                ))
            }

            {/* ПРОМАХИ И ПОПАДАНИЯ НА ПОЛЕ ИГРОКА */}
            {
                userField.map((row, xIndex) => (
                    <React.Fragment key={xIndex}>
                        {
                            row.map((cell, zIndex) => (
                                <group key={`${xIndex}` + `${zIndex}`}>
                                    {
                                        userField[xIndex][zIndex].id === 0 && userField[xIndex][zIndex].shot && (
                                            <MissModel position={new THREE.Vector3(
                                                getCoordinateXByIndex(xIndex),
                                                0,
                                                getCoordinateZByIndex(zIndex)
                                            )}/>
                                        )
                                    }
                                    {
                                        userField[xIndex][zIndex].id !== 0 && userField[xIndex][zIndex].shot && (
                                            <FireModel position={new THREE.Vector3(
                                                getCoordinateXByIndex(xIndex),
                                                4,
                                                getCoordinateZByIndex(zIndex)
                                            )}/>
                                        )
                                    }
                                </group>
                            ))
                        }
                    </React.Fragment>
                ))
            }


            {/* МОДЕЛЬ КОРАБЛЯ ПОЛЬЗОВАТЕЛЯ ПРИ РАЗМЕЩЕНИИ */}
            {
                placing && onUserField && currentPlacingSize !== 0 &&
                <ShipModel currentPlacingSize={currentPlacingSize}
                           position={new THREE.Vector3(
                               getCoordinateXByIndex(xIndex),
                               0,
                               getCoordinateZByIndex(zIndex)
                           )}
                           isRollOver={true}
                           placingError={placingError}
                           rotateAngle={rotateAngle}
                           killed={false}
                />
            }

            {/* МОДЕЛЬ ВЫСТРЕЛА НА ПОЛЕ ПРОТИВНИКА */}
            {
                gameRunning && !placing && userMove && onEnemyField && !enemyField[xIndex][zIndex].shot &&
                <ShotModel position={new THREE.Vector3(
                    getCoordinateXByIndex(xIndex, false),
                    0,
                    getCoordinateZByIndex(zIndex)
                )}/>
            }

            {/*<axesHelper args={[0.1]}/>*/}
            {/*<gridHelper args={[20, 2]}/>*/}
        </group>
    )
})