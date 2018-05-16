import { createSubscription } from 'create-subscription';
import { polyfill } from 'react-lifecycles-compat';

export const Subscribe = createSubscription({
  getCurrentValue(mql) {
    return mql.matches;
  },
  subscribe(mql, cb) {
    const onChange = event => cb(event.matches);

    mql.subscribe(onChange);

    return () => mql.unsubscribe(onChange);
  },
});

polyfill(Subscribe);
