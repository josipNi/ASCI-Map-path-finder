const getDimensionsAroundCurrentPoint = ({
  currentDimension,
  currentIndex,
  matrix,
}: Omit<MatrixWithCurrentCooordinates, "cameFromDirection">) => {
  const leftIndex = currentIndex - 1;
  const rightIndex = currentIndex + 1;
  const left = matrix[currentDimension][leftIndex];
  const right = matrix[currentDimension][rightIndex];
  const upDimension = currentDimension - 1;
  const downDimension = currentDimension + 1;
  const down = matrix[downDimension] && matrix[downDimension][currentIndex];
  const up = matrix[upDimension] && matrix[upDimension][currentIndex];
  return {
    upDimension,
    downDimension,
    leftIndex,
    rightIndex,
    up,
    down,
    left,
    right,
  };
};

const SpecialCharactersRules: CharRule = {
  "@": {
    description:
      "Is the starting point and should check all directions, only one should be valid",
    next: (model: MatrixWithCurrentCooordinates) => {
      const {
        up,
        down,
        left,
        right,
        rightIndex,
        leftIndex,
        upDimension,
        downDimension,
      } = getDimensionsAroundCurrentPoint(model);
      let counter = 0;
      let nextDimension = 0;
      let nextIndex = 0;
      let cameFromDirection: CameFromDirection = "left";
      if (up) {
        ++counter;
        nextDimension = upDimension;
        nextIndex = model.currentIndex;
        cameFromDirection = "up";
      }
      if (down) {
        ++counter;
        nextDimension = downDimension;
        nextIndex = model.currentIndex;
        cameFromDirection = "down";
      }
      if (right) {
        ++counter;
        nextDimension = model.currentDimension;
        nextIndex = rightIndex;
        cameFromDirection = "right";
      }
      if (left) {
        ++counter;
        nextDimension = model.currentDimension;
        nextIndex = leftIndex;
        cameFromDirection = "left";
      }
      if (counter > 1) {
        return new Error("Multiple possible directions");
      }
      return [nextDimension, nextIndex, cameFromDirection];
    },
  },
  "+": {
    description:
      "If a + is found you can go either left or right, this can be decided by the direction you came from",
    next: (model: MatrixWithCurrentCooordinates) => {
      const dimensions = getDimensionsAroundCurrentPoint(model);
      const cameFromDirection = model.cameFromDirection;

      if (cameFromDirection === "up" || cameFromDirection === "down") {
        const currentDimension = model.currentDimension;
        const { left, right, leftIndex, rightIndex } = dimensions;
        if (left && right) {
          return new Error("Invalid turn");
        } else if (left) {
          return [currentDimension, leftIndex, "left"];
        } else if (right) {
          return [currentDimension, rightIndex, "right"];
        }
      }
      if (cameFromDirection === "left" || cameFromDirection == "right") {
        const currentIndex = model.currentIndex;
        const { up, down, downDimension, upDimension } = dimensions;
        if (up && down) {
          return new Error("Invalid turn");
        } else if (down) {
          return [downDimension, currentIndex, "down"];
        } else if (up) {
          return [upDimension, currentIndex, "up"];
        }
      }
      return new Error("Invalid turn");
    },
  },
  "|": {
    description:
      "If a | is found you can go either up or down, but not the direction you came from (you need to keep moving in the same direction)",
    next: (model: MatrixWithCurrentCooordinates) => {
      const dimensions = getDimensionsAroundCurrentPoint(model);
      const cameFromDirection = model.cameFromDirection;
      if (cameFromDirection === "up") {
        return [dimensions.upDimension, model.currentIndex, "up"];
      }
      if (cameFromDirection === "down") {
        return [dimensions.downDimension, model.currentIndex, "down"];
      }

      return new Error("Not possible");
    },
  },
  "-": {
    description: `If a - is found you can either move left or right, keep the direction you came from
       Treat it as | when moving up or down
      `,
    next: (model: MatrixWithCurrentCooordinates) => {
      const dimensions = getDimensionsAroundCurrentPoint(model);
      const cameFromDirection = model.cameFromDirection;
      if (cameFromDirection === "left") {
        return [model.currentDimension, dimensions.leftIndex, "left"];
      } else if (cameFromDirection === "right") {
        return [model.currentDimension, dimensions.rightIndex, "right"];
      } else {
        return SpecialCharactersRules["|"].next(model);
      }
    },
  },
};
const LetterRules: Rule = {
  description:
    "If a letter is found you can either keep moving left or right or turn",
  next: (model: MatrixWithCurrentCooordinates) => {
    const cameFromDirection = model.cameFromDirection;
    if (cameFromDirection === "left" || cameFromDirection === "right") {
      return SpecialCharactersRules["-"].next(model);
    } else {
      let result = SpecialCharactersRules["+"].next(model);
      if (result instanceof Error) {
        result = SpecialCharactersRules["|"].next(model);
      }
      return result;
    }
  },
};
export { SpecialCharactersRules, LetterRules };
