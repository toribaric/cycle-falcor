# Cycle.js Falcor Driver

A [Cycle.js](http://cycle.js.org) [Driver](http://cycle.js.org/drivers.html) for [Netflix Falcor](https://netflix.github.io/falcor/starter/what-is-falcor.html) data platform. The model uses HttpDataSource with fixed settings for now: model.json route with 60 seconds timeout.

```
npm install --save cycle-falcor
```

## Usage

A simple example of fetching and displaying data from ['items', 'latest'] path that gives a JSON graph response in the following format:

```json
{
    "json": {
        "items": {
            "__path": ["items"],
            "latest": {
                "__path": ["items", "latest"],
                "0": {
                    "name": "Item 1",
                    "description": "Description of item 1",
                    "price": 450,
                    "__path": ["item", "latest", 0]
                },
                "1": {
                    "name": "Item 2",
                    "description": "Description of item 2",
                    "price": 220,
                    "__path": ["item", "latest", 1]
                }
            }
        }
    }
}
```

```js
import Cycle from '@cycle/core';
import {Observable} from 'rx';
import {makeDOMDriver, div} from '@cycle/dom';
import {makeFalcorDriver} from 'cycle-falcor';

function getItems(res) {
    const items = res.json.items.latest;
    return Object.keys(items)
        .filter(key => key !== '$__path')
        .map(key => records[key]);
}

function main(sources) {
    const request$ = Observable.just({
         method: 'get',
         path: ['items', 'latest']
     });
     
     const state$ = sources.Falcor
        .mergeAll()
        .map(res => getItems(res));
        
     const vtree$ = state$.map(items => {
        return div('.items', [
            items.map(item => {
                return div('.row', [
                    div('.column', item.name),
                    div('.column', item.description),
                    div('.column', item.price)
                ])
            })
        ])
    });

    return {
        DOM: vtree$,
        Falcor: request$
    };
}

Cycle.run(main, {
    DOM: makeDOMDriver('#app'),
    Falcor: makeFalcorDriver()
});
```

More examples coming soon!