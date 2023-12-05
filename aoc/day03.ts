
const NEIGHBORS = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [1, -1],
    [1, 1],
];

function isDigit(v) {
  return (v >= '0' && v <= '9');
}

class Day03 {
  total_sum: number;
  total_prod: number;
  height: number;
  width: number;
  lines: [string];

  constructor(input: string) {
    this.total_sum = 0;
    this.total_prod = 0;

    this.lines = input.split("\n").filter(item => item);
    this.height = this.lines.length;
    this.width = this.lines[0].length;

    const seen = new Set<[number, number]>();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const ch = this.lines[row].charAt(col);

        if (!(isDigit(ch) || ch === '.')) {
          const locs = [];

          let idx = 0;

          while (idx < 8) {
            const offset = NEIGHBORS[idx];

            const newRow = row + offset[0];
            if (newRow < 0 || newRow >= this.height) {
              idx += 1;
              continue;
            }

            const newCol = col + offset[1];
            if (newCol < 0 || newCol >= this.width) {
              idx += 1;
              continue;
            }

            const neighbor = this.lines[newRow][newCol];
            if (isDigit(neighbor)) {
              locs.push([newRow, newCol]);

              if (idx === 2 || idx === 5) {
                idx += 3;
                continue;
              }
            }

            idx += 1;
          }

          if (locs.length > 0) {
            this.process(locs, seen, ch === '*');
          }
        }
      }
    }
  }

  process(candidates: [[number, number]], seen: Set<[number, number]>, is_star: boolean) {
    let count = 0
    let sub_prod = 1

    for (const candidate of candidates) {
      if (seen.has(candidate)) {
          continue;
      }

      seen.add(candidate);

      let continue_outer = false;
      const row = candidate[0];

      let nums = this.lines[row].charAt(candidate[1]);

      // walk west
      let pos = candidate[1] - 1;
      while (pos >= 0) {
        const west: [number, number] = [row, pos];
        if (seen.has(west)) {
          continue_outer = true;
          break;
        }

        const ch = this.lines[row].charAt(pos);
        if (isDigit(ch)) {
          pos -= 1;
          nums = ch + nums;
          seen.add(west);
          continue;
        }

        break;
      }

      if (continue_outer) {
        continue;
      }

      // walk east
      pos = candidate[1] + 1;
      while (pos < this.width) {
        const east: [number, number] = [row, pos];
        if (seen.has(east)) {
          continue_outer = true;
          break;
        }

        const ch = this.lines[row].charAt(pos);
        if (isDigit(ch)) {
          pos += 1;
          nums += ch;
          seen.add(east);
          continue;
        }

        break;
      }

      if (continue_outer) {
        continue;
      }

      const number = parseInt(nums);

      this.total_sum += number;
      count += 1;
      sub_prod *= number;
    }

    if (is_star && count === 2) {
        this.total_prod += sub_prod;
    }
  }

  partOne(): number {
    return this.total_sum;
  }

  partTwo(): number {
    return this.total_prod;
  }
}

export { Day03 }
