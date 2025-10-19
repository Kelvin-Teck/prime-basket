import app from "./server";
import { PORT }  from "./server";



app.listen(PORT, () => {
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║     PRIME BASKET API SERVER STARTED     ║");
    console.log("╚════════════════════════════════════════╝\n");
    console.log(`[Environment]: ${process.env.NODE_ENV || "development"}`);
    console.log(`[API Documentation]: http://localhost:${PORT}/`);
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
