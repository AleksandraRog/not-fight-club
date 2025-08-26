import { di } from "./common/di.js";
import { NavigationRouter } from "./common/NavigationRouter";
import { localStorageParametrName } from "./setting/SettingRepsitoryImpl.js";

const rootContainer = document.querySelector("main");

const router = new NavigationRouter(rootContainer, di);

router.init();
