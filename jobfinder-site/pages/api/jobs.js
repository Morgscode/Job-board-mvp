import jobService from "../../services/jobService";

export default async function handler(req, res) {
  if (req.url.startsWith("/api/jobs")) {
    try {
      const query = new URLSearchParams(req.query);
      const { jobs, totalRecords } = await jobService.index(
        query?.toString() || ""
      );
      res.status(200).json({ jobs, totalRecords });
    } catch (error) {
      res.status(400).json({ message: error.response.data.message });
    }
  } else {
    res.status(404).json({ message: "Not Found" });
  }
}
