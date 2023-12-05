let cubeSet: [number, number, number];

function parseLine(line: string): typeof cubeSet {
  let r = 0;
  let g = 0;
  let b = 0;

  for (const part of line.split(", ")) {
    const sub_parts = part.split(" ");
    const v = parseInt(sub_parts[0]);
    const color = sub_parts[1];

    switch(color) {
      case 'red': {
        r = Math.max(r, v);
        break;
      }
      case 'green': {
        g = Math.max(g, v);
        break;
      }
      case 'blue': {
        b = Math.max(b, v);
        break;
      }
    }
  }

  return [r, g, b];
}

class Day02 {
  id_sum: number;
  min_prod: number;

  constructor(input: string) {
    this.id_sum = 0;
    this.min_prod = 0;

    for (const line of input.replaceAll(";", ",").replaceAll("Game ", "").split('\n').filter(line => line)) {
        const parts = line.split(": ");
        const id = parseInt(parts[0]);
        const minimum = parseLine(parts[1]);

        if (minimum[0] <= 12 && minimum[1] <= 13 && minimum[2] <= 14) {
          this.id_sum += id;
        }

        this.min_prod += minimum[0] * minimum[1] * minimum[2];
    }
  }

  partOne(): number {
    return this.id_sum;
  }

  partTwo(): number {
    return this.min_prod;
  }
}

export { Day02 }
