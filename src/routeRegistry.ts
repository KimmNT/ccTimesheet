import { Route as IndexRoute } from "./routes/index";
import { Route as AdminRoute } from "./routes/admin/index";
import { Route as UserRoute } from "./routes/user/index";

export type RegisteredRoutes =
  | typeof IndexRoute
  | typeof AdminRoute
  | typeof UserRoute;

export { IndexRoute, AdminRoute, UserRoute };
