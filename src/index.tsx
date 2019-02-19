import * as React from "react";
import * as ReactDOM from "react-dom";
import {MainPage} from "./components/MainPage";
import SettingsProvider from "./providers/SettingsProvider";

ReactDOM.render(
    <SettingsProvider>
            <MainPage />
    </SettingsProvider>,document.getElementById("main")
);