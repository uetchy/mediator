#!/usr/bin/env node

import yargs from "yargs";
import fs from "fs";
import parsers from "./parser";
import converters from "./converter";

interface Argv {
  [x: string]: unknown;
  parser: string;
  converter: string;
  _: string[];
  $0: string;
}

async function main(argv: Argv) {
  const sourceFile = argv._?.[0];
  if (!sourceFile) {
    throw new Error("No source file given");
  }
  const sourceString = fs.readFileSync(sourceFile, "utf-8");

  const parser = require(parsers[argv.parser]).default;
  const converter = require(converters[argv.converter]).default;
  const parsed = parser(sourceString);
  const converted = converter(parsed);
  console.log(converted);
}

const argv = yargs
  .option("parser", {
    alias: ["f", "from"],
    choices: Object.keys(parsers),
    required: true
  })
  .option("converter", {
    alias: ["t", "to"],
    choices: Object.keys(converters),
    required: true
  }).argv;

main(argv);
