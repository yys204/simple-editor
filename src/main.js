import "./style.css";
import "./global.css";
import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "ant-design-vue/dist/antd.dark.css";
import router from "./router";
import "./userWorker";

const app = createApp(App);

app.use(router).use(Antd);

app.mount("#app");
