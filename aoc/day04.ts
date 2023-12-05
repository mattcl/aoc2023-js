class Day04 {
  worth_sum: number;
  num_copies: number;

  constructor(input: string) {
    this.worth_sum = 0;

    const lines = input.split("\n").filter(item => item);
    const num_cards = lines.length;
    const copies = new Array(num_cards).fill(1);
    for (const { l_idx, line } of lines.map((line, l_idx) => ({ l_idx, line }))) {
      const winning = new Set<string>();
      let count = 0;
      const parts = line.split(' ').filter(item => item);

      let idx = 2;
      while (parts[idx] !== '|') {
        winning.add(parts[idx]);
        idx += 1;
      }

      idx += 1;
      const num_parts = parts.length;
      while (idx < num_parts) {
        if (winning.has(parts[idx])) {
          count += 1;
        }

        idx += 1;
      }

      if (count > 0) {
        this.worth_sum += 2 ** (count - 1);
      }

      for (let j = l_idx + 1; j < l_idx + count + 1; j++) {
        copies[j] += copies[l_idx];
      }
    }

    this.num_copies = copies.reduce((acc, a) => acc + a, 0);
  }

  partOne(): number {
    return this.worth_sum;
  }

  partTwo(): number {
    return this.num_copies;
  }
}

export { Day04 }
