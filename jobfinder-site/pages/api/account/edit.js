import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/session";
import meService from "../../../services/meService";
import { intercept } from "../../../utils/axiosAuthInterceptors";

async function handler(req, res) {
  if (req.method === "POST") {
    const user = req.body;
    if (!user) {
      res.status(404).json({ message: "tahts not what we were expecting" });
    }
    try {
      intercept(req.session.jwt);
      const me = await meService.update(user);
      res.status(200).json({ me });
    } catch (error) {
      res.status(400).json({ message: error?.response?.data?.message });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
