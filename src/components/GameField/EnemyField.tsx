import {observer} from "mobx-react-lite";
import * as THREE from "three";
import {consts} from "../../consts/consts";
import React from "react";
import {OceanModel} from "./OceanModel";
import {Plane} from "@react-three/drei";
import {ThreeEvent} from "@react-three/fiber";
import {getXIndex, getZIndex} from "../../helpers/getDiscreteCoord";
import {store} from "../../store/RootStore";
import {MoverEnum, MoveStatusEnum, StatusEnum} from "../../types/types";

const enemyFieldPosition = new THREE.Vector3(0.5 * (10 * consts.CELL_SIZE + consts.DISTANCE_BETWEEN), 0, 0)

export const EnemyField = observer(() => {
    const {
        appStore: {
            gameRunning,
            placing,
            onEnemyField,
            setXIndex,
            setZIndex,
            userMove, setUserMove,
            enemyField,
            setShotAtEnemyField,
            enemyShips, setHitOnEnemyShip,
            addToMoveList,
            populateEnemyFieldAroundKilledShip,
            setOnEnemyField
        }
    } = store


    const onPointerMoveHandler = (e: ThreeEvent<PointerEvent>) => {
        // при стрельбе на поле противника
        if (gameRunning && !placing && userMove && onEnemyField) {
            setXIndex(getXIndex(e.point.x, false))
            setZIndex(getZIndex(e.point.z))
        }
    }

    const onClickHandler = (e: ThreeEvent<MouseEvent>) => {
        // при стрельбе на поле противника
        if (
            gameRunning && !placing && userMove && onEnemyField
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
        setOnEnemyField(true)
    }

    const onPointerLeaveHandler = () => {
        setOnEnemyField(false)
    }

    return (
            <group position={enemyFieldPosition}>
                <gridHelper args={[100, 10, "#FFF", "#FFF"]}/>
                <OceanModel/>
                <Plane args={[10 * consts.CELL_SIZE, 10 * consts.CELL_SIZE]}
                       rotation-x={-0.5 * Math.PI}
                       position-y={0}
                       onPointerMove={e => onPointerMoveHandler(e)}
                       onPointerEnter={onPointerEnterHandler}
                       onPointerLeave={onPointerLeaveHandler}
                       onClick={onClickHandler}
                >
                    <meshBasicMaterial visible={false}/>
                </Plane>
            </group>
        )
})