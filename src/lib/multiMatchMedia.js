const isEmpty = obj => Reflect.ownKeys(obj).length === 0;

export const multiMatchMedia = (mediaQueryMap, batchUpdateTimeout) => {
  let subscriber = null;
  let matches = {};

  let waitingForUpdate = false;
  let mediaQueryLists = {};
  let listenersMap = {};
  let temporalUpdateMap = {};

  // instanciating the media query list objects and populating matches
  for (const [key, query] of Object.entries(mediaQueryMap)) {
    mediaQueryLists[key] = window.matchMedia(query);
    matches[key] = mediaQueryLists[key].matches;
  }

  const update = () => {
    if (subscriber) {
      matches = { ...matches, ...temporalUpdateMap };
      temporalUpdateMap = {};
      waitingForUpdate = false;

      subscriber({ matches });
    }
  };

  const handleMatchMediaChange = (key, event) => {
    if (!waitingForUpdate && isEmpty(temporalUpdateMap)) {
      waitingForUpdate = true;

      setTimeout(update, batchUpdateTimeout);
    }

    temporalUpdateMap[key] = event.matches;
  };

  return {
    matches,
    subscribe(callback) {
      // only one subscriber function is permitted
      if (subscriber) {
        this.unsubscribe(subscriber);
      }

      subscriber = callback;

      for (const [key, mql] of Object.entries(mediaQueryLists)) {
        const updateMatches = handleMatchMediaChange.bind(null, key);
        mql.addListener(updateMatches);
        listenersMap[key] = updateMatches;
      }
    },
    unsubscribe(callback) {
      if (subscriber === callback) {
        subscriber = null;

        // clean up if in a middle of an update
        if (waitingForUpdate) {
          clearTimeout(update);
          waitingForUpdate = false;
          temporalUpdateMap = {};
        }

        for (const [key, mql] of Object.entries(mediaQueryLists)) {
          mql.removeListener(listenersMap[key]);
        }

        listenersMap = {};
      }
    },
  };
};
