import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../utils/session";
import jobApplicationService from "../../../services/jobApplicationService";

async function handler(req, res) {
  const { jwt } = req.session;

  if (!jwt) {
    res.status(401).json({ message: "Not Authorized" });
  }

  if (req.method === "POST") {
    try {
      const data = { ...req.body };
      console.log(data);
      const application = await jobApplicationService.create(data);
      res.status(200).json({ application });
    } catch (error) {
      res.status(400).json({ message: error.response.data.message });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default withIronSessionApiRoute(handler, sessionOptions);
