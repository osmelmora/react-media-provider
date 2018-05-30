import React from 'react';
import PropTypes from 'prop-types';
import shallowEqual from 'fbjs/lib/shallowEqual';
import createContext from 'create-react-context';
import { polyfill } from 'react-lifecycles-compat';

import { multiMatchMedia } from './multiMatchMedia';
import { Subscribe } from './Subscribe';

const MediaQueryContext = createContext({});

const BATCH_UPDATE_TIMEOUT = 150;

export class MediaProvider extends React.Component {
  static Consumer = MediaQueryContext.Consumer;

  static propTypes = {
    queryMap: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    batchUpdateTimeout: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
    children: PropTypes.node,
  };

  static defaultProps = {
    batchUpdateTimeout: BATCH_UPDATE_TIMEOUT,
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (
      !shallowEqual(nextProps.queryMap, prevState.queryMap) ||
      nextProps.batchUpdateTimeout !== prevState.batchUpdateTimeout
    ) {
      return {
        source: multiMatchMedia(
          nextProps.queryMap,
          nextProps.batchUpdateTimeout || prevState.batchUpdateTimeout
        ),
        queryMap: nextProps.queryMap,
        batchUpdateTimeout: nextProps.batchUpdateTimeout,
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
