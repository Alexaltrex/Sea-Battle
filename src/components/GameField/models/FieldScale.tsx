import * as THREE from "three";
import React, {FC, useEffect, useRef, useState} from "react";
import {Center, Text3D} from "@react-three/drei";
import fontUrl from "../../../assets/fonts/Arial_Bold.json";
import {consts} from "../../../consts/consts";

interface ILetter {
    position: THREE.Vector3
    letter: string
}

const Letter:FC<ILetter> = ({position, letter}) => {
    const ref = useRef<THREE.Mesh>(null!)
    const [x, setX] = useState<null | number>(null)

    useEffect(() => {
        if (ref && ref.current && ref.current.geometry.boundingSphere && ref.current.geometry.boundingSphere.center) {
            setX( ref.current.geometry.boundingSphere.center.x)
        }
    }, [ref.current])


    return (
        // @ts-ignore
        <Text3D font={fontUrl}
                size={8}
                height={1}
                rotation-x={-Math.PI / 2}
                //position-y={1.5}
                position-x={
                    position.x + (x ? (0.5 * consts.CELL_SIZE - x) : 0)
                }
                position-y={position.y}
                position-z={position.z}
                ref={ref}
        >
            {letter}
            {/*<meshNormalMaterial/>*/}
            <meshStandardMaterial color={"#624d4a"}/>
        </Text3D>
    )
}

export const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

interface IFieldScale {
    position: THREE.Vector3
    enemy?: boolean
}

export const FieldScale: FC<IFieldScale> = ({position, enemy = false}) => {
    return (
        <group position={position}>

            {
                alphabet.map((letter, index) => (
                    <Letter key={index}
                            position={new THREE.Vector3(index * consts.CELL_SIZE, 0, -1)}
                            letter={letter}
                    />
                ))
            }

            {
                (new Array(10).fill(0)).map((el, index) => (
                    <Letter key={index}
                            position={new THREE.Vector3( (enemy ? 10 : -1) * consts.CELL_SIZE, 0, (index + 1) * consts.CELL_SIZE - 1)}
                            letter={String(index)}
                    />
                ))
            }


        </group>
    )
}