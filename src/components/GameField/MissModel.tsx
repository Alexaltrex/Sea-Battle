import React, {FC} from "react";
import * as THREE from "three";
import {Cone, Sphere} from "@react-three/drei";

interface IMissModel {
    position: THREE.Vector3
}

export const MissModel: FC<IMissModel> = ({position}) => {
    return (
        <Sphere args={[2.5, 8, 8]} position={position}>
            <meshBasicMaterial color="#FFF"/>
        </Sphere>

        // <Cone args={[1,1,4]}>
        //     <meshBasicMaterial color="#FFF"/>
        // </Cone>
    )
}