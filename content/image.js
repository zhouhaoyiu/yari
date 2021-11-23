import fs from "fs";
import path from "path";

import { readChunk, readChunkSync } from "read-chunk";
import imageType from "image-type";
import isSvg from "is-svg";

import { ROOTS } from "./constants.js";
import { memoize, slugToFolder } from "./utils.js";

function isImage(filePath) {
  if (fs.statSync(filePath).isDirectory()) {
    return false;
  }
  if (filePath.toLowerCase().endsWith(".svg")) {
    return isSvg(fs.readFileSync(filePath));
  }
  const buffer = readChunkSync(filePath, { length: 12, startPosition: 0 });
  if (buffer.length === 0) {
    return false;
  }
  const type = imageType(buffer);
  if (!type) {
    // This happens when there's no match on the "Supported file types"
    // https://github.com/sindresorhus/image-type#supported-file-types
    return false;
  }

  return true;
}

function urlToFilePath(url) {
  const [, locale, , ...slugParts] = decodeURI(url).split("/");
  return path.join(locale.toLowerCase(), slugToFolder(slugParts.join("/")));
}

const find = memoize((relativePath) => {
  return ROOTS.map((root) => path.join(root, relativePath)).find(
    (filePath) => fs.existsSync(filePath) && isImage(filePath)
  );
});

function findByURL(url) {
  return find(urlToFilePath(url));
}

export { findByURL };
