import { Store, Reducer, Effects } from '../../src';
import { Subject } from 'rxjs/Subject';

interface Calculator {
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
    let initialState: Calculator
    let reducer: Reducer<Calculator, CalculatorActions>;
    let effects: Effects<Calculator, CalculatorActions>;
    let store: Store<Calculator, CalculatorActions>;
    let logger: Logger;

    beforeEach(() => {
        initialState = { currentNumber: 0 };
        reducer = new Reducer<Calculator, CalculatorActions>(
            function (state, action, payload) {
                if (this.is('add', action, payload)) {
                    return { ...state, currentNumber: state.currentNumber + payload };
                }
                return state;
            }
        );
        effects = new Effects(
            function () {
                this.ofType('add')
                    .subscribe(payload => logger.log(`added ${payload}`));
            }
        )
        store = new Store<Calculator, CalculatorActions>(initialState, reducer, effects);
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

    describe('effects', () => {
        it('should work', () => {
            const spy = spyOn(logger, 'log');
            store.dispatch('add', 3);
            store.dispatch('add', 2);
            expect(spy.calls.count()).toBe(2);
            expect(spy.calls.mostRecent().args[0]).toBe('added 2');
        });
    });
});