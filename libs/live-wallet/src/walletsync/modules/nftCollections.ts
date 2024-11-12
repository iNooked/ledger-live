import { WalletSyncDataManager } from "../types";
import { z } from "zod";

const nftDescriptorSchema = z.object({
  hiddenNftCollections: z.array(z.string()),
  whitelistedNftCollections: z.array(z.string()),
});

// schema of the distant data. IMPORTANT: Once the module is written, the schema must not change over time – if you still want to change the schema, only do it by adding optional fields and make sure that any module implementation (from v1) was keeping the unknown properties = the schema must be backward compatible.
const schema = nftDescriptorSchema;

function diffSet<T extends string>(a: Set<T>, b: Set<T>) {
  const added = new Set<T>();
  const removed = new Set<T>();
  for (const item of a) {
    if (!b.has(item)) {
      removed.add(item);
    }
  }
  for (const item of b) {
    if (!a.has(item)) {
      added.add(item);
    }
  }
  return { added, removed };
}

const manager: WalletSyncDataManager<
  {
    hiddenNftCollections: Set<string>;
    whitelistedNftCollections: Set<string>;
  },
  {
    addedhiddenNftCollections: Set<string>;
    removedhiddenNftCollections: Set<string>;
    addedwhitelistedNftCollections: Set<string>;
    removedwhitelistedNftCollections: Set<string>;
  },
  typeof schema
> = {
  schema,

  diffLocalToDistant(localData, latestState) {
    const getChanges = (currentSet: Set<string>, latestItems: string[] | undefined) => {
      const latestSet = new Set(latestItems || []);
      const { added, removed } = diffSet(currentSet, latestSet);
      const hasChanges = added.size > 0 || removed.size > 0;
      return { hasChanges, added, removed };
    };

    const { hiddenNftCollections, whitelistedNftCollections } = localData;
    const hiddenChanges = getChanges(hiddenNftCollections, latestState?.hiddenNftCollections);
    const whiteListedChanges = getChanges(
      whitelistedNftCollections,
      latestState?.whitelistedNftCollections,
    );

    const hasAnyChanges = hiddenChanges.hasChanges || whiteListedChanges.hasChanges;

    const nextState = hasAnyChanges
      ? {
          hiddenNftCollections: [...hiddenNftCollections],
          whitelistedNftCollections: [...whitelistedNftCollections],
        }
      : {
          hiddenNftCollections: [...(latestState?.hiddenNftCollections || [])],
          whitelistedNftCollections: [...(latestState?.whitelistedNftCollections || [])],
        };

    return {
      hasChanges: hasAnyChanges,
      nextState,
    };
  },

  async resolveIncrementalUpdate(_ctx, _localData, latestState, incomingState) {
    // if incoming state is null, it means the data is no longer available
    if (!incomingState) {
      return { hasChanges: false };
    }

    // this module don't need to manage any "local increment update" so we must bail out from doing anything during localIncrementalUpdate() step
    if (latestState === incomingState) {
      return { hasChanges: false };
    }

    const diffHidden = diffSet(
      new Set(latestState?.hiddenNftCollections || []),
      new Set(incomingState.hiddenNftCollections),
    );

    const diffWhiteList = diffSet(
      new Set(latestState?.whitelistedNftCollections || []),
      new Set(incomingState.whitelistedNftCollections),
    );
    const hasChanges = diffWhiteList.added.size > 0 || diffWhiteList.removed.size > 0;
    const hasChangesHidden = diffHidden.added.size > 0 || diffHidden.removed.size > 0;

    if (!hasChanges && !hasChangesHidden) {
      return { hasChanges: false };
    }

    const update = {
      addedhiddenNftCollections: diffHidden.added,
      removedhiddenNftCollections: diffHidden.removed,
      addedwhitelistedNftCollections: diffWhiteList.added,
      removedwhitelistedNftCollections: diffWhiteList.removed,
    };
    return Promise.resolve({ hasChanges: true, update });
  },

  applyUpdate(localData, update) {
    const updateCollection = (
      collection: Set<string>,
      { added, removed }: { added: Set<string>; removed: Set<string> },
    ) => {
      for (const item of added) {
        collection.add(item);
      }
      for (const item of removed) {
        collection.delete(item);
      }
    };

    const data = {
      hiddenNftCollections: new Set(localData.hiddenNftCollections),
      whitelistedNftCollections: new Set(localData.whitelistedNftCollections),
    };

    updateCollection(data.hiddenNftCollections, {
      added: update.addedhiddenNftCollections,
      removed: update.removedhiddenNftCollections,
    });

    updateCollection(data.whitelistedNftCollections, {
      added: update.addedwhitelistedNftCollections,
      removed: update.removedwhitelistedNftCollections,
    });

    return data;
  },
};

export default manager;
