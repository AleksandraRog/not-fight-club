import { di } from "./common/di.js";
import { NavigationRouter } from "./common/NavigationRouter";


const rootContainer = document.querySelector("main");

const router = new NavigationRouter(rootContainer, di);

router.init();
