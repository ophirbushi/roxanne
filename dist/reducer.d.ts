export declare class Reducer<T, A> {
    reduce: (this: Reducer<T, A>, state: T, action: keyof A, payload: A[keyof A]) => T;
    constructor(reduce: (this: Reducer<T, A>, state: T, action: keyof A, payload: A[keyof A]) => T);
    is<K extends keyof A>(name: K, action: keyof A, payload?: A[keyof A]): payload is A[K];
}
