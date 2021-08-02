function isAsciLetter(str) {
  if (typeof str !== "string") {
    return false;
  }
  for (var i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 65 || code > 90) {
      return false;
    }
  }
  return true;
}

const map1 = `
@---A---+
        |
x-B-+   C
    |   |
    +---+
`;
const map2 = `
@
| +-C--+
A |    |
+---B--+
  |      x
  |      |
  +---D--+
`;

const map3 = `
@---A---+
        |
x-B-+   |
    |   |
    +---C
`;

const map4 = `
    +-O-N-+
    |     |
    |   +-I-+
@-G-O-+ | | |
    | | +-+ E
    +-+     S
            |
            x
`;

interface MatrixObj {
  isVisited: boolean;
  char: string;
}
const toMatrix = (input: string): [string[][], [MatrixObj[]]] => {
  const example = [
    ["@", "-", "-", "-", "A", "-", "-", "-", "+"],
    [" ", " ", " ", " ", " ", " ", " ", " ", "|"],
    ["x", "-", "B", "-", "+", " ", " ", " ", "C"],
    [" ", " ", " ", " ", "|", " ", " ", " ", "|"],
    [" ", " ", " ", " ", "+", "-", "-", "-", "+"],
  ];

  const pureMatrix: [string[]] = [[]];
  const matrix: [MatrixObj[]] = [[{ isVisited: false, char: "" }]];

  let current = matrix[matrix.length - 1];
  let currentPure = pureMatrix[pureMatrix.length - 1];
  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    const obj: MatrixObj = {
      isVisited: false,
      char,
    };
    const isNewLine = char === "\n";
    if (isNewLine) {
      matrix.push([obj]);
      pureMatrix.push([]);
      current = matrix[matrix.length - 1];
      currentPure = pureMatrix[pureMatrix.length - 1];
      continue;
    }
    current.push(obj);
    currentPure.push(char.trim());
  }
  console.table(pureMatrix);
  return [pureMatrix, matrix];
};
type UpDownOrUndefined = "up" | "down" | "left" | "right";
const findNextDimensionAndIndex = (
  matrix: [string[]],
  currentDimension: number,
  currentIndex: number,
  visitedMap: any,
  cameFrom: UpDownOrUndefined
): [number, number, string, UpDownOrUndefined] => {
  const leftIndex = currentIndex - 1;
  const rightIndex = currentIndex + 1;
  const upDimension = currentDimension - 1;
  const downDimension = currentDimension + 1;

  const down = matrix[downDimension][currentIndex];
  const up = matrix[upDimension][currentIndex];
  const left = matrix[currentDimension][leftIndex];
  const right = matrix[currentDimension][rightIndex];

  const hasVisitedRight =
    visitedMap[currentDimension] && visitedMap[currentDimension][rightIndex];
  const hasVisitedLeft =
    visitedMap[currentDimension] && visitedMap[currentDimension][leftIndex];
  const hasVisitedUp =
    visitedMap[upDimension] && visitedMap[upDimension][currentIndex];
  const hasVisitedDown =
    visitedMap[downDimension] && visitedMap[downDimension][currentIndex];

  if (!hasVisitedLeft && left) {
    const char = left;
    return [currentDimension, leftIndex, char, "left"];
  }
  if (!hasVisitedRight && right) {
    const char = right;
    return [currentDimension, rightIndex, char, "right"];
  }
  if (!hasVisitedDown && down) {
    const char = down;
    cameFrom = "down";
    return [downDimension, currentIndex, char, cameFrom];
  }
  if (!hasVisitedUp && up) {
    const char = up;
    cameFrom = "up";
    return [upDimension, currentIndex, char, cameFrom];
  }

  let nextDimension;
  let char;
  if (cameFrom === "up") {
    nextDimension = currentDimension + 1;
    char = down;
  } else {
    nextDimension = currentDimension - 1;
    char = up;
  }

  return [nextDimension, currentIndex, char, cameFrom];
};

const findStart = function findStart(matrix: [string[]]) {
  for (
    let currentDimension = 0;
    currentDimension < matrix.length;
    currentDimension++
  ) {
    const dimension = matrix[currentDimension];
    for (let index = 0; index < dimension.length; index++) {
      const char = dimension[index];
      const isStart = char === "@";
      if (isStart) {
        return [currentDimension, index];
      }
    }
  }
  throw new Error(`@Start not found`);
};

const toOutput = (
  matrix: [string[]],
  currentDimension: number,
  currentIndex: number,
  charMap?: string[],
  pathMap?: string[],
  visitedMap?: {},
  upOrDown?: UpDownOrUndefined
) => {
  if (!charMap) {
    charMap = [];
  }
  if (!pathMap) {
    pathMap = ["@"];
  }
  if (!visitedMap) {
    visitedMap = {};
  }
  if (!visitedMap[currentDimension]) {
    visitedMap[currentDimension] = {};
  }

  visitedMap[currentDimension][currentIndex] = true;

  const [nextDimension, nextIndex, char, cameFrom] = findNextDimensionAndIndex(
    matrix,
    currentDimension,
    currentIndex,
    visitedMap,
    upOrDown
  );
  pathMap.push(char);
  if (char === "x") {
    return [pathMap.join(""), charMap];
  }

  if (isAsciLetter(char)) {
    charMap.push(char);
  }
  currentDimension = nextDimension;
  currentIndex = nextIndex;

  return toOutput(
    matrix,
    currentDimension,
    currentIndex,
    charMap,
    pathMap,
    visitedMap,
    cameFrom
  );
};
let [pureMatrix, matrix] = [, []];
let [startDimension, startIndex] = [0, 0];
let result: any;

// [pureMatrix, matrix] = toMatrix(map1);
// [startDimension, startIndex] = findStart(pureMatrix);
// result = toOutput(pureMatrix as [string[]], startDimension, startIndex);
// console.log({ result });

[pureMatrix, matrix] = toMatrix(map2);
[startDimension, startIndex] = findStart(pureMatrix);
result = toOutput(pureMatrix as [string[]], startDimension, startIndex);
console.log({ result });

[pureMatrix, matrix] = toMatrix(map3);
[startDimension, startIndex] = findStart(pureMatrix);
result = toOutput(pureMatrix as [string[]], startDimension, startIndex);
console.log({ result });

[pureMatrix, matrix] = toMatrix(map4);
[startDimension, startIndex] = findStart(pureMatrix);
result = toOutput(pureMatrix as [string[]], startDimension, startIndex);
console.log({ result });
