import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

import React from "react";
import { StaticRouter } from "react-router-dom/server.js";

import app from "../client/src/app.tsx";
import render from "./render.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// This is necessary because the ssr.js is in dist/ssr.js
// and we need to reach the .env this way.
dotenv.config({
  path: path.join(__dirname, "..", process.env.ENV_FILE || ".env"),
});

export function renderHTML(url, context) {
  return render(
    React.createElement(
      StaticRouter,
      { location: url, context },
      React.createElement(app.App, context)
    ),
    context
  );
}
