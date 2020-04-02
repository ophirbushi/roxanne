import { Store, generatePayloadTypeChecker, ReducerFn, retypeStore } from '../src';

interface Item {
    name: string;
    price: number;
}

interface AppState {
    isLoading: boolean;
    items: Item[];
}

interface AppActions {
    setLoading: boolean;
    setItems: Item[];
    addItem: Item;
    reset: null;
}

const appInitialState: AppState = { isLoading: false, items: [] };

const actionIs = generatePayloadTypeChecker<AppActions>();

const appReducer: ReducerFn<AppState, AppActions> = (state, action, payload) => {
    if (actionIs('setLoading', action, payload)) {
        return { ...state, isLoading: payload };
    }
    if (actionIs('setItems', action, payload)) {
        return { ...state, items: payload };
    }
    if (actionIs('addItem', action, payload)) {
        return { ...state, items: [...state.items, payload] };
    }
    if (actionIs('reset', action)) {
        return appInitialState;
    }
    return state;
};

const store = new Store<AppState, AppActions>(appInitialState, appReducer);

store.subscribe(console.log);

store.dispatch('addItem', { name: 'item1', price: 1 });

interface Cart {
    items: Item[];
}

interface CartActions {
    setCartItems: Item[];
}

setTimeout(() => {
    let actionIs = generatePayloadTypeChecker<AppActions & CartActions>();

    const cartReducer: ReducerFn<AppState & { cart: Cart }, AppActions & CartActions> = (state, action, payload) => {
        if (actionIs('setCartItems', action, payload)) {
            return { ...state, cart: { items: payload } };
        }
        return state;
    };

    store.mount('cart', { items: [] } as Cart, cartReducer);
}, 1000);


const typedStore = retypeStore<AppState & { cart: Cart }, AppActions & CartActions>(store);
typedStore.dispatch('setCartItems', [{ name: 'cartItem1', price: 2 }]);


