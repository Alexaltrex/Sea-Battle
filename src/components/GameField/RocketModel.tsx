import {Cylinder} from "@react-three/drei";

export const RocketModel = () => {
    return (
        <group>
            <Cylinder args={[8, 8, 10]}>
                <meshStandardMaterial/>
            </Cylinder>
        </group>
    )
}