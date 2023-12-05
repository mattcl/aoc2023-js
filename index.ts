import { Day01 } from './aoc/day01';
import { Day02 } from './aoc/day02';
import { Day03 } from './aoc/day03';
import { Day04 } from './aoc/day04';
import { Day05 } from './aoc/day05';

// This is stupid, but it's not like I know how this stuff works
const day = parseInt(process.env.AOC_DAY || "-1");
const inputPath = process.env.AOC_INPUT;
const inputFile = Bun.file(inputPath);
const input = await inputFile.text();

function solve() {
  switch(day) {
    case 1: {
      const solver = new Day01(input);
      return {
        part_one: solver.partOne(),
        part_two: solver.partTwo(),
      };
    }
    case 2: {
      const solver = new Day02(input);
      return {
        part_one: solver.partOne(),
        part_two: solver.partTwo(),
      };
    }
    case 3: {
      const solver = new Day03(input);
      return {
        part_one: solver.partOne(),
        part_two: solver.partTwo(),
      };
    }
    case 4: {
      const solver = new Day04(input);
      return {
        part_one: solver.partOne(),
        part_two: solver.partTwo(),
      };
    }
    case 5: {
      const solver = new Day05(input);
      return {
        part_one: solver.partOne(),
        part_two: solver.partTwo(),
      };
    }
    default:
      return "not implemented";
  }
}

const solution = solve();
console.log(JSON.stringify(solution));
