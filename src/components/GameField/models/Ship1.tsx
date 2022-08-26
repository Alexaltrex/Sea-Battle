import {useGLTF} from "@react-three/drei";
import React, {FC, Suspense, useRef, useState} from "react";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Vector3} from "three";
import {consts} from "../../../consts/consts";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {getModelColors} from "../../../helpers/getModelColors";

const Material: FC<JSX.IntrinsicElements['meshStandardMaterial']> = (props) => {
    return (
        <meshStandardMaterial
            //color="green"
            emissive="#444"
            roughness={0.5}
            metalness={1}
            {...props}
        />
    )
}


type GLTFResultType = GLTF & {
    nodes: {
        Plane001: THREE.Mesh
        Plane002: THREE.Mesh
        Plane003: THREE.Mesh
        Plane004: THREE.Mesh
        Plane005: THREE.Mesh
        Plane006: THREE.Mesh
    }
    materials: {
        Material: THREE.MeshStandardMaterial
    }
}

export interface IShipNModel {
    isRollOver: boolean
    placingError: boolean
    enemy: boolean
    killed: boolean
}

export const Ship1: FC<IShipNModel> = ({
                                           isRollOver,
                                           placingError,
                                           enemy,
                                           killed
                                       }) => {
    const {nodes} = useGLTF(process.env.PUBLIC_URL + "/ships/ship1.gltf") as unknown as GLTFResultType;
    const {color1, color2} = getModelColors(placingError, enemy, killed);
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.rotation.y = -time;
    })

    return (
        <Suspense fallback={null}>
            <group rotation-y={-Math.PI / 2} position-x={0}>

                <mesh geometry={nodes.Plane002.geometry}
                      scale={10}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                              side={THREE.DoubleSide}
                    />
                </mesh>
                <mesh geometry={nodes.Plane001.geometry}
                      scale={10}
                      ref={ref}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                              side={THREE.DoubleSide}
                    />
                </mesh>

                {/* стойки */}
                <mesh geometry={nodes.Plane003.geometry}
                      rotation={[-Math.PI, 0, -Math.PI]}
                      scale={[9.3, 10, 9.3]}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>
                <mesh geometry={nodes.Plane004.geometry}
                      scale={[9.3, 10, 9.3]}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>
                <mesh geometry={nodes.Plane005.geometry}
                      rotation={[0, -1.57, 0]}
                      scale={[9.3, 10, 9.3]}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>
                <mesh geometry={nodes.Plane006.geometry}
                      rotation={[0, 1.57, 0]}
                      scale={[9.3, 10, 9.3]}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

            </group>
        </Suspense>
    )
}
useGLTF.preload(process.env.PUBLIC_URL + "/ships/ship1.gltf")