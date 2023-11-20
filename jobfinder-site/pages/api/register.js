import { http } from "../../services/http";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const register = await http.post("/register", req.body);
      res.status(200).json({
        message:
          register?.data.data?.message ||
          "Successfully registered, please verify your email address",
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        message:
          error?.response?.data?.message || "There was a problem registering",
      });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
