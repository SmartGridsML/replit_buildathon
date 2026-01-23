import express from "express";
import cors from "cors";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

const app = express();
const PORT = 3001;

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

async function main() {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auth server running on port ${PORT}`);
  });
}

main().catch(console.error);
