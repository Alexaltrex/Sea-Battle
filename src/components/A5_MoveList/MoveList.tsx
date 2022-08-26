import clsx from "clsx";
import {MoverEnum, MoveStatusEnum} from "../../types/types";
import React from "react";
import {store} from "../../store/RootStore";
import {observer} from "mobx-react-lite";
import style from "./MoveList.module.scss";
import {alphabet} from "../GameField/models/FieldScale";

export const MoveList = observer(() => {
    const {
        appStore: {
            moveList,
        }
    } = store

    return (
        <div className={style.moveList}>
            {
                moveList.map(({mover, coord, status}, index) => (
                    <div key={index}
                         className={style.moveListItem}
                    >
                        <p className={clsx({
                            [style.mover]: true,
                            [style.mover_enemy]: mover === MoverEnum.pc,
                        })}>
                            {mover}
                        </p>
                        <p className={style.coord}>
                            <span>{alphabet[coord.xIndex]}</span><span>-</span><span>{coord.zIndex}</span>
                        </p>
                        <p className={clsx({
                            [style.status]: true,
                            [style.status_injury]: status === MoveStatusEnum.injury,
                            [style.status_killed]: status === MoveStatusEnum.killed,
                        })}>
                            {status}
                        </p>
                    </div>
                ))
            }
        </div>
    )
})