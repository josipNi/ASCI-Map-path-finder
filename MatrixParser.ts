export class MatrixParser {
  isValid: boolean = true;
  invalidReasons: {} = {};
  startDimension = -1;
  startIndex = -1;

  private matrix: string[][] = [[]];
  constructor(private readonly _map: string) {
    this.setupMatarix();
  }

  private setupMatarix = () => {
    let startCounter = 0;
    let endCounter = 0;

    let current = this.matrix[this.matrix.length - 1];
    for (let index = 0; index < this._map.length; index++) {
      const char = this._map[index];
      const isStart = char === "@";
      const isEnd = char === "x";
      const isNewLine = char === "\n";
      if (isNewLine) {
        this.matrix.push([]);
        current = this.matrix[this.matrix.length - 1];
        continue;
      }
      if (isEnd) {
        ++endCounter;
      }
      current.push(char.trim());
      if (isStart) {
        ++startCounter;
        this.startDimension = this.matrix.length - 1;
        this.startIndex = current.length - 1;
      }
    }

    if (startCounter !== 1) {
      this.isValid = false;
      this.invalidReasons = {
        ...this.invalidReasons,
        invalidStart: `Total number of @ found ${startCounter}`,
      };
    }
    if (endCounter !== 1) {
      this.isValid = false;
      this.invalidReasons = {
        ...this.invalidReasons,
        invalidEnd: `Total number of x found ${endCounter}`,
      };
    }
  };
  public printTable = () => console.table(this.matrix);
  public toModel = () =>
    ({
      matrix: this.matrix,
      currentDimension: this.startDimension,
      currentIndex: this.startIndex,
    } as MatrixWithCurrentCooordinates);
}
