import React from "react";
import style from "./SelectShips.module.scss";
import {observer} from "mobx-react-lite";
import clsx from "clsx";
import {store} from "../../../store/RootStore";

import ship1 from "../../../assets/png/ship1_user.png";
import ship2 from "../../../assets/png/ship2_user.png";
import ship3 from "../../../assets/png/ship3_user.png";
import ship4 from "../../../assets/png/ship4_user.png";

const ships = [
    { placingSize: 1, id: 1, src: ship1},
    { placingSize: 1, id: 2, src: ship1 },
    { placingSize: 1, id: 3, src: ship1 },
    { placingSize: 1, id: 4, src: ship1 },
    { placingSize: 2, id: 5, src: ship2 },
    { placingSize: 2, id: 6, src: ship2 },
    { placingSize: 2, id: 7, src: ship2 },
    { placingSize: 3, id: 8, src: ship3 },
    { placingSize: 3, id: 9, src: ship3 },
    { placingSize: 4, id: 10, src: ship4 },
]

export const SelectShips = observer(() => {
    const {appStore: {
        setCurrentPlacingSize,
        placedShipIndexes,
        clearRotateAngle,
        selectedShipId,
        setSelectedShipId,
    }} = store;

    return (
        <div className={style.selectShips}>

            <div className={style.btns}>
                {
                    ships.map(({placingSize, id, src}) => (
                        <button key={id}
                                className={clsx({
                                    [style.btn]: true,
                                    [style.btn_selected]: selectedShipId === id,
                                })}
                                onClick={() => {
                                    setCurrentPlacingSize(placingSize)
                                    setSelectedShipId(id)
                                    clearRotateAngle()
                                }}
                                disabled={placedShipIndexes.includes(id)}
                        >
                            <img src={src} alt="" className={style.img}/>
                            <p className={style.label}>
                               <span>x</span><span>{placingSize}</span>
                            </p>
                        </button>
                    ))
                }
            </div>

        </div>
    )
})