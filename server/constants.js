import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_ROOT =
  process.env.SERVER_STATIC_ROOT || path.join(__dirname, "../client/build");
const PROXY_HOSTNAME =
  process.env.REACT_APP_KUMA_HOST || "developer.mozilla.org";

const FAKE_V1_API = JSON.parse(process.env.SERVER_FAKE_V1_API || false);

export { STATIC_ROOT, PROXY_HOSTNAME, FAKE_V1_API };
