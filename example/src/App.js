import React, { Component } from 'react';
import { MediaQuery } from 'react-media-provider';

export const MEDIA_QUERY_MAP = {
  xs: '(max-width: 376px)',
  sm: '(min-width: 377px) and (max-width: 768px)',
  md: '(min-width: 769px) and (max-width: 991px)',
  lg: '(min-width: 992px) and (max-width: 1169px)',
  xl: '(min-width: 1170px)',
};

export default class App extends Component {
  render() {
    return (
      <MediaQuery queryMap={MEDIA_QUERY_MAP}>
        <div>
          <h1>React Media Provider Demo</h1>
          <h2>Resize this window to see what happens!</h2>
          <MediaQuery.Consumer>
            {({ xs, sm, md, lg, xl }) => (
              <React.Fragment>
                {xs && <div>xs: {MEDIA_QUERY_MAP.xs}</div>}
                {sm && <div>sm: {MEDIA_QUERY_MAP.sm}</div>}
                {md && <div>md: {MEDIA_QUERY_MAP.md}</div>}
                {lg && <div>lg: {MEDIA_QUERY_MAP.lg}</div>}
                {xl && <div>xl: {MEDIA_QUERY_MAP.xl}</div>}
              </React.Fragment>
            )}
          </MediaQuery.Consumer>
        </div>
      </MediaQuery>
    );
  }
}
