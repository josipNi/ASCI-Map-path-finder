import maps from "../maps.js";
import { MatrixParser } from "../MatrixParser.js";
import { PathFinder } from "../PathFinder.js";

const assert = (expected: any, given: any) => {
  console.assert(expected === given);
  console.log({ expected, given });
};

const run = (expectedLetters: string, expectedPath: string, map: string) => {
  const parser = new MatrixParser(map);
  if (!parser.isValid) {
    console.assert();
    console.error(parser.invalidReasons, "\n");
    return;
  }
  const path = new PathFinder(parser.toModel());
  if (!path.isValid) {
    console.assert();
    console.error(path.invalidReasons, "\n");
    return;
  }
  assert(path.charMap, expectedLetters);
  assert(path.pathMap, expectedPath);
};

const testMap1 = () => {
  console.log("Map 1 - a basic example");
  const expectedLetters = "ACB";
  const expectedPath = "@---A---+|C|+---+|+-B-x";
  run(expectedLetters, expectedPath, maps[0]);
};

const testMap2 = () => {
  console.log("Map 2 - go straight through intersections");
  const expectedLetters = "ABCD";
  const expectedPath = "@|A+---B--+|+--C-+|-||+---D--+|x";
  run(expectedLetters, expectedPath, maps[1]);
};
const testMap3 = () => {
  console.log("Map 3 - letters may be found on turns");
  const expectedLetters = "ACB";
  const expectedPath = "@---A---+|||C---+|+-B-x";
  run(expectedLetters, expectedPath, maps[2]);
};

const testMap4 = () => {
  console.log("Map 4 - do not collect a letter from the same location twice");
  const expectedLetters = "GOONIES";
  const expectedPath = "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x";
  run(expectedLetters, expectedPath, maps[3]);
};

const testMap5 = () => {
  console.log("Map 5 - keep direction, even in a compact space");
  const expectedLetters = "BLAH";
  const expectedPath = "@B+++B|+-L-+A+++A-+Hx";
  run(expectedLetters, expectedPath, maps[4]);
};

const testMap6 = () => {
  console.log("Map 6 - no start");
  run("", "", maps[5]);
};

const testMap7 = () => {
  console.log("Map 7 - no end");
  run("", "", maps[6]);
};

const testMap8 = () => {
  console.log("Map 8 - multiple starts");
  run("", "", maps[7]);
};

const testMap9 = () => {
  console.log("Map 9 - multiple ends");
  run("", "", maps[8]);
};

const testMap10 = () => {
  console.log("Map 10 - T forks");
  run("", "", maps[9]);
};

const testMap11 = () => {
  console.log("Map 11 - broken path");
  run("", "", maps[10]);
};

const testMap12 = () => {
  console.log("Map 12 - multiple starting paths");
  run("", "", maps[11]);
};

const testMap13 = () => {
  console.log("Map 13 - fake turn");
  run("", "", maps[12]);
};

testMap1();
testMap2();
testMap3();
testMap4();
testMap5();
testMap6();
testMap7();
testMap8();
testMap9();
testMap10();
testMap11();
testMap12();
testMap13();

export {};
