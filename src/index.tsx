import React from "react";
import { dva } from "./utils/dva";
import { createLogger } from "redux-logger";
import Router from "./router";
import * as models from "./models";

/**
 * dva
 */
const app = dva({
  initialState: {},
  models: Object.values(models),
  extraReducers: {},
  // models:[m],
  onError(e: any) {
    console.error("onError", e);
  },
  onAction: [createLogger({ collapsed: true })]
});

const App = app.start(<Router />);

export default App;
