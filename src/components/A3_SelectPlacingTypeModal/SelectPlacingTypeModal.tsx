import React from "react";
import style from "./SelectPlacingTypeModal.module.scss"
import {PlacingTypeEnum} from "../../types/types";
import {observer} from "mobx-react-lite";
import {store} from "../../store/RootStore";

export const SelectPlacingTypeModal = observer(() => {
    const {
        appStore: {
            setPlacingType
        }
    } = store

    return (
        <div className={style.selectPlacingTypeModal}>
            <div className={style.card}>
                <p className={style.title}>Select placing type:</p>
                <div className={style.buttons}>
                    <button className={style.btn}
                            onClick={() => setPlacingType(PlacingTypeEnum.manually)}
                    >
                        Place ships manually
                    </button>
                    <button className={style.btn}
                            onClick={() => setPlacingType(PlacingTypeEnum.randomly)}
                    >
                        Place ships randomly
                    </button>
                </div>
            </div>

        </div>
    )
})