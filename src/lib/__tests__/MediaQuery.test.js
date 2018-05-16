import React from 'react';
import { render } from 'react-testing-library';

import { MediaQuery } from '../MediaQuery';

jest.useFakeTimers();

const QUERY_MAP = {
  small: '(max-width: 600px)',
  medium: '(min-width: 601px)',
  large: '(min-width: 978px)',
};

const App = () => (
  <MediaQuery queryMap={QUERY_MAP}>
    <div>
      Some parent div for testing context reach!
      <MediaQuery.Consumer>
        {({ small, medium, large }) => (
          <React.Fragment>
            {small && <div>small: {QUERY_MAP.small}</div>}
            {medium && <div>medium: {QUERY_MAP.medium}</div>}
            {large && <div>large: {QUERY_MAP.large}</div>}
          </React.Fragment>
        )}
      </MediaQuery.Consumer>
    </div>
  </MediaQuery>
);

describe('MediaQuery', () => {
  const multiMatchMediaModule = require('../multiMatchMedia');
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(multiMatchMediaModule, 'multiMatchMedia');
    spy.mockImplementation(() => {
      const createMatchesWith = value =>
        ['small', 'medium', 'large'].reduce((result, key) => {
          result[key] = value;
          return result;
        }, {});
      const matches = createMatchesWith(true);

      return {
        matches,
        subscribe(cb) {
          setTimeout(() => {
            cb({ matches: createMatchesWith(false) }); // eslint-disable-line
          }, 1000);
        },
        unsubscribe: () => {},
      };
    });
  });

  afterEach(() => {
    spy.mockReset();
    spy.mockRestore();
  });

  it('renders as expected', () => {
    expect.assertions(6);

    const { queryByText } = render(<App />);

    for (const [key, query] of Object.entries(QUERY_MAP)) {
      expect(queryByText(`${key}: ${query}`)).not.toBeNull();
    }

    jest.runAllTimers();

    for (const [key, query] of Object.entries(QUERY_MAP)) {
      expect(queryByText(`${key}: ${query}`)).toBeNull();
    }
  });
});
