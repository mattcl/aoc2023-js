class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  contains(v: number) {
    return v >= this.start && v <= this.end;
  }
}

class Entry {
  source: Range;
  dest: Range;

  constructor(dest: number, source: number, len: number) {
    this.source = new Range(source, source + len - 1);
    this.dest = new Range(dest, dest + len - 1);
  }

  translate(v: number) {
    if (this.source.contains(v)) {
      return this.dest.start + v - this.source.start;
    }
    return null;
  }

  contains(other: Range): boolean {
    return this.source.start <= other.start && other.end <= this.source.end;
  }

  right_of_overlapping(other: Range): boolean {
    return other.start < this.source.start && this.source.start <= other.end && other.end <= this.source.end;
  }

  left_of_overlapping(other: Range): boolean {
    return this.source.start <= other.start && other.start <= this.source.end && this.source.end < other.end;
  }

  is_contained_by(other: Range): boolean {
    return other.start < this.source.start && this.source.end < other.end;
  }
}


class Day05 {
  seeds: [number];
  range_maps: Entry[][];

  constructor(input: string) {
    const groups = input.split("\n\n").filter(item => item);
    this.seeds = groups[0].trim().replace("seeds: ", "").split(" ").map(item => parseInt(item));
    this.range_maps = [];

    for (let i = 1; i < groups.length; i++) {
      const lines = groups[i].split("\n").filter(item => item);
      const entries = [];
      for (let j = 1; j < lines.length; j++) {
        const vals = lines[j].trim().split(" ").map(item => parseInt(item));
        entries.push(new Entry(vals[0], vals[1], vals[2]));
      }
      entries.sort((a, b) => a.source.start - b.source.start);
      this.range_maps.push(entries);
    }

  }

  partOne(): number {
    let lowest = null;
    for (const seed of this.seeds) {
      let v = seed;
      for (const mapping of this.range_maps) {
        for (const entry of mapping) {
          const t = entry.translate(v);
          if (t !== null) {
            v = t;
            break;
          }
        }
      }

      if (lowest === null || v < lowest) {
        lowest = v;
      }
    }
    return lowest;
  }

  partTwo(): number {
    let ranges = [];

    for (let i = 0; i < this.seeds.length; i += 2) {
      ranges.push(new Range(this.seeds[i], this.seeds[i] + this.seeds[i + 1] - 1));
    }

    for (const mapping of this.range_maps) {
      const next_ranges = [];

      splitter: while (ranges.length > 0) {
        const range: Range = ranges.pop();
        for (const entry of mapping) {
          if (entry.contains(range)) {
            // our range is contained entirely by the entry range
            next_ranges.push(new Range(
              range.start + entry.dest.start - entry.source.start,
              range.end + entry.dest.start - entry.source.start,
            ));
            continue splitter;
          } else if (entry.right_of_overlapping(range)) {
            // the entry is to our right and we overlap it
            next_ranges.push(new Range(
              range.start,
              entry.source.start - 1,
            ));
            next_ranges.push(new Range(
              entry.dest.start,
              range.end + entry.dest.start - entry.source.start,
            ));
            continue splitter;
          } else if (entry.left_of_overlapping(range)) {
            // the entry is to our left and we overlap it
            next_ranges.push(new Range(
              range.start + entry.dest.start - entry.source.start,
              entry.source.end + entry.dest.start - entry.source.start,
            ));
            ranges.push(new Range(
              entry.source.end + 1,
              range.end,
            ));
            continue splitter;
          } else if (entry.is_contained_by(range)) {
            // our range entirely contains the entry and extends
            // beyond it on either side
            next_ranges.push(new Range(
              range.start,
              entry.source.start - 1,
            ));
            next_ranges.push(new Range(
              entry.dest.start,
              entry.dest.end,
            ));
            ranges.push(new Range(
              entry.source.end + 1,
              range.end,
            ));
            continue splitter;
          }
        }
        // if we're here it means we didn't find _any_ overlaps, so we
        // need to add ourself back to the next iteration
        next_ranges.push(range);
      }

      ranges = next_ranges;
    }

    return Math.min(...ranges.map(r => r.start));
  }
}

export { Day05 }
