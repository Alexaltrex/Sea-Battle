import * as THREE from "three";
import React, {FC, useLayoutEffect} from "react";
import {Box, Line, Plane} from "@react-three/drei";
import {BufferGeometry} from "three";

const pointsCircleBig = () => {
    const path = new THREE.Path();
    path.moveTo( 0, 0 )
    path.absarc( 0, 0, 4, 0, Math.PI * 2, false );
    return path.getPoints(30);
}

const pointsCircleSmall = () => {
    const path = new THREE.Path();
    path.moveTo( 0, 0 )
    path.absarc( 0, 0, 2, 0, Math.PI * 2, false );
    return path.getPoints(30);
}

interface IShotModel {
    position: THREE.Vector3
}

export const ShotModel: FC<IShotModel> = ({position}) => {
    const refCircleSmall = React.useRef<BufferGeometry>(null!);
    const refCircleBig = React.useRef<BufferGeometry>(null!);
    useLayoutEffect(() => {
        if (refCircleSmall.current) {
            refCircleSmall.current.setFromPoints(pointsCircleSmall());
        }
        if (refCircleBig.current) {
            refCircleBig.current.setFromPoints(pointsCircleBig());
        }
    }, [])


    return (
        <group position={position}>
            <Plane args={[10, 10]} rotation-x={-Math.PI/2} position-y={0.1} >
                <meshBasicMaterial color="red" opacity={0.5} transparent={true}/>
            </Plane>

            <line rotation-x={-Math.PI/2} position-y={0.15}>
                <bufferGeometry attach='geometry' ref={refCircleSmall} />
                <lineBasicMaterial color="#FFF"/>
            </line>

            <line rotation-x={-Math.PI/2} position-y={0.15}>
                <bufferGeometry attach='geometry' ref={refCircleBig} />
                <lineBasicMaterial color="#FFF"/>
            </line>

            <Line points={[[0,0.15,-6], [0,0.15,6]]}
                  color="#FFF"
                  lineWidth={0.5}
            />

            <Line points={[[-6,0.15,0], [6,0.15,0]]}
                  color="#FFF"
                  lineWidth={0.5}
            />

        </group>
    )
}