import { Store, Reducer } from '../../src';
import { Subject } from 'rxjs';

interface CalculatorState {
    currentNumber: number;
}

interface CalculatorActions {
    add: number;
    subtract: number;
    reset: null;
}

class Logger {
    logged: Subject<string> = new Subject();

    log(x: string) {
        this.logged.next(x)
    }
}

describe('store', () => {
    let initialState: CalculatorState
    let reducer: Reducer<CalculatorState, CalculatorActions>;
    let store: Store<CalculatorState, CalculatorActions>;
    let logger: Logger;

    beforeEach(() => {
        initialState = { currentNumber: 0 };
        reducer = new Reducer<CalculatorState, CalculatorActions>(
            function (state, action, payload) {
                if (this.is('add', action, payload)) {
                    return { ...state, currentNumber: state.currentNumber + payload };
                }
                return state;
            }
        );
        store = new Store<CalculatorState, CalculatorActions>(initialState, reducer);
        logger = new Logger();
    });

    it('should not throw', () => {
        expect(store).toBeTruthy();
    });

    describe('reducer', () => {
        it('should work', () => {
            store.dispatch('add', 3);
            store.dispatch('add', 2);
            expect(store.value.currentNumber).toBe(5);
        });
    });
});