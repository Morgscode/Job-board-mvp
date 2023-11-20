import { http } from "../../services/http";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email = null } = req.body;
    if (!email) {
      res.status(400).json({ message: "Your need to specify an email" });
    }
    try {
      const forgotPassword = await http.post("/forgot-password", { email });
      console.log(forgotPassword);
      res.status(200).json({
        message:
          forgotPassword?.data?.data?.message ||
          "Password reset link sent, Please check your emails",
      });
    } catch (error) {
      res.status(400).json({ message: error.response.data.message });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
