import {useGLTF} from "@react-three/drei";
import React, {FC, Suspense, useRef} from "react";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {consts} from "../../../consts/consts";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";
import {getModelColors} from "../../../helpers/getModelColors";
import {IShipNModel} from "./Ship1";

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
        Cube001: THREE.Mesh
        Cube002: THREE.Mesh
        Plane: THREE.Mesh
        Plane001: THREE.Mesh
        Plane002: THREE.Mesh
    }
    materials: {
        Material: THREE.MeshStandardMaterial
    }
}

export const Ship3: FC<IShipNModel> = ({
                                           isRollOver,
                                           placingError,
                                           enemy,
                                           killed
                                       }) => {
    const {nodes} = useGLTF(process.env.PUBLIC_URL + "/ships/ship3.gltf") as unknown as GLTFResultType;
    const {color1, color2} = getModelColors(placingError, enemy, killed);
    const ref = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref.current.rotation.y = time;
    })

    return (
        <Suspense fallback={null}>
            <group rotation-y={-Math.PI / 2} position-x={consts.CELL_SIZE}>

                <mesh geometry={nodes.Plane.geometry}
                      scale={10}
                >
                    <Material color={color1}
                              side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                <mesh geometry={nodes.Cube001.geometry}
                      rotation={[-Math.PI, 0, -Math.PI]}
                      scale={10}
                >
                    <Material color={color2}
                              side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                <mesh geometry={nodes.Cube002.geometry}
                      scale={10}
                >
                    <Material color={color2}
                              side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>


                <mesh geometry={nodes.Plane001.geometry}
                      scale={10}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                <mesh geometry={nodes.Plane002.geometry}
                      scale={10}
                      ref={ref}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

            </group>
        </Suspense>
    )
}
useGLTF.preload(process.env.PUBLIC_URL + "/ships/ship3.gltf")