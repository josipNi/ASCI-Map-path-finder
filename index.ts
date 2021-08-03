import maps from "./maps.js";
import { MatrixParser } from "./MatrixParser.js";
import { PathFinder } from "./PathFinder.js";

const root = document.getElementById("root")!;

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
  const container = document.createElement("div");

  const pathDiv = document.createElement("div");
  pathDiv.innerHTML = pathFinder.pathMap;
  container.appendChild(pathDiv);

  const charDiv = document.createElement("div");
  charDiv.innerHTML = `[${pathFinder.charMap}]`;
  container.appendChild(charDiv);

  root.appendChild(container);
});

export {};
