import { onRequest as __api_config_js_onRequest } from "D:\\My Project\\alfmart\\functions\\api\\config.js"
import { onRequest as __api_orders_js_onRequest } from "D:\\My Project\\alfmart\\functions\\api\\orders.js"

export const routes = [
    {
      routePath: "/api/config",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_config_js_onRequest],
    },
  {
      routePath: "/api/orders",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_orders_js_onRequest],
    },
  ]