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
        Cube003: THREE.Mesh
        Cube004: THREE.Mesh
        Cube005: THREE.Mesh
        Cube006: THREE.Mesh
        Plane: THREE.Mesh
        Plane001: THREE.Mesh
        Sphere: THREE.Mesh
    }
    materials: {
        Material: THREE.MeshStandardMaterial
    }
}

export const Ship4: FC<IShipNModel> = ({
                                           isRollOver,
                                           placingError,
                                           enemy,
                                           killed
                                       }) => {
    const {nodes} = useGLTF(process.env.PUBLIC_URL + "/ships/ship4.gltf") as unknown as GLTFResultType;
    const {color1, color2} = getModelColors(placingError, enemy, killed);
    const ref1 = useRef<THREE.Mesh>(null!);
    const ref2 = useRef<THREE.Mesh>(null!);
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ref1.current.rotation.y = time;
        ref2.current.rotation.y = -time;
    })

    return (
        <Suspense fallback={null}>
            <group rotation-y={-Math.PI / 2} position-x={1.5 * consts.CELL_SIZE}>

                {/*корма*/}
                <mesh geometry={nodes.Plane.geometry}
                      scale={10}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*основание сферы*/}
                <mesh geometry={nodes.Plane001.geometry}
                      scale={10}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*сфера*/}
                <mesh geometry={nodes.Sphere.geometry}
                      scale={10}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*башня*/}
                <mesh geometry={nodes.Cube001.geometry}
                      scale={10}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*башня*/}
                <mesh geometry={nodes.Cube005.geometry} material={nodes.Cube005.material}
                      rotation={[-Math.PI, 0.01, -Math.PI]}
                      scale={10}
                >
                    <Material color={color2}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*пушка*/}
                <mesh geometry={nodes.Cube002.geometry}
                      scale={10}
                >
                    <Material color={color2}
                              side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*пушка*/}
                <mesh geometry={nodes.Cube004.geometry}
                      rotation={[-Math.PI, 0.01, -Math.PI]}
                      scale={10}
                >
                    <Material color={color2}
                              side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*антена*/}
                <mesh geometry={nodes.Cube003.geometry}
                      position={[0, 8.2, 5.6]}
                      scale={[2, -0.1, 0.3]}
                      ref={ref1}
                >
                    <Material color={color2}
                        //side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                {/*антена*/}
                <mesh geometry={nodes.Cube006.geometry}
                      position={[0.3, 8.2, -5.6]}
                      rotation={[0, 1.57, 0]}
                      scale={[2, -0.1, 0.3]}
                      ref={ref2}
                >
                    <Material color={color2}
                        //side={THREE.BackSide}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>


            </group>
        </Suspense>
    )
}
useGLTF.preload(process.env.PUBLIC_URL + "/ships/ship4.gltf")