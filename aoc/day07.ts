const JOKER = 'K';

const CARD_MAP = {
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'E',
    6: 'F',
    7: 'G',
    8: 'H',
    9: 'I',
    T: 'J',
    J: 'K',
    Q: 'L',
    K: 'M',
    A: 'N',
};

const HIGH_CARD = 0;
const ONE_PAIR = 1;
const TWO_PAIR = 2;
const THREE_KIND = 3;
const FULL_HOUSE = 4;
const FOUR_KIND = 5;
const FIVE_KIND = 6;

function hand_kinds(cards: number[]): number[] {
  const counts = new Map();
  for (const c of cards) {
    if (!counts.has(c)) {
      counts.set(c, 0);
    }
    counts.set(c, 1 + counts.get(c));
  }

  const joker_count = counts.has(JOKER) ? counts.get(JOKER) : 0;
  const num = counts.size;

  if (num === 1) {
    return [FIVE_KIND, FIVE_KIND];
  }

  if (num === 5) {
    if (joker_count > 0) {
      return [HIGH_CARD, ONE_PAIR];
    }else {
      return [HIGH_CARD, HIGH_CARD];
    }
  }

  if (num === 2) {
    for (const [_, value] of counts) {
      if (value === 4 || value === 1) {
        if (joker_count > 0) {
          return [FOUR_KIND, FIVE_KIND];
        } else {
          return [FOUR_KIND, FOUR_KIND];
        }
      } else if (value === 2 || value === 3) {
        if (joker_count > 0) {
          return [FULL_HOUSE, FIVE_KIND];
        } else {
          return [FULL_HOUSE, FULL_HOUSE];
        }
      }
    }
  }

  let num_pairs = 0;
  for (const [_, value] of counts) {
    if (value === 3) {
      if (joker_count === 1 || joker_count === 3) {
        return [THREE_KIND, FOUR_KIND];
      } else {
        return [THREE_KIND, THREE_KIND];
      }
    }

    if (value === 2) {
      num_pairs += 1;
    }
  }

  if (num_pairs === 2) {
    switch(joker_count) {
      case 1:
        return [TWO_PAIR, FULL_HOUSE];
      case 2:
        return [TWO_PAIR, FOUR_KIND];
      default:
        return [TWO_PAIR, TWO_PAIR];
    }
  }

  if (joker_count > 0) {
    return [ONE_PAIR, THREE_KIND];
  } else {
    return [ONE_PAIR, ONE_PAIR];
  }
}

class Hand {
  kind: number;
  cards: number[];
  joker_kind: number;
  joker_cards: number[];
  bid: number;

  constructor(cards: number[], bid: number) {
    this.cards = cards;
    this.joker_cards = cards.map(card => card === JOKER ? 'A' : card);
    const kinds = hand_kinds(this.cards);
    this.kind = kinds[0];
    this.joker_kind = kinds[1];
    this.bid = bid;
  }

}

class Day07 {
  hands: Hand[];

  constructor(input: string) {
    this.hands = [];
    const lines = input.split("\n").filter(item => item);
    for (const line of lines) {
      const parts = line.split(" ");
      const cards = parts[0].split("").map(ch => CARD_MAP[ch]);
      const bid = parseInt(parts[1]);
      this.hands.push(new Hand(cards, bid));
    }
  }

  partOne(): number {
    this.hands.sort((a, b) => {
      if (a.kind < b.kind) {
        return -1;
      } else if (a.kind > b.kind) {
        return 1;
      }

      if (a.cards < b.cards) {
        return -1;
      } else if (a.cards > b.cards) {
        return 1;
      } else {
        return 0;
      }
    });

    let sum = 0;
    for (let i = 0; i < this.hands.length; i++) {
      sum += (i + 1) * this.hands[i].bid;
    }
    return sum;
  }

  partTwo(): number {
    this.hands.sort((a, b) => {
      if (a.joker_kind < b.joker_kind) {
        return -1;
      } else if (a.joker_kind > b.joker_kind) {
        return 1;
      }

      if (a.joker_cards < b.joker_cards) {
        return -1;
      } else if (a.joker_cards > b.joker_cards) {
        return 1;
      } else {
        return 0;
      }
    });

    let sum = 0;
    for (let i = 0; i < this.hands.length; i++) {
      sum += (i + 1) * this.hands[i].bid;
    }
    return sum;
  }
}

export { Day07 }
