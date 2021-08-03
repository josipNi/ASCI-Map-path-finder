interface MatrixWithCurrentCooordinates {
  matrix: string[][];
  currentDimension: number;
  currentIndex: number;
  cameFromDirection?: CameFromDirection;
}
type CameFromDirection = "up" | "down" | "left" | "right";

interface Rule {
  description: string;
  next: (model: MatrixWithCurrentCooordinates) => RuleOutput;
}

interface CharRule {
  [key: string]: Rule;
}

type RuleOutput = [number, number, CameFromDirection] | Error;
