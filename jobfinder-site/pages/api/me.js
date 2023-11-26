import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../utils/session";
import meService from "../../services/meService";
import { intercept } from "../../utils/axiosAuthInterceptors";

async function handler(req, res) {
  const { jwt } = req.session;

  if (!jwt) {
    return res.status(401).json({ message: "not authroized" });
  }

  try {
    intercept(jwt);
    const me = await meService.index();
    req.session.user = me;
    await req.session.save();
    return res.status(200).json({ user: me });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "not authroized" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
