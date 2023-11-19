import { http } from "../../services/http";

export default async function handler(req, res) {
  try {
    const register = await http.post("/register", req.body);
    res.status(200).json({ data: { register } });
  } catch (error) {
    res.status(400).json({ message: error.response.data.message });
  }
}
