import { http } from "../../services/http";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "You need to verify an email" });
    }
    try {
      const emailVeirfy = await http.post("/request-email-verify", { email });
      res.status(204);
    } catch (error) {
      res.status(400).json({
        message:
          error?.response?.data?.message ||
          "There was a problem verifying the email",
      });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
