import manager from "../../modules/nftCollections";
import { WalletSyncDataManagerResolutionContext } from "../../types";

const dummyContext: WalletSyncDataManagerResolutionContext = {
  getAccountBridge: () => {
    throw new Error("not required for this test");
  },
  bridgeCache: {
    hydrateCurrency: () => Promise.resolve(null),
    prepareCurrency: () => Promise.resolve(null),
  },
};

describe("Collections' WalletSyncDataManager", () => {
  it("schema validation", () => {
    expect(manager.schema.parse({})).toEqual({});
    expect(manager.schema.parse(["collection"])).toEqual(["collection"]);
    expect(() => manager.schema.parse([1])).toThrow();
  });

  it("should find no diff on empty state change", () => {
    const localData = {
      hiddenNftCollections: new Set<string>(),
      whitelistedNftCollections: new Set<string>(),
    };
    const latestState = null;
    const diff = manager.diffLocalToDistant(localData, latestState);
    expect(diff).toEqual({
      hasChanges: false,
      nextState: { hiddenNftCollections: [], whitelistedNftCollections: [] },
    });
  });

  it("should find no diff on same object", () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1"]),
      whitelistedNftCollections: new Set<string>(["whitelistedNftCollections1"]),
    };
    const latestState = {
      hiddenNftCollections: ["hiddenNftCollections1"],
      whitelistedNftCollections: ["whitelistedNftCollections1"],
    };
    const diff = manager.diffLocalToDistant(localData, latestState);
    expect(diff).toEqual({ hasChanges: false, nextState: latestState });
  });

  it("should find diff on added object", () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1", "hiddenNftCollections2"]),
      whitelistedNftCollections: new Set<string>(["whitelistedNftCollections1"]),
    };
    const latestState = {
      hiddenNftCollections: ["hiddenNftCollections1"],
      whitelistedNftCollections: ["whitelistedNftCollections1"],
    };
    const diff = manager.diffLocalToDistant(localData, latestState);
    expect(diff).toEqual({
      hasChanges: true,
      nextState: {
        hiddenNftCollections: ["hiddenNftCollections1", "hiddenNftCollections2"],
        whitelistedNftCollections: ["whitelistedNftCollections1"],
      },
    });
  });

  it("should find diff on removed object", () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1"]),
      whitelistedNftCollections: new Set<string>(["whitelistedNftCollections1"]),
    };
    const latestState = {
      hiddenNftCollections: ["hiddenNftCollections1", "hiddenNftCollections2"],
      whitelistedNftCollections: ["whitelistedNftCollections1", "whitelistedNftCollections2"],
    };
    const diff = manager.diffLocalToDistant(localData, latestState);
    expect(diff).toEqual({
      hasChanges: true,
      nextState: {
        hiddenNftCollections: ["hiddenNftCollections1"],
        whitelistedNftCollections: ["whitelistedNftCollections1"],
      },
    });
  });

  it("should resolve to no op if no changes", async () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1"]),
      whitelistedNftCollections: new Set<string>(["whitelistedNftCollections1"]),
    };
    const latestState = {
      hiddenNftCollections: ["hiddenNftCollections1"],
      whitelistedNftCollections: ["whitelistedNftCollections1"],
    };
    const incomingState = {
      hiddenNftCollections: ["hiddenNftCollections1"],
      whitelistedNftCollections: ["whitelistedNftCollections1"],
    };
    const diff = await manager.resolveIncrementalUpdate(
      dummyContext,
      localData,
      latestState,
      incomingState,
    );
    expect(diff).toEqual({
      hasChanges: false,
    });
  });

  it("should resolve to a new collection addition with the full state", async () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1"]),
      whitelistedNftCollections: new Set<string>(["whitelistedNftCollections1"]),
    };
    const latestState = {
      hiddenNftCollections: ["hiddenNftCollections1"],
      whitelistedNftCollections: ["whitelistedNftCollections1"],
    };
    const incomingState = {
      hiddenNftCollections: ["hiddenNftCollections1", "hiddenNftCollections3"],
      whitelistedNftCollections: ["whitelistedNftCollections1", "whitelistedNftCollections2"],
    };
    const diff = await manager.resolveIncrementalUpdate(
      dummyContext,
      localData,
      latestState,
      incomingState,
    );
    expect(diff).toEqual({
      hasChanges: true,
      update: {
        addedhiddenNftCollections: new Set(["hiddenNftCollections3"]),
        removedhiddenNftCollections: new Set(),
        addedwhitelistedNftCollections: new Set(["whitelistedNftCollections2"]),
        removedwhitelistedNftCollections: new Set(),
      },
    });
  });

  it("applies an addition", () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1"]),
      whitelistedNftCollections: new Set<string>(["whitelistedNftCollections1"]),
    };
    const update = {
      addedhiddenNftCollections: new Set(["hiddenNftCollections3"]),
      removedhiddenNftCollections: new Set<string>(),
      addedwhitelistedNftCollections: new Set(["whitelistedNftCollections2"]),
      removedwhitelistedNftCollections: new Set<string>(),
    };
    const next = manager.applyUpdate(localData, update);
    expect(next).toEqual({
      hiddenNftCollections: new Set(["hiddenNftCollections1", "hiddenNftCollections3"]),
      whitelistedNftCollections: new Set([
        "whitelistedNftCollections1",
        "whitelistedNftCollections2",
      ]),
    });
  });

  it("applies a removal", () => {
    const localData = {
      hiddenNftCollections: new Set<string>(["hiddenNftCollections1", "hiddenNftCollections3"]),
      whitelistedNftCollections: new Set<string>([
        "whitelistedNftCollections1",
        "whitelistedNftCollections2",
      ]),
    };
    const update = {
      addedhiddenNftCollections: new Set<string>(),
      removedhiddenNftCollections: new Set<string>(["hiddenNftCollections3"]),
      addedwhitelistedNftCollections: new Set<string>(),
      removedwhitelistedNftCollections: new Set<string>(["whitelistedNftCollections2"]),
    };

    const next = manager.applyUpdate(localData, update);
    expect(next).toEqual({
      hiddenNftCollections: new Set(["hiddenNftCollections1"]),
      whitelistedNftCollections: new Set(["whitelistedNftCollections1"]),
    });
  });
});
