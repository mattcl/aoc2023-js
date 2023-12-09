
function process(sequence: number[]): number[] {
  const out: number[] = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    out.push(sequence[i + 1] - sequence[i])
  }
  return out;
}

function extrapolate(sequence: number[], diffs: [number, number]): [number, number] {
  return [
    sequence[0] - diffs[0],
    sequence[sequence.length - 1] + diffs[1]
  ]
}

function extrapolate_sequence(sequence: number[]): [number, number] {
  const new_seq = process(sequence);

  if (new_seq.every(item => item === 0)) {
    return extrapolate(sequence, [0, 0]);
  } else {
    const diffs = extrapolate_sequence(new_seq);
    return extrapolate(sequence, diffs);
  }
}

function extrapolate_all(sequences: number[][]): [number, number] {
  return sequences
    .map(extrapolate_sequence)
    .reduce((acc, v) => {
      acc[0] += v[0];
      acc[1] += v[1];
      return acc;
    },
    [0, 0])
}

class Day09 {
  left: number;
  right: number;

  constructor(input: string) {
    const sequences = input
      .split("\n")
      .filter(item => item)
      .map(line => line.split(' ').map(v => parseInt(v)));

    const ans = extrapolate_all(sequences);
    this.left = ans[0];
    this.right = ans[1];
  }

  partOne(): number {
    return this.right;
  }

  partTwo(): number {
    return this.left;
  }
}

export { Day09 }
