import {createContext} from "react";
import {RootStore, store} from "../../store/RootStore";
import {App} from "./App";

export const StoreContext = createContext<RootStore>({} as RootStore)

export const AppContainer = () => {
    return (
        // <StoreContext.Provider value={store}>
            <App/>
        // </StoreContext.Provider>
    )
}