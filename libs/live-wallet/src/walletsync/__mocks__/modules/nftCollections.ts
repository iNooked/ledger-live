type LocalState = { hiddenNftCollections: Set<string>; whitelistedNftCollections: Set<string> };
type DistantState = { hiddenNftCollections: string[]; whitelistedNftCollections: string[] };

export const emptyState: LocalState = {
  hiddenNftCollections: new Set(),
  whitelistedNftCollections: new Set(),
};

export const genState = (index: number): LocalState => {
  const hiddenNftCollections = Array(index + 1)
    .fill(null)
    .map((_, i) => `fake-hiddenCollection${i}`);

  const whitelistedNftCollections = Array(index + 1)
    .fill(null)
    .map((_, i) => `fake-whitelistedCollection${i}`);

  return {
    hiddenNftCollections: new Set(hiddenNftCollections),
    whitelistedNftCollections: new Set(whitelistedNftCollections),
  };
};

// Converts a LocalState to a DistantState by transforming both hidden and whitelisted collections to arrays
export const convertLocalToDistantState = (localState: LocalState): DistantState => {
  return {
    hiddenNftCollections: [...localState.hiddenNftCollections],
    whitelistedNftCollections: [...localState.whitelistedNftCollections],
  };
};

// Converts a DistantState to a LocalState by transforming arrays into sets
export const convertDistantToLocalState = (distantState: DistantState): LocalState => {
  return {
    hiddenNftCollections: new Set(distantState.hiddenNftCollections),
    whitelistedNftCollections: new Set(distantState.whitelistedNftCollections),
  };
};

// Compares two LocalState objects for similarity by comparing both hiddenNftCollections and whitelistedNftCollections
export const similarLocalState = (a: LocalState, b: LocalState): boolean => {
  const hiddenEqual =
    [...a.hiddenNftCollections].join(" ") === [...b.hiddenNftCollections].join(" ");
  const whiteListedEqual =
    [...a.whitelistedNftCollections].join(" ") === [...b.whitelistedNftCollections].join(" ");

  return hiddenEqual && whiteListedEqual;
};
