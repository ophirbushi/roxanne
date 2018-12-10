import { Store, Reducer, Effects } from '../../src';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

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
        store = new Store<Calculator, CalculatorActions>(initialState, reducer, [effects]);
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

        describe('ofType', () => {
            it('should emit matching actions', () => {
                let emitted = false;

                effects.ofType('reset')
                    .pipe(take(1))
                    .subscribe(() => emitted = true);

                store.dispatch('reset', null);
                expect(emitted).toBe(true);
            });

            it('should not emit non matching actions', () => {
                let emitted = false;

                effects.ofType('reset')
                    .pipe(take(1))
                    .subscribe(() => emitted = true);

                store.dispatch('add', 1);
                expect(emitted).toBe(false);
            });

            it(`should emit the action's payload`, () => {
                let emittedValue;

                effects.ofType('subtract')
                    .pipe(take(1))
                    .subscribe((value) => emittedValue = value);

                store.dispatch('subtract', 1);
                expect(emittedValue).toBe(1);
            });
        });
    });
});