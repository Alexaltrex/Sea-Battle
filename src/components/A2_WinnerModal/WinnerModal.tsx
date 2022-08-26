import React from "react";
import style from "./WinnerModal.module.scss"
import {observer} from "mobx-react-lite";
import {store} from "../../store/RootStore";
import {MoverEnum} from "../../types/types";
import clsx from "clsx";

export const WinnerModal = observer(() => {
    const {appStore: {
        winner, setShowWinnerModal
    }} = store

    return (
        <div className={style.winnerModal}>
            {
                winner && (
                    <p className={clsx({
                        [style.winner]: true,
                        [style.winner_fail]: winner === MoverEnum.pc,
                    })}>
                        {winner === MoverEnum.user ? "You win" : "You fail"}
                    </p>
                )
            }
            <button className={style.closeBtn}
                    onClick={() => setShowWinnerModal(false)}
            >
                close
            </button>
        </div>
    )
})