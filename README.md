# roxanne

roxanne is an implementation of the Redux pattern using rxjs.

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

This are the main objects used in the library: 

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

Actions is simply an interface whose keys are the action's type, and the value is the action's payload.

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

Effects is a class responsible for the executing the store's actions' side effects. The Effects has access to the store as a class member.

One creates a new Effects instance by calling its constructor, passing in as a parameter the registerEffects function, which as its name suggests registers the effects for the store, by simply subscribing to the store's actions$ observable.

The Effects class has a helper method ofType() which takes an action name as an argument, and returns and observable for that action. 

For example:

```ts
import { merge } from 'rxjs/observable/merge';

const calculatorEffects = new Effects<CalculatorState, CalculatorActions>(
    function () {
        this.ofType('add')
            .subscribe((payload) => {
                console.log(`add action dispatched with payload: ${payload}.`);
            });

        this.ofType('subtract')
            .subscribe((payload) => {
                  console.log(`subtract action dispatched with payload: ${payload}.`);
            });

        merge(this.ofType('add'), this.ofType('subtract'))
            .pipe(filter((payload) => payload === NaN)
            .subscribe((payload) => {
                console.log(`payload is NaN! Resetting calculator...`);
                this.store.dispatch('reset', null);
            });

        this.ofType('reset')
            .subscribe((payload) => {
                console.log(`reset action dispatched.`);
            });
    }
);
```

### Store

The store is a class that manages the app's state. It inherits from rxjs' BehaviorSubject class, which means one can subscribe to it to get notified when the state changes, or get a snapshot of the state by accessing its "value" property. 

The store has a dispatch() method which dispatches an action, and receives 2 arguments:

1. The action's name (string)
2. The action's payload

The Store has a select() method which returns an observable for parts of the state. 

The Store also has an actions$ observable which emits every time an action is dispatched an object in this format: ```{ action: string, payload: any }```.

Call the store's constructor in order to create a new store, passing in 2 or 3 arguments:

1. The store's initial state.
2. The store's reducer.
3. Effects (optional).

For example: 

```ts
import { calculatorInitialState } from './calculator.init';

const calculatorStore = new Store<CalculatorState, CalculatorActions>(calculatorInitialState, calculatorReducer, calculatorEffects);
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
