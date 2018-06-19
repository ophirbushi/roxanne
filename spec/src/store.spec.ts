import { take } from 'rxjs/operators';
import { Store, Reducer } from '../../src';

interface Calculator {
    currentNumber: number;
}

interface CalculatorActions {
    add: number;
    subtract: number;
    reset: null;
}

describe('store', () => {
    let initialState: Calculator
    let reducer: Reducer<Calculator, CalculatorActions>;
    let store: Store<Calculator, CalculatorActions>;

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
        store = new Store<Calculator, CalculatorActions>(initialState, reducer);
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

    describe('store', () => {
        describe('actionOfType', () => {
            it('should emit matching actions', () => {
                let emitted = false;

                store.actionOfType('reset')
                    .pipe(take(1))
                    .subscribe(() => emitted = true);

                store.dispatch('reset', null);
                expect(emitted).toBe(true);
            });

            it('should not emit non matching actions', () => {
                let emitted = false;

                store.actionOfType('reset')
                    .pipe(take(1))
                    .subscribe(() => emitted = true);

                store.dispatch('add', 1);
                expect(emitted).toBe(false);
            });

            it(`should emit the action's payload`, () => {
                let emittedValue;

                store.actionOfType('subtract')
                    .pipe(take(1))
                    .subscribe((value) => emittedValue = value);

                store.dispatch('subtract', 1);
                expect(emittedValue).toBe(1);
            });
        });
    });
});