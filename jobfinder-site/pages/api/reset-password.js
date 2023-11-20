import { http } from "../../services/http";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { form = null, user = null, token = null } = req.body;
    if (!form || !user || !token) {
      res.status(400).json({ message: "Thats not what we expected" });
    }
    try {
      const reset = await http.put(
        "/update-password",
        { ...form },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      res.status(200).json({
        message: reset.data?.data?.message || "Password reset. Please log in",
      });
    } catch (error) {
      res.status(400).json({ message: error.response.data.message });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
