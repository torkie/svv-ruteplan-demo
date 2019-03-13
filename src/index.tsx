import * as React from "react";
import * as ReactDOM from "react-dom";
import MainPage from "./components/MainPage";
import SettingsProvider from "./providers/SettingsProvider";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { orange } from "@material-ui/core/colors";


const theme = createMuiTheme({
    palette: {
      primary: orange
    }
  })


ReactDOM.render(
    <MuiThemeProvider theme={theme}>
    <SettingsProvider>
            <MainPage />
    </SettingsProvider></MuiThemeProvider>,document.getElementById("main")
);