import React from "react";
import { Provider, connect } from "react-redux";
import { Reducer, Action, ReducersMapObject, Dispatch } from "redux";
import createLoading from "dva-loading";
let { create } = require("dva-core");
export { connect };

export interface EffectsCommandMap {
  put: <A extends Action>(action: A) => any;
  call: Function;
  select: Function;
  take: Function;
  cancel: Function;
  [key: string]: any;
}
export interface EffectsMapObject {
  [key: string]: Effect | EffectWithType;
}
export interface ReducerEnhancer {
  (reducer: Reducer<any>): void;
}
export interface SubscriptionAPI {
  dispatch: Dispatch<any>;
}
export type ActionWithPayload = { action: Action; payload: any };
export type EffectType = "takeEvery" | "takeLatest" | "watcher" | "throttle";
export type EffectWithType = [Effect, { type: EffectType }];
export type Effect = (
  action: ActionWithPayload,
  effects: EffectsCommandMap
) => void;
export type ReducersMapObjectWithEnhancer = [
  ReducersMapObject,
  ReducerEnhancer
];
export type Subscription = (api: SubscriptionAPI, done: Function) => void;
export interface SubscriptionsMapObject {
  [key: string]: Subscription;
}
/**
 * @description Model
 * @author jerrychir
 * @export
 * @interface Model
 */
export interface Model {
  namespace: string;
  state?: any;
  reducers?: ReducersMapObject | ReducersMapObjectWithEnhancer;
  effects?: EffectsMapObject;
  subscriptions?: SubscriptionsMapObject;
}
/**
 * @description Options
 * @author jerrychir
 * @export
 * @interface Options
 */
export interface Options {
  models: Model[];
  extraReducers: any;
  initialState: any;
  onError: (e: any) => void;
  onAction: any[];
}
/**
 * @description dva
 * @author jerrychir
 * @param {type} options
 */
export function dva(options: Options) {
  const app = create(options);
  app.use(createLoading());
  // HMR workaround
  // if (!global.registered)
  options.models.forEach((model: Model) => app.model(model));
  // global.registered = true;
  app.start();
  const store = app._store;
  app.start = (container: any) => () => (
    <Provider store={store}>{container}</Provider>
  );
  app.getStore = () => store;
  return app;
}
