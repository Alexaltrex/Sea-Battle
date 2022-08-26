import React, {useEffect} from 'react';
import style from "./App.module.scss"
import {observer} from "mobx-react-lite";
import {store} from "../../store/RootStore";
import {WinnerModal} from "../A2_WinnerModal/WinnerModal";
import {PlacingTypeEnum} from "../../types/types";
import {EnemyShips} from "../A1_Header/EnemyShips/EnemyShips";
import {SelectPlacingTypeModal} from "../A3_SelectPlacingTypeModal/SelectPlacingTypeModal";
import {GameCanvas} from "../A4_GameCanvas/GameCanvas";
import {Header} from "../A1_Header/Header";
import {MoveList} from "../A5_MoveList/MoveList";

export const App = observer(() => {
    const {
        appStore: {
            gameRunning,
            setRotateAngle,
            placing, placingType,
            onUserField,
            showWinnerModal,
        }
    } = store

    const handleKeyDown = (e: KeyboardEvent) => {
        if (placing && onUserField && e.code === "KeyR") {
            setRotateAngle()
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown]);

    return (
        <div className={style.app}>
            <Header/>

            {gameRunning && !placing && <EnemyShips/>}

            {showWinnerModal && <WinnerModal/>}

            {placing && placingType === PlacingTypeEnum.notSelect && <SelectPlacingTypeModal/>}

            {!placing && <MoveList/>}

            <GameCanvas/>

            <p className={style.navInfo}>
                left mousedown + move: rotate, mouse wheel: scale, ctrl + left mousedown: move
            </p>

        </div>
    );
})

