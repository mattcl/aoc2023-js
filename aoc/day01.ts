const DIGIT_MAP = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
};

function matchLine(start: number, line: string): number | undefined {
  const first = line.charAt(start);
  if (first in DIGIT_MAP) {
    return DIGIT_MAP[first];
  } else if (line.startsWith("one")) {
    return 1;
  } else if (line.startsWith("two")) {
    return 2;
  } else if (line.startsWith("three")) {
    return 3;
  } else if (line.startsWith("four")) {
    return 4;
  } else if (line.startsWith("five")) {
    return 5;
  } else if (line.startsWith("six")) {
    return 6;
  } else if (line.startsWith("seven")) {
    return 7;
  } else if (line.startsWith("eight")) {
    return 8;
  } else if (line.startsWith("nine")) {
    return 9;
  }
}

class Day01 {
  p1_sum: number;
  p2_sum: number;

  constructor(input: string) {
    this.p1_sum = 0;
    this.p2_sum = 0;

    for (let line of input.split('\n').filter(line => line)) {
      const length = line.length;

      let start = 0;
      let end = 0;

      for (let s_idx = 0; s_idx < length; s_idx++) {
        const v = matchLine(s_idx, line);
        if (v !== undefined) {
          this.p2_sum += v * 10;
          start = s_idx;
          break;
        }
      }

      for (let s_idx = length - 1; s_idx >= 0; s_idx--) {
        const v = matchLine(s_idx, line);
        if (v !== undefined) {
          this.p2_sum += v;
          end = s_idx;
          break;
        }
      }

      for (let s_idx = start; s_idx < length; s_idx++) {
        const v = DIGIT_MAP[line.charAt(s_idx)];
        if (v !== undefined) {
          this.p1_sum += v * 10;
          break;
        }
      }

      for (let s_idx = end; s_idx >= 0; s_idx--) {
        const v = DIGIT_MAP[line.charAt(s_idx)];
        if (v !== undefined) {
          this.p1_sum += v;
          break;
        }
      }
    }
  }

  partOne(): number {
    return this.p1_sum;
  }

  partTwo(): number {
    return this.p2_sum;
  }
}

export { Day01 }
