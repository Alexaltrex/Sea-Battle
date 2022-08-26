import {Box, useTexture} from "@react-three/drei";
import * as THREE from 'three'
import React from "react";
import {consts} from "../../consts/consts";
import texture from "../../assets/jpeg/base5.jpg";

export const Base = () => {

    const [map0] = useTexture([texture])
    map0.wrapS = THREE.RepeatWrapping;
    map0.wrapT = THREE.RepeatWrapping;
    map0.repeat = new THREE.Vector2(12, 1)

    const map1 = map0.clone()
    map1.repeat = new THREE.Vector2(22 + consts.DISTANCE_BETWEEN / consts.CELL_SIZE, 12);

    const map2 = map0.clone()
    map2.repeat = new THREE.Vector2(22 + consts.DISTANCE_BETWEEN / consts.CELL_SIZE, 1);

    const maps = [map0, map0, map1, map1, map2, map2]

    return (
        <Box args={[
            consts.CELL_SIZE * 24 + consts.DISTANCE_BETWEEN,
            consts.CELL_SIZE,
            consts.CELL_SIZE * 14
        ]}
             position-y={-0.55 * consts.CELL_SIZE}
        >
            <meshStandardMaterial color="darkgreen"/>
            {
                maps.map((map, index) => (
                    <meshStandardMaterial key={index}
                                          attach={`material-${index}`}
                                          map={map}
                                          color={"#886a00"}
                    />
                ))
            }
        </Box>
    )
}