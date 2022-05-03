import fs from "fs";
import path from "path";

import express from "express";

import { Document } from "../content/index.js";
import { analyzeDocument } from "../build/index.js";

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MACROS_ROOT = path.join(__dirname, "..", "kumascript", "macros");
console.assert(fs.existsSync(MACROS_ROOT), `${MACROS_ROOT} does not exist`);

const router = express();

let _cachedAnalyzedDocuments = null;

router.get("/", async (req, res) => {
  const metadata = {};
  const t0 = new Date();
  try {
    console.time("analyzeDocuments");
    const documents = _cachedAnalyzedDocuments
      ? _cachedAnalyzedDocuments
      : await analyzeDocuments();
    console.timeEnd("analyzeDocuments");
    _cachedAnalyzedDocuments = documents;
    const t1 = new Date();
    metadata.tookSeconds = (t1 - t0) / 1000;
    metadata.count = documents.length;
    res.json({
      documents,
      metadata,
      fromCache: !!_cachedAnalyzedDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});

async function analyzeDocuments() {
  const documents = Document.findAll();
  if (!documents.count) {
    throw new Error("No documents to build found");
  }

  const docs = [];
  for (const document of documents.iter()) {
    document.noIndexing =
      (document.isArchive && !document.isTranslated) ||
      document.metadata.slug === "MDN/Kitchensink";
    if (document.noIndexing) {
      continue;
    }

    docs.push(await analyzeDocument(document));
  }

  return docs;
}

export default router;
