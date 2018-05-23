# react-media-provider

>

[![NPM](https://img.shields.io/npm/v/react-mq-provider.svg)](https://www.npmjs.com/package/react-mq-provider) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-media-provider
```

or using yarn

```bash
yarn add react-media-provider 
```

## Usage

```js
import React from 'react';
import { render } from 'react-dom';

import { MediaQuery } from 'react-media-provider';

const QUERY_MAP = {
  small: '(max-width: 600px)',
  medium: '(min-width: 601px)',
  large: '(min-width: 978px)',
};

const App = () => (
  <MediaQuery queryMap={QUERY_MAP}>
    <div>
      You can use the Consumer wherever you want inside
      the component tree of the MediaQuery provider.
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

render(<App>, document.getElementById('app'));
```

## License

MIT © [Osmel Mora](https://github.com/osmelmora)
