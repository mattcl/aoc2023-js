class Day06 {
  times: number[];
  records: number[];
  big_time: number;
  big_record: number;

  constructor(input: string) {
    const lines = input.split("\n").filter(item => item);
    const times = lines[0].replace("Time:", "")
    const records = lines[1].replace("Distance:", "")

    this.times = times.split(" ").filter(item => item).map(item => parseInt(item));
    this.records = records.split(" ").filter(item => item).map(item => parseInt(item));

    this.big_time = parseInt(times.replaceAll(" ", ""));
    this.big_record = parseInt(records.replaceAll(" ", ""));
  }

  ways_to_beat(time: number, record: number): number {
    const t2 = time * time;
    const b = Math.sqrt(t2 - 4.0 * record);

    const lower_raw = 0.5 * (time - b);
    const upper_raw = 0.5 * (time + b);

    let lower = Math.ceil(lower_raw);
    let upper = Math.floor(upper_raw);

    // hande floating point errors
    while ((time - lower) * lower <= record) {
      lower += 1;
    }

    while ((time - upper) * upper <= record) {
      upper -= 1;
    }

    return upper - lower + 1;
  }

  partOne(): number {
    let prod = 1;
    for (let i = 0; i < this.times.length; i++) {
      prod *= this.ways_to_beat(this.times[i], this.records[i]);
    }
    return prod;
  }

  partTwo(): number {
    return this.ways_to_beat(this.big_time, this.big_record);
  }
}

export { Day06 }
