import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/session";
import meService from "../../../services/meService";
import { intercept } from "../../../utils/axiosAuthInterceptors";

async function handler(req, res) {
  const { jwt } = req.session;

  if (!jwt) {
    res.status(401).json({ message: "Not Authorized" });
  }

  if (req.method === "POST") {
    const user = req.body;
    if (!user) {
      res.status(400).json({ message: "Thats not what we were expecting" });
    }
    try {
      intercept(jwt);
      const me = await meService.update(user);
      req.session.user = me;
      await req.session.save();
      res.status(200).json({ me });
    } catch (error) {
      console.error("error", error);
      res.status(400).json({ message: error?.response?.data?.message });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
