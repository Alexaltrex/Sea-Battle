import React, {useMemo, useRef} from "react";
import waterNormalsSrc from "../../assets/jpeg/waternormals.jpeg";
import {Water} from "three-stdlib";
import {extend, useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {useTexture} from "@react-three/drei";
import {consts} from "../../consts/consts";

extend({Water})

export const OceanModel = () => {
    const ref = useRef<THREE.Mesh>(null!)
    const [waterNormals] = useTexture([waterNormalsSrc])
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
    const geometry = useMemo(() => new THREE.PlaneGeometry(consts.CELL_SIZE * 10, consts.CELL_SIZE * 10), [])
    const config = useMemo(
        () => ({
            textureWidth: 1024,
            textureHeight: 1024,
            waterNormals,
            sunDirection: new THREE.Vector3(1, 1, 1),
            waterColor: 0x0044ff,
            distortionScale: 1,
        }),
        [waterNormals]
    )

    useFrame((state, delta) => {
        // @ts-ignore
        ref.current.material.uniforms.time.value += 0.5 * delta
    })
    return (
        // @ts-ignore
        <water ref={ref}
               args={[geometry, config]}
               rotation-x={-Math.PI / 2}
               position-y={-0.1}
        />
    )

}