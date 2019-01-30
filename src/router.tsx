import React from "react";
import { Animated, BackHandler, Easing } from "react-native";
import { connect } from "react-redux";
import * as ModelsStates from "./models/states";
import {
  createAppContainer,
  createStackNavigator,
  NavigationState,
  NavigationActions
} from "react-navigation";
import * as RouterName from "./constants/router";
import Home from "./pages/Home";

const HomeNavigator = createStackNavigator(
  {
    [RouterName.Home]: { screen: Home }
  },
  { headerMode: "float", mode: "modal" }
);
/**
 * 创建 AppNavigator
 */
const AppNavigator = createStackNavigator(
  {
    [RouterName.Home]: { screen: HomeNavigator }
  },
  {
    headerMode: "none",
    // headerMode: "float",
    mode: "modal",
    defaultNavigationOptions: {
      gesturesEnabled: false
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0]
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1]
        });

        return { opacity, transform: [{ translateY }] };
      }
    })
  }
);
/**
 * navigationOptions
 */
AppNavigator.navigationOptions = ({ navigation }: any) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  return {
    headerTitle: routeName
  };
};
/**
 * 创建app
 */
const App = createAppContainer(AppNavigator);

/**
 * @description 获取当前路由
 * @author jerrychir
 * @param {NavigationState} navigationState
 * @returns
 */
function getActiveRouteName(navigationState: NavigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // @ts-ignore
  if (route.routes) {
    // @ts-ignore
    return getActiveRouteName(route);
  }
  return route.routeName;
}
/**
 * props
 */
interface IProps {
  app: ModelsStates.AppState;
  router: any;
  dispatch: any;
}
/**
 * @description 路由
 * @author jerrychir
 * @class Router
 * @extends {PureComponent<IProps>}
 */
// @connect(({ app, router }) => ({ app, router }))
class Router extends React.PureComponent<IProps> {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backHandle);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backHandle);
  }

  backHandle = () => {
    const currentScreen = getActiveRouteName(this.props.router);
    if (currentScreen === "Login") {
      return true;
    }
    if (currentScreen !== "Home") {
      this.props.dispatch(NavigationActions.back());
      return true;
    }
    return false;
  };
  render() {
    // TODO 可以在这儿放广告页面 loading 等
    return <App />;
  }
}
/**
 * @description mapStateToProps
 * @author jerrychir
 * @param {*} state
 * @returns
 */
function mapStateToProps(state: any) {
  return {
    router: state.router,
    app: state.app
  };
}
export default connect(mapStateToProps)(Router);
