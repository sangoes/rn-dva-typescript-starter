import { Model } from "../utils/dva";
import { AppState } from "./states/app";

/**
 * app
 */
export default {
  namespace: "app",
  state: {
    loading: true
  } as AppState,
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {},
  subscriptions: {}
} as Model;
