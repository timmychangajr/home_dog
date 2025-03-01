import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("*?", "pages/login.tsx"),
  route("/home", "pages/home.tsx"),
] satisfies RouteConfig;