import {GameField} from "../GameField/GameField";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import React from "react";
import style from "./GameCanvas.module.scss"

export const GameCanvas = () => {
    return (
        <Canvas className={style.canvas}>

            <ambientLight intensity={1} color="#FFF"/>
            <directionalLight position={[-100, 400, 400]} intensity={5}/>

            <GameField/>

            <PerspectiveCamera makeDefault position={[0, 150, 120]}/>
            <OrbitControls target={[0, 0, 0]}/>
        </Canvas>
    )
}