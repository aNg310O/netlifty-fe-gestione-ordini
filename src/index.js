import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import App from "./App";
import * as serviceWorker from "./serviceWorker";

const theme = createMuiTheme ({
  palette: {
    type: "dark",
    primary: { main: '#1f9143',},
    secondary: {
      main: '#96c267',
    },
  },
});

ReactDOM.render(
<ThemeProvider theme={theme}>
  <CssBaseline />
  <BrowserRouter>
    <App />
</BrowserRouter>
</ThemeProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
