import React, {FC} from "react";
import * as THREE from 'three'
import {Box, Plane} from "@react-three/drei";
import {consts} from "../../consts/consts";
import {observer} from "mobx-react-lite";
import {Ship2} from "./models/Ship2";
import {Ship3} from "./models/Ship3";
import {Ship1} from "./models/Ship1";
import {Ship4} from "./models/Ship4";

interface IShipModel {
    position: THREE.Vector3
    isRollOver?: boolean
    currentPlacingSize: number
    placingError?: boolean
    rotateAngle: number
    enemy?: boolean
    killed: boolean
}

export const ShipModel: FC<IShipModel> = observer(({
                                                       position,
                                                       isRollOver = true,
                                                       currentPlacingSize,
                                                       placingError = false,
                                                       rotateAngle,
                                                       enemy = false,
                                                       killed
                                                   }) => {
    return (
        <group position={position}
               rotation-y={rotateAngle * Math.PI / 2}
        >

            {
                currentPlacingSize === 1 &&
                <Ship1 isRollOver={isRollOver}
                       placingError={placingError}
                       enemy={enemy}
                       killed={killed}
                />
            }

            {
                currentPlacingSize === 2 &&
                <Ship2 isRollOver={isRollOver}
                       placingError={placingError}
                       enemy={enemy}
                       killed={killed}
                />
            }

            {
                currentPlacingSize === 3 &&
                <Ship3 isRollOver={isRollOver}
                       placingError={placingError}
                       enemy={enemy}
                       killed={killed}
                />
            }

            {
                currentPlacingSize === 4 &&
                <Ship4 isRollOver={isRollOver}
                       placingError={placingError}
                       enemy={enemy}
                       killed={killed}
                />
            }

            {
                isRollOver && (
                    <Plane args={[currentPlacingSize * consts.CELL_SIZE, consts.CELL_SIZE]}
                           rotation-x={-Math.PI / 2}
                           position-x={0.5 * consts.CELL_SIZE * (currentPlacingSize - 1)}
                           position-y={0.1}
                    >
                        <meshBasicMaterial color={placingError ? "red" : "green"}
                                           opacity={0.5}
                                           transparent={true}
                        />
                    </Plane>
                )
            }

            {/*<Box args={[currentPlacingSize * consts.CELL_SIZE, 0.5 * consts.CELL_SIZE, consts.CELL_SIZE]}*/}
            {/*     position-y={2.5}*/}
            {/*     position-x={0.5 * (currentPlacingSize - 1) * consts.CELL_SIZE}*/}


            {/*>*/}
            {/*    <meshStandardMaterial*/}
            {/*        color={enemy ? "yellow" : placingError ? "red" : "green"}*/}
            {/*        emissive="#000"*/}
            {/*        roughness={0.4}*/}
            {/*        metalness={1}*/}
            {/*        opacity={isRollOver ? 0.5 : 1}*/}
            {/*        transparent={isRollOver}*/}
            {/*        side={isRollOver ? THREE.DoubleSide : THREE.FrontSide}*/}
            {/*    />*/}
            {/*</Box>*/}
        </group>
    )
})