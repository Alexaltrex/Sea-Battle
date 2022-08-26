import * as THREE from "three";
import React, {FC} from "react";
//import {Box} from "@react-three/drei";
import {Fire} from "./Fire";

interface IFireModel {
    position: THREE.Vector3

}

export const FireModel: FC<IFireModel> = ({position}) => {
    //const scale = 10
    return (
        <group position={position}>
            {/*<Box args={[10,10,10]} position-y={5}>*/}
            {/*    <meshBasicMaterial color="red" opacity={0.5} transparent={true}/>*/}
            {/*</Box>*/}
            {/*@ts-ignore*/}
            <Fire scale={10}
                  position-y={5}
            />
        </group>

    )
}