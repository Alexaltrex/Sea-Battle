import React, {FC} from "react";
import * as THREE from "three";
import {Plane} from "@react-three/drei";
import {extend, ThreeEvent} from "@react-three/fiber";
import {Water} from "three-stdlib";
import {consts} from "../../consts/consts";
import {observer} from "mobx-react-lite";
import {store} from "../../store/RootStore";
import {getXIndex, getZIndex} from "../../helpers/getDiscreteCoord";
import {ICoord, MoverEnum, MoveStatusEnum, StatusEnum} from "../../types/types";
import {OceanModel} from "./OceanModel";

extend({Water})

export interface IWaterField {
    position: THREE.Vector3
    userField?: boolean
}

export const WaterField: FC<IWaterField> = observer(({
                                                         position,
                                                         userField = true
                                                     }) => {
    const {
        appStore: {
            gameRunning,
            placing,
            onUserField,
            onEnemyField,
            setXIndex,
            setZIndex,
            selectedShipId,
            setSelectedShipId,
            currentPlacingSize, setCurrentPlacingSize,
            placingError,
            userShips, setUserShips,
            rotateAngle, clearRotateAngle,
            addShipToUserField,
            setPlacedShipIndexes,
            userMove, setUserMove,
            enemyField,
            setShotAtEnemyField,
            enemyShips, setHitOnEnemyShip,
            addToMoveList,
            populateEnemyFieldAroundKilledShip
        }
    } = store

    const onPointerMoveHandler = (e: ThreeEvent<PointerEvent>) => {
        // при размещении корабля на своем поле
        if (userField && placing && onUserField && currentPlacingSize) {
            setXIndex(getXIndex(e.point.x))
            setZIndex(getZIndex(e.point.z))
        }
        // при стрельбе на поле противника
        if (!userField && gameRunning && !placing && userMove && onEnemyField) {
            setXIndex(getXIndex(e.point.x, false))
            setZIndex(getZIndex(e.point.z))
        }
    }

    const onClickHandler = (e: ThreeEvent<MouseEvent>) => {
        // при размещении корабля на своем поле
        if (userField && placing && onUserField && !placingError && Boolean(selectedShipId)) {
            // если нет ошибки размещения добавляем выбранный корабль в userShips
            const xIndex = getXIndex(e.point.x);
            const zIndex = getZIndex(e.point.z);
            setUserShips({
                ...userShips,
                [selectedShipId]: {
                    id: selectedShipId,
                    size: currentPlacingSize,
                    status: StatusEnum.alive,
                    hitCount: 0,
                    xIndex,
                    zIndex,
                    rotateAngle,
                }
            });
            addShipToUserField(selectedShipId, xIndex, zIndex, currentPlacingSize, rotateAngle);
            setPlacedShipIndexes(selectedShipId);
            setSelectedShipId(0);
            setCurrentPlacingSize(0);
            clearRotateAngle();
        }

        // при стрельбе на поле противника
        if (
            !userField && gameRunning && !placing && userMove && onEnemyField
            && !enemyField[getXIndex(e.point.x, false)][getZIndex(e.point.z)].shot
        ) {
            const xIndex = getXIndex(e.point.x, false);
            const zIndex = getZIndex(e.point.z);
            setShotAtEnemyField(xIndex, zIndex);
            const id = enemyField[xIndex][zIndex].id;
            const moveStatus = id === 0
                ? MoveStatusEnum.miss
                : enemyShips[id].hitCount === enemyShips[id].size - 1
                    ? MoveStatusEnum.killed
                    : MoveStatusEnum.injury;
            addToMoveList({
                mover: MoverEnum.user,
                coord: {xIndex, zIndex},
                status: moveStatus
            })
            if (id) { // если попал
                // если убил
                if (enemyShips[id].hitCount === enemyShips[id].size - 1) {
                    populateEnemyFieldAroundKilledShip(id)
                }
                setHitOnEnemyShip(enemyField[xIndex][zIndex].id)
            } else { // если промахнулся
                setUserMove(false); // переход хода к противнику
            }
        }
    }

    const onPointerEnterHandler = () => {
        if (userField) {
            store.appStore.setOnUserField(true)
        } else {
            store.appStore.setOnEnemyField(true)
        }
    }

    const onPointerLeaveHandler = () => {
        if (userField) {
            store.appStore.setOnUserField(false)
        } else {
            store.appStore.setOnEnemyField(false)
        }
    }

    return (
        <group position={position}
        >
            <gridHelper args={[100, 10, "#FFF", "#FFF"]}/>
            <OceanModel/>
            <Plane args={[10 * consts.CELL_SIZE, 10 * consts.CELL_SIZE]}
                   rotation-x={-0.5 * Math.PI}
                   position-y={0}
                   onPointerMove={e => onPointerMoveHandler(e)}
                   onPointerEnter={onPointerEnterHandler}
                   onPointerLeave={onPointerLeaveHandler}
                   onClick={onClickHandler}
                // onClick={e => onClickHandler(e)}
            >
                <meshBasicMaterial visible={false}/>
            </Plane>
        </group>

    )
})