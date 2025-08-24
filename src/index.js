import { di } from "./common/di.js";
import { NavigationRouter } from "./common/NavigationRouter";

const createImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

const rootContainer = document.querySelector("main");

const router = new NavigationRouter(rootContainer, di);

router.init();
