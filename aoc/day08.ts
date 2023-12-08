const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

class Node {
  left: string;
  right: string;
  ends_with_a: boolean;
  ends_with_z: boolean;

  constructor(key:string, left: string, right: string) {
    this.left = left;
    this.right = right;
    this.ends_with_a = key.endsWith("A");
    this.ends_with_z = key.endsWith("Z");
  }
}

class Day08 {
  instructions: string[];
  mapping: Map<string, Node>;

  constructor(input: string) {
    this.mapping = new Map();

    const sections = input.split("\n\n").filter(item => item);
    this.instructions = sections[0].split('');

    for (const line of sections[1].split("\n").filter(item => item)) {
      const components = line.split(" = ");
      const key = components[0];
      const sides = components[1].replace("(", "").replace(")", "").split(", ")
      this.mapping.set(key, new Node(key, sides[0], sides[1]));
    }
  }

  partOne(): number {
    let count = 0;
    let cur = "AAA";
    let cur_node = this.mapping.get(cur);

    let i = 0;

    while (true) {
      if (cur === 'ZZZ') {
        return count;
      }

      if (this.instructions[i] === 'L') {
        cur = cur_node.left;
      } else {
        cur = cur_node.right;
      }

      cur_node = this.mapping.get(cur);

      count += 1;
      i += 1;
      if (i >= this.instructions.length) {
        i = 0;
      }
    }
  }

  partTwo(): number {
    const counts: number[] = [];
    for (const [k, v] of this.mapping) {
      if (v.ends_with_a) {
        counts.push(this.get_first_z(k));
      }
    }

    return counts.reduce(lcm);
  }

  get_first_z(start: string): number {
    let count = 0;
    let cur = start;
    let cur_node = this.mapping.get(cur)

    let i = 0;

    while (true) {
      if (cur_node.ends_with_z) {
        return count;
      }

      if (this.instructions[i] === 'L') {
        cur = cur_node.left;
      } else {
        cur = cur_node.right;
      }

      cur_node = this.mapping.get(cur);

      count += 1;
      i += 1;
      if (i >= this.instructions.length) {
        i = 0;
      }
    }
  }
}

export { Day08 }
