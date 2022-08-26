import {useGLTF} from "@react-three/drei";
import React, {FC, Suspense, useRef, useState} from "react";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {Vector3} from "three";
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
        Plane: THREE.Mesh
        Plane001: THREE.Mesh
        Cylinder: THREE.Mesh
    }
    materials: {
        Material: THREE.MeshStandardMaterial
    }
}

export const Ship2: FC<IShipNModel> = ({
                                           isRollOver,
                                           placingError,
                                           enemy,
    killed
                                       }) => {
    const {nodes} = useGLTF(process.env.PUBLIC_URL + "/ships/ship2.gltf") as unknown as GLTFResultType;
    const {color1, color2} = getModelColors(placingError, enemy, killed);
    const ref = useRef<THREE.Mesh>(null!);
    const [forward, setForward] = useState(true);
    const SPEED = 0.2;
    useFrame((state, delta) => {
        if (forward) {
            ref.current.rotation.y += SPEED * delta
            if (ref.current.rotation.y >= 0.25 * Math.PI) {
                setForward(false)
            }
        } else {
            ref.current.rotation.y -= SPEED * delta
            if (ref.current.rotation.y <= -0.25 * Math.PI) {
                setForward(true)
            }
        }
    })

    return (
        <Suspense fallback={null}>
            <group rotation-y={-Math.PI / 2} position-x={0.5 * consts.CELL_SIZE}>
                <mesh
                    geometry={nodes.Plane.geometry}
                    scale={10}
                >
                    <Material color={color1}
                              opacity={isRollOver ? 0.5 : 1}
                              transparent={isRollOver}
                    />
                </mesh>

                <mesh geometry={nodes.Plane001.geometry}
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
useGLTF.preload(process.env.PUBLIC_URL + "/ships/ship2.gltf")