# roxanne

roxanne is a simple implementation of the Redux pattern using rxjs, meant to reduce the overall boilerplate which generally comes with it.

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

These are the main objects used in the library: 

* State
* Actions
* Reducer
* Effects
* Store

### State 

A state is simply an interface representing your store's immutable state.

For example: 

```ts
export interface Calculator {
    currentNumberOnScreen: number;
}
```

### Actions

Actions is simply an interface whose keys are the action's type, and their value is the action's payload.

For example:

```ts
export interface CalculatorActions {
    add: number;
    subtract: number;
    reset: null;
}
```

### Reducer

A reducer is a class with a reduce() method. 

One creates a new reducer by calling its constructor, passing in as a parameter the reduce function which receives 3 arguments: 

1. state - The current state
2. action - The action's name (string)  
3. payload - The action's payload

and should return the new state.

The reducer also has a helper method is(), which helps determine the action type and for the typescript compiler to know the correct payload type for the action. The is() method receives 2 or 3 arguments:

1. The action name to check if the action matches that name (string).
2. The current action name (string).
3. The action's payload (Optional. By passing the payload to the is() method the compiler understands the payload's type).

For example:

```ts
import { calculatorInitialState } from './calculator.init';

const calculatorReducer = new Reducer<CalculatorState, CalculatorActions>(
    function (state, action, payload) {
        if (this.is('add', action, payload)) {
            return { ...state, currentNumberOnScreen: state.currentNumberOnScreen + payload };
        }
        if (this.is('subtract', action, payload)) {
            return { ...state, currentNumberOnScreen: state.currentNumberOnScreen - payload };
        }
        if (this.is('reset', action)) {
            return calculatorInitialState;
        }
        return state;
    }
);
```

Note that the function passed to the reducer's constructor is not a lambda function (arrow function), but a regular function, this in order for the "this" context of the reducer to acknowledge its "is()" helper method.

### Effects

Effects is simply a function that receives the store as a parameter, and does something with it, usually subscribing to the store.actionOfType() method, but not necessarily. 

For example:

```ts
import { Store } from 'roxanne';
import { filter } from 'rxjs/operators';
import { CalculatorState, CalculatorActions } from './state';

export const calculatorEffects = (store: Store<CalculatorState, CalculatorActions>) => {

    store.actionOfType('add')
        .subscribe(amount => console.log(`${amount} amount was added.`)); 
        
    store.actionOfType('subtract')
        .pipe(
            filter(amount => amount > 10000000)
        )
        .subscribe(() => {
            console.log(`User subtracted too much, can't handle this. Resetting the calculator...`);
            store.dispatch('reset', null);
        });
};
```

### Store

The store is a class that manages the app's state. It inherits from rxjs' BehaviorSubject class, which means one can subscribe to it to get notified when the state changes, or get a snapshot of the state by accessing its "value" property. 

The store has a dispatch() method which dispatches an action, and receives 2 arguments:

1. The action's name (string)
2. The action's payload

The Store has a select() method which returns an observable for parts of the state. 

The Store has an actions$ observable which emits every time an action is dispatched an object in this format: ```{ action: string, payload: any }```.

The Store also has a convenient actionOfType() method which lets you filter specific actions easily.

Call the store's constructor in order to create a new store, passing in 2 or 3 arguments:

1. The store's initial state.
2. The store's reducer.
3. Effects (optional).

For example: 

```ts
import { calculatorInitialState } from './calculator.init';

const calculatorStore = new Store<CalculatorState, CalculatorActions>(calculatorInitialState, calculatorReducer, [calculatorEffects]);
```

And using it:

```ts
const currentNumberOnScreen$ = calculatorStore.select('currentNumberOnScreen');

document
    .querySelector('#addBtn')
    .addEventListener('click', () => { 
        calculatorStore.dispatch('add', +document.querySelector('#input').value);
});

// etc.
```
