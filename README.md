# roxanne

roxanne is a simple implementation of the Redux pattern using rxjs while taking advantage of the abilities of typescript. It can be used across any platform, and can be used also in node js apps.

[![npm version](https://badge.fury.io/js/roxanne.svg)](https://badge.fury.io/js/roxanne)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ophirbushi/roxanne/issues)

## License

MIT License

## Installation

roxanne has a peer dependency of rxjs so you will need to install both.

```sh
npm install roxanne rxjs
```

## Usage

[Demo (angular)](https://stackblitz.com/edit/angular-d9e5bq?file=src%2Fapp%2Fapp.module.ts)

Let's quickly go over the main concepts: 

* State
* Actions
* Reducer
* Store

### State 

State is an interface representing your store's state.

For example: 

```ts
export interface AppState {
    loading: boolean;
    user: User;
    products: Product[];
}
```

### Actions

Actions is an interface whose keys are the action's type, and their value is the action's payload.

For example:

```ts
export interface AppActions {
    setLoading: boolean;
    setUser: User;
    setProducts: Product[];
}
```

### Reducer

A reducer is a function which receives 3 arguments:

1. state - The current state
2. action - The action's name (string)  
3. payload - The action's payload
 
and returns the new state.

You may import and use the "Reducer" typescript type, as shown in the example below, in order to use generics, but you don't have to.

For example:

```ts
import { Reducer } from 'roxanne';

const appReducer: Reducer<AppState, AppActions> = (state, action, payload) => {
       switch (action) {
            case 'setLoading':
                return { ...state, loading: payload };
            case 'setUser':
                return { ...state, user: payload };
            default:    
                return state;
        }
    }
);
```

### Store

The store is the class that manages the app's state. It extends the rxjs' BehaviorSubject class.

Example:

```ts
import { Store } from 'roxanne';
import { AppState } from './app.state';
import { AppActions } from './app.actions';
import { appReducer } from './app.reducer';
import { appInitialState } from './app.init';

const store = new Store<AppState, AppActions>(appInitialState, appReducer);
```
