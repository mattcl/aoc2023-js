
enum Directions {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}

function right(dir: Directions): Directions {
  switch(dir) {
    case Directions.NORTH:
      return Directions.EAST;
    case Directions.EAST:
      return Directions.SOUTH;
    case Directions.SOUTH:
      return Directions.WEST;
    case Directions.WEST:
      return Directions.NORTH;
  }
}

function left(dir: Directions): Directions {
  switch(dir) {
    case Directions.NORTH:
      return Directions.WEST;
    case Directions.WEST:
      return Directions.SOUTH;
    case Directions.SOUTH:
      return Directions.EAST;
    case Directions.EAST:
      return Directions.NORTH;
  }
}


class Location {
  row: number;
  col: number;

  constructor(r: number, c: number) {
    this.row = r;
    this.col = c;
  }

  add(other: Location): Location {
    return new Location(this.row + other.row, this.col + other.col)
  }

  set_key(height: number): number {
    return this.row * height + this.col;
  }
}

const VERTICAL = 0 // '|'
const HORIZONAL = 1 // '-'
const NE90 = 2 // 'L'
const NW90 = 3 // 'J'
const SW90 = 4 // '7'
const SE90 = 5 // 'F'
const GROUND = 6 // '.'
const START = 7 // 'S'
const MAIN_LOOP = 8 // 'X'

const TRANSLATE = {
  '|': VERTICAL,
  '-': HORIZONAL,
  'L': NE90,
  'J': NW90,
  '7': SW90,
  'F': SE90,
  '.': GROUND,
  'S': START,
}

const NEIGHBORS = [
  new Location(-1, 0),
  new Location(0, 1),
  new Location(1, 0),
  new Location(0, -1),
];

class State {
  location: Location;
  facing: Directions;
  tile: number;

  constructor(location: Location, facing: Directions, tile: number) {
    this.location = location;
    this.facing = facing;
    this.tile = tile;
  }

  right_locs(seen: Set<number>, maze: number[][], width: number, height: number): Location[] {
    const out = [];
    if (this.facing === Directions.NORTH && this.tile === NW90) {
      const loc = this.location.add(NEIGHBORS[Directions.SOUTH]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    } else if (this.facing === Directions.SOUTH && this.tile === SE90) {
      const loc = this.location.add(NEIGHBORS[Directions.NORTH]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    } else if (this.facing === Directions.EAST && this.tile === NE90) {
      const loc = this.location.add(NEIGHBORS[Directions.WEST]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    } else if (this.facing === Directions.WEST && this.tile === SW90) {
      const loc = this.location.add(NEIGHBORS[Directions.EAST]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    }

    const loc = this.location.add(NEIGHBORS[right(this.facing)]);
    if (loc.row > 0 && loc.col > 0 && loc.row < height && loc.col < width) {
      if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
        out.push(loc);
      }
    }

    return out;
  }

  left_locs(seen: Set<number>, maze: number[][], width: number, height: number): Location[] {
    const out = [];
    if (this.facing === Directions.NORTH && this.tile === NE90) {
      const loc = this.location.add(NEIGHBORS[Directions.SOUTH]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    } else if (this.facing === Directions.SOUTH && this.tile === SW90) {
      const loc = this.location.add(NEIGHBORS[Directions.NORTH]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    } else if (this.facing === Directions.EAST && this.tile === SE90) {
      const loc = this.location.add(NEIGHBORS[Directions.WEST]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    } else if (this.facing === Directions.WEST && this.tile === NW90) {
      const loc = this.location.add(NEIGHBORS[Directions.EAST]);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          out.push(loc);
        }
      }
    }

    const loc = this.location.add(NEIGHBORS[left(this.facing)]);
    if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
      if (maze[loc.row][loc.col] !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
        out.push(loc);
      }
    }

    return out;
  }
}

class Actor {
  location: Location;
  facing: Directions;
  right_turns: number;
  left_turns: number;
  history: State[];

  constructor(location: Location, facing: Directions, tile: number) {
    this.location = location;
    this.facing = facing;
    this.right_turns = 0;
    this.left_turns = 0;
    this.history = [new State(location, facing, tile)];
  }

  advance(grid: number[][]) {
    const next_location = this.location.add(NEIGHBORS[this.facing]);

    const tile = grid[next_location.row][next_location.col];
    if (this.facing === Directions.NORTH) {
      if (tile === SW90) {
        this.facing = Directions.WEST;
        this.left_turns += 1;
      } else if (tile === SE90) {
        this.facing = Directions.EAST;
        this.right_turns += 1;
      }
    } else if (this.facing === Directions.SOUTH) {
      if (tile === NE90) {
        this.facing = Directions.EAST;
        this.left_turns += 1;
      } else if (tile === NW90) {
        this.facing = Directions.WEST;
        this.right_turns += 1;
      }
    } else if (this.facing === Directions.EAST) {
      if (tile === SW90) {
        this.facing = Directions.SOUTH;
        this.right_turns += 1;
      } else if (tile === NW90) {
        this.facing = Directions.NORTH;
        this.left_turns += 1;
      }
    } else if (this.facing === Directions.WEST) {
      if (tile === SE90) {
        this.facing = Directions.SOUTH;
        this.left_turns += 1;
      } else if (tile === NE90) {
        this.facing = Directions.NORTH;
        this.right_turns += 1;
      }
    }

    this.location = next_location;

    this.history.push(new State(this.location, this.facing, tile));
  }
}

function flood(cur: Location[], seen: Set<number>, grid: number[][], width: number, height: number) {
  const next = [];
  for (const cur_loc of cur) {
    const key = cur_loc.set_key(height);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    for (const neighbor of NEIGHBORS) {
      const loc = cur_loc.add(neighbor);
      if (loc.row >= 0 && loc.col >= 0 && loc.row < height && loc.col < width) {
        const tile = grid[loc.row][loc.col];
        if (tile !== MAIN_LOOP && !seen.has(loc.set_key(height))) {
          next.push(loc);
        }
      }
    }
  }

  if (next.length > 0) {
    flood(next, seen, grid, width, height);
  }
}

class Day10 {
  start: Location;
  width: number;
  height: number;
  grid: number[][];
  steps: number;
  num_inside: number;

  constructor(input: string) {
    this.grid = input
      .split("\n")
      .filter(item => item)
      .map(item => item.split("").map(i => TRANSLATE[i]));

    this.height = this.grid.length;
    this.width = this.grid[0].length;

    outer: for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col ++) {
        if (this.grid[row][col] === START) {
          this.start = new Location(row, col);
          break outer;
        }
      }
    }

    const seen = new Set<number>();
    let steps = 1;

    const actor = this.determine_starting_actor();
    this.grid[this.start.row][this.start.col] = MAIN_LOOP;
    this.grid[actor.location.row][actor.location.col] = MAIN_LOOP;

    while (!(actor.location.row === this.start.row && actor.location.col === this.start.col)) {
      steps += 1;
      actor.advance(this.grid);
      this.grid[actor.location.row][actor.location.col] = MAIN_LOOP;
    }

    // if we have more right turns than left turns, the tiles in the loop are to
    // our right, otherwise, they're to our left
    if (actor.right_turns > actor.left_turns) {
      for (const state of actor.history) {
        const locs = state.right_locs(seen, this.grid, this.width, this.height);

        if (locs.length > 0) {
          flood(locs, seen, this.grid, this.width, this.height);
        }
      }
    } else {
      for (const state of actor.history) {
        const locs = state.left_locs(seen, this.grid, this.width, this.height);

        if (locs.length > 0) {
          flood(locs, seen, this.grid, this.width, this.height);
        }
      }
    }

    this.steps = steps / 2;
    this.num_inside = seen.size;
  }

  determine_starting_actor(): Actor {
    // determine a position off of the starting location to move from
    const dirs = [Directions.NORTH, Directions.EAST, Directions.SOUTH, Directions.WEST]
    for (const dir of dirs) {
      const loc = this.start.add(NEIGHBORS[dir])
      if (loc.row >= 0 && loc.col >= 0 && loc.row < this.height && loc.col < this.width) {
        const tile = this.grid[loc.row][loc.col];
        if (tile === VERTICAL && (dir === Directions.NORTH || dir === Directions.SOUTH)) {
          return new Actor(loc, dir, tile);
        }

        if (tile === HORIZONAL && (dir === Directions.WEST || dir === Directions.EAST)) {
            return new Actor(loc, dir, tile);
        }

        if (tile === SW90 && dir === Directions.NORTH) {
          return new Actor(loc, Directions.WEST, tile);
        }

        if (tile === SE90 && dir === Directions.NORTH) {
          return new Actor(loc, Directions.EAST, tile);
        }

        if (tile === NW90 && dir === Directions.SOUTH) {
          return new Actor(loc, Directions.WEST, tile);
        }

        if (tile === NE90 && dir === Directions.SOUTH) {
          return new Actor(loc, Directions.EAST, tile);
        }

        if (tile === SW90 && dir === Directions.EAST) {
          return new Actor(loc, Directions.SOUTH, tile);
        }

        if (tile === NW90 && dir === Directions.EAST) {
          return new Actor(loc, Directions.NORTH, tile);
        }

        if (tile === SE90 && dir === Directions.WEST) {
          return new Actor(loc, Directions.SOUTH, tile);
        }

        if (tile === NE90 && dir === Directions.WEST) {
          return new Actor(loc, Directions.NORTH, tile);
        }
      }
    }
  }

  partOne(): number {
    return this.steps;
  }

  partTwo(): number {
    return this.num_inside;
  }
}

export { Day10 }
