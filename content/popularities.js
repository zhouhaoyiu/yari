import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Module-level cache
const popularities = new Map();

function getPopularities() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  if (!popularities.size) {
    // This is the file that's *not* checked into git.
    const filePath = path.resolve(
      path.join(__dirname, "..", "popularities.json")
    );
    Object.entries(JSON.parse(fs.readFileSync(filePath, "utf8"))).forEach(
      ([url, value]) => {
        popularities.set(url, value);
      }
    );
  }
  return popularities;
}

export { getPopularities };
