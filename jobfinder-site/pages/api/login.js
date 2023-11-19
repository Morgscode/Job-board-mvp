import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../utils/session";
import { http } from "../../services/http";

async function handler(req, res) {
  try {
    const login = await http.post("/login", req.body);
    const user = login.data.data.user;
    const token = login.data.token;

    http.interceptors.request.use(function (config) {
      config.headers.Authorization = token;
      return config;
    });

    req.session.user = user;
    req.session.jwt = token;
    await req.session.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: error.response.data.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
