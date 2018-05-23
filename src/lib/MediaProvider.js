import React from 'react';
import PropTypes from 'prop-types';
import shallowEqual from 'fbjs/lib/shallowEqual';
import createContext from 'create-react-context';
import { polyfill } from 'react-lifecycles-compat';

import { multiMatchMedia } from './multiMatchMedia';
import { Subscribe } from './Subscribe';

const MediaQueryContext = createContext({});

export class MediaProvider extends React.Component {
  static Consumer = MediaQueryContext.Consumer;

  static propTypes = {
    queryMap: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.node,
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (!shallowEqual(nextProps.queryMap, prevState.queryMap)) {
      return {
        source: multiMatchMedia(nextProps.queryMap),
        queryMap: nextProps.queryMap,
      };
    }
  };

  state = { queryMap: {} };

  render() {
    return (
      <Subscribe source={this.state.source}>
        {matches => (
          <MediaQueryContext.Provider value={matches}>
            {this.props.children}
          </MediaQueryContext.Provider>
        )}
      </Subscribe>
    );
  }
}

polyfill(MediaProvider);
