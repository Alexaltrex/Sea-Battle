import React from "react";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import style from "./Logo.module.scss"
import {Model} from "./Model";

export const Logo = () => {
    return (
        <Canvas className={style.logo}>
            {/*<color attach="background" args={["#000"]}/>*/}
            <ambientLight intensity={0.5}/>
            <directionalLight position={[-1, 2, 4]} intensity={2}/>

            <Model/>

            <PerspectiveCamera makeDefault position={[0, 1.5, 3]} zoom={3.5}/>
            <OrbitControls target={[0, 0.25, 0]}
                           enableRotate={false}
                           enableZoom={false}
            />
        </Canvas>
    )
}