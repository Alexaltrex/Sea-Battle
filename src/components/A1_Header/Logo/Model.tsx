import React, {useRef} from "react";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";
import {useGLTF} from "@react-three/drei";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";

type GLTFResultType = GLTF & {
    nodes: {
        "1S": THREE.Mesh
        "2e": THREE.Mesh
        "3a": THREE.Mesh
        "4B": THREE.Mesh
        "5a": THREE.Mesh
        "6t": THREE.Mesh
        "7t": THREE.Mesh
        "8l": THREE.Mesh
        "9e": THREE.Mesh
    }
}

const periodBetweenLetter = 0.5;
const periodRotate = 1.25;
const velocity = 2 * Math.PI / periodRotate;

export const Model = () => {
    const gltf = useGLTF(process.env.PUBLIC_URL + "/SeaBattle.gltf") as unknown as GLTFResultType;
    const {nodes} = gltf;

    const ref1 = useRef<THREE.Group>(null!);
    const ref2 = useRef<THREE.Group>(null!);
    const ref3 = useRef<THREE.Group>(null!);
    const ref4 = useRef<THREE.Group>(null!);
    const ref5 = useRef<THREE.Group>(null!);
    const ref6 = useRef<THREE.Group>(null!);
    const ref7 = useRef<THREE.Group>(null!);
    const ref8 = useRef<THREE.Group>(null!);
    const ref9 = useRef<THREE.Group>(null!);

    const refs = [ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9];

    useFrame(state => {
        const time = state.clock.elapsedTime; // sec
        const timePerioded = time % (9 * periodBetweenLetter);


        for (let i = 0; i < 9; i++) {
            // if (timePerioded >= i * periodBetweenLetter && timePerioded <= (i * periodBetweenLetter + periodRotate)) {
            //     refs[i].current.rotation.x = velocity * (timePerioded - i * periodBetweenLetter)
            // }
            const t = (time - i * periodBetweenLetter) % (9 * periodBetweenLetter)
            if (t >= 0 && t <= periodRotate) {
                refs[i].current.rotation.x = velocity * t;
            }
        }


        // if (timePerioded >= 0 * period && timePerioded <= 1 * period) {
        //     ref1.current.rotation.x = velocity * (timePerioded - 0 * period)
        // }
        //
        // if (timePerioded >= 1 * period && timePerioded <= 2 * period) {
        //     ref2.current.rotation.x = velocity * (1 * timePerioded)
        // }

        // ref2.current.rotation.x += 0.1;
        // ref3.current.rotation.x += 0.1;
    })

    return (
        <group>
            <group ref={ref1} position-y={0.27}>
                <mesh position-y={-0.27}
                      geometry={nodes["1S"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref2} position-y={0.2}>
                <mesh position-y={-0.2}
                      geometry={nodes["2e"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref3} position-y={0.2}>
                <mesh position-y={-0.2}
                      geometry={nodes["3a"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref4} position-y={0.27}>
                <mesh position-y={-0.27}
                      geometry={nodes["4B"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref5} position-y={0.2}>
                <mesh position-y={-0.2}
                      geometry={nodes["5a"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref6} position-y={0.27}>
                <mesh position-y={-0.27}
                      geometry={nodes["6t"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref7} position-y={0.27}>
                <mesh position-y={-0.27}
                      geometry={nodes["7t"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref8} position-y={0.27}>
                <mesh position-y={-0.27}
                      geometry={nodes["8l"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

            <group ref={ref9} position-y={0.2}>
                <mesh position-y={-0.2}
                      geometry={nodes["9e"].geometry}
                      rotation={[Math.PI / 2, 0, 0]}
                >
                    <meshNormalMaterial/>
                </mesh>
            </group>

        </group>
    )
}