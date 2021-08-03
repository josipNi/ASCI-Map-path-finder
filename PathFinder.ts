import { SpecialCharactersRules, LetterRules } from "./Rules.js";
export class PathFinder implements MatrixWithCurrentCooordinates {
  currentDimension: number;
  currentIndex: number;
  matrix: string[][];
  isValid: boolean;
  invalidReasons: {};
  private _charMap: string[];
  private _pathMap: string[];
  private _visitedMap: {
    [x: number]: {
      [x: number]: boolean;
    };
  };
  cameFromDirection?: CameFromDirection;
  constructor(matrixModel: MatrixWithCurrentCooordinates) {
    this.currentDimension = matrixModel.currentDimension;
    this.currentIndex = matrixModel.currentIndex;
    this.matrix = matrixModel.matrix;
    this.cameFromDirection = matrixModel.cameFromDirection;
    this._charMap = [];
    this._pathMap = [];
    this._visitedMap = {};
    this.isValid = true;
    this.invalidReasons = {};
    this.mapPath();
  }

  private mapPath = (): void => {
    const char = this.matrix[this.currentDimension][this.currentIndex];
    if (!char) {
      this.isValid = false;
      this.invalidReasons = {
        ...this.invalidReasons,
        invalidPath: `Path is broken`,
      };
      return;
    }
    this._pathMap.push(char);
    if (char === "x") {
      this.pathMap = this._pathMap.join("");
      this.charMap = this._charMap.join("");
      return;
    }
    let next =
      SpecialCharactersRules[char] && SpecialCharactersRules[char].next;
    if (!next) {
      next = LetterRules.next;
      const isNotVisited =
        this._visitedMap[this.currentDimension][this.currentIndex];
      if (!isNotVisited) {
        this._charMap.push(char);
        this._visitedMap[this.currentDimension][this.currentIndex] = true;
      }
    }
    const result = next(this);
    if (result instanceof Error) {
      this.isValid = false;
      this.invalidReasons = {
        ...this.invalidReasons,
        invalidPath: result.message,
      };
      return;
    }
    const [nextDimension, nextIndex, cameFromDirection] = result;
    if (!this._visitedMap[nextDimension]) {
      this._visitedMap[nextDimension] = {};
    }

    this.cameFromDirection = cameFromDirection;
    this.currentDimension = nextDimension;
    this.currentIndex = nextIndex;
    return this.mapPath();
  };
  pathMap: string = "";
  charMap: string = "";
}
