import maps from "./maps.js";
import { MatrixParser } from "./MatrixParser.js";
import { PathFinder } from "./PathFinder.js";

maps.forEach((x, i) => {
  const matrixParser = new MatrixParser(x);
  if (!matrixParser.isValid) {
    console.error(matrixParser.invalidReasons);
    return;
  }
  const pathFinder = new PathFinder(matrixParser.toModel());
  if (!pathFinder.isValid) {
    console.error(pathFinder.invalidReasons);
    return;
  }
});

export {};
