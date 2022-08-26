import React from "react";
import style from "./Header.module.scss"
import {observer} from "mobx-react-lite";
import {SelectShips} from "./SelectShips/SelectShips";
import {store} from "../../store/RootStore";
import {MoverEnum, MoveStatusEnum, PlacingTypeEnum} from "../../types/types";
import clsx from "clsx";
import {Logo} from "./Logo/Logo";

export const Header = observer(() => {
    const {
        appStore: {
            gameRunning, setGameRunning,
            placing, setPlacing,
            placedShipIndexes,
            placingType,
            moveList, resetMoveList,
            winner,
        }
    } = store

    const onGameStartHandler = () => {
        setGameRunning(true);
        setPlacing(true);
        resetMoveList()
    }

    const status = () => {
        //if (!gameRunning) return "Press button to start"
        //if (placing && placingType === PlacingTypeEnum.notSelect) return "Select placing type"
        if (placingType === PlacingTypeEnum.manually) return `Select ship to placing (press "R" to rotate), ${10 - placedShipIndexes.length} ships left:`
        //if (winner) return winner
        //if (gameRunning && !placing) return "Game in progress..."
    }

    return (
        <header className={style.header}>
            <div className={style.top}>
                <div className={style.left}>

                    <div className={style.logoWrapper}>
                        <Logo/>
                    </div>

                    <button className={style.startBtn}
                            onClick={onGameStartHandler}
                            disabled={gameRunning}
                    >
                        Game start
                    </button>
                    <p className={style.status}>{status()}</p>
                </div>

            </div>

            {placing && placingType === PlacingTypeEnum.manually && <SelectShips/>}

        </header>
    )
})