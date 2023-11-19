import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../utils/session";
import { http } from "../../services/http";

async function handler(req, res) {
  await req.session.destroy();
  http.defaults.headers.common["Authorization"] = null;
  res.status(200).json({ message: "logged out" });
}

export default withIronSessionApiRoute(handler, sessionOptions);
