import maps from "./maps.js";
import { MatrixParser } from "./MatrixParser.js";
import { PathFinder } from "./PathFinder.js";

const root = document.getElementById("root")!;

maps.forEach((x) => {
  const parser = new MatrixParser(x);
  const path = new PathFinder(parser.toModel());

  if (!parser.isValid || !path.isValid) {
    console.assert();
    console.error(parser.invalidReasons);
    console.error(path.invalidReasons);
    return;
  }
  const container = document.createElement("div");

  const pathDiv = document.createElement("div");
  pathDiv.innerHTML = path.pathMap;
  container.appendChild(pathDiv);

  const charDiv = document.createElement("div");
  charDiv.innerHTML = `[${path.charMap}]`;
  container.appendChild(charDiv);
  container.appendChild(document.createElement("br"));
  root.appendChild(container);
});

export {};
