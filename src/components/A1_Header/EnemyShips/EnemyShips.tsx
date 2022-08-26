import React from "react";
import style from "./EnemyShips.module.scss"
import {observer} from "mobx-react-lite";
import {store} from "../../../store/RootStore";


import ship1 from "../../../assets/png/ship1_enemy.png";
import ship2 from "../../../assets/png/ship2_enemy.png";
import ship3 from "../../../assets/png/ship3_enemy.png";
import ship4 from "../../../assets/png/ship4_enemy.png";
import {svgIcons} from "../../../assets/svgIcons";
import {StatusEnum} from "../../../types/types";

const shipsSrc = [ship1, ship2, ship3, ship4];


export const EnemyShips = observer(() => {
    const {
        appStore: {
            enemyShips
        }
    } = store

    return (

        <div className={style.enemyShips}>
            {
                Object.values(enemyShips).map(({size, status}, index) => (
                    <div key={index} className={style.ship}>
                        <img src={shipsSrc[size - 1]} alt="" className={style.img}/>
                        <p className={style.size}>{`x${size}`}</p>
                        {status === StatusEnum.killed && <div className={style.close}>{svgIcons.close}</div>}
                    </div>
                ))
            }
        </div>
    )
})