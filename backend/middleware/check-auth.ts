import { expressjwt } from"express-jwt";

const JWT_KEY = process.env.JWT_KEY || "";

const checkAuth = expressjwt({
  secret: JWT_KEY,
  algorithms: ["HS256"],
  requestProperty: "userData",
});

export default checkAuth;
