import React from "react";
import {observer} from "mobx-react-lite";
import * as THREE from "three";
import {consts} from "../../consts/consts";
import {OceanModel} from "./OceanModel";
import {Plane} from "@react-three/drei";
import {store} from "../../store/RootStore";
import {ThreeEvent} from "@react-three/fiber";
import {getXIndex, getZIndex} from "../../helpers/getDiscreteCoord";
import {StatusEnum} from "../../types/types";

export const userFieldPosition = new THREE.Vector3(-0.5 * (10 * consts.CELL_SIZE + consts.DISTANCE_BETWEEN), 0, 0)

export const UserField = observer(() => {
        const {
            appStore: {
                placing,
                onUserField,
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
                setOnUserField,
            }
        } = store

        const onPointerMoveHandler = (e: ThreeEvent<PointerEvent>) => {
            // при размещении корабля на своем поле
            if (placing && onUserField && currentPlacingSize) {
                setXIndex(getXIndex(e.point.x))
                setZIndex(getZIndex(e.point.z))
            }
        }

        const onClickHandler = (e: ThreeEvent<MouseEvent>) => {
            // при размещении корабля на своем поле
            if (placing && onUserField && !placingError && Boolean(selectedShipId)) {
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
        }

        const onPointerEnterHandler = () => {
            setOnUserField(true)
        }

        const onPointerLeaveHandler = () => {
            setOnUserField(false)
        }


        return (
            <group position={userFieldPosition}>
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
    }
)