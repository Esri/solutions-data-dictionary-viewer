export declare type SimpleStringifyable = string | number | null | undefined;
export declare type Callback = () => void;
/**
 * This class helps batch updates to large lists.
 *
 * For example, if your React component has many children, updating them all at
 * once may cause jank when reconciling the DOM. This class helps you update
 * only a few children per frame.
 *
 * A typical usage would be:
 *
 * ```tsx
 * public renderChildren = (allChildrenKeys: string[]) => {
 *
 *     batcher.startNewBatch();
 *
 *     allChildrenKeys.forEach((prop1: string, index: number) => {
 *         batcher.addArgsToBatch(prop1, "prop2", index);
 *     });
 *
 *     batcher.removeOldAddNew((prop1: string, prop2: string, other: number) => {
 *         return <Child prop1={prop1} prop2={prop2} other={other} />;
 *     });
 *
 *     if (!batcher.isDone()) {
 *         batcher.idleCallback(this.forceUpdate());
 *     }
 *
 *     const currentChildren = batcher.getList();
 *     return currentChildren;
 * }
 *
 * ```
 */
export declare class Batcher<T> {
    static DEFAULT_ADD_LIMIT: number;
    static DEFAULT_UPDATE_LIMIT: number;
    static DEFAULT_REMOVE_LIMIT: number;
    static ARG_DELIMITER: string;
    private currentObjects;
    private oldObjects;
    private batchArgs;
    private done;
    private callback;
    /**
     * Resets the "batch" and "current" sets. This essentially clears the cache
     * and prevents accidental re-use of "current" objects.
     */
    reset(): void;
    /**
     * Starts a new "batch" argument set
     */
    startNewBatch(): void;
    /**
     * Stores the variadic arguments to be later batched together.
     *
     * The arguments must be simple stringifyable objects.
     */
    addArgsToBatch(...args: SimpleStringifyable[]): void;
    /**
     * Compares the set of "batch" arguments to the "current" set. Creates any
     * new objects using the callback as a factory. Removes old objects.
     *
     * Arguments that are in the "current" set but were not part of the last
     * "batch" set are considered candidates for removal. Similarly, Arguments
     * that are part of the "batch" set but not the "current" set are candidates
     * for addition.
     *
     * The number of objects added and removed may be limited with the
     * `...Limit` parameters.
     *
     * Finally, the batcher determines if the batching is complete if the
     * "current" arguments match the "batch" arguments.
     */
    removeOldAddNew(callback: (...args: any[]) => T, addNewLimit?: number, removeOldLimit?: number, updateLimit?: number): void;
    /**
     * Returns true of the "current" set matches the "batch" set.
     */
    isDone(): boolean;
    /**
     * Returns all the objects in the "current" set.
     */
    getList(): T[];
    /**
     * Registers a callback to be invoked on the next idle frame. If a callback
     * has already been registered, we do not register a new one.
     */
    idleCallback(callback: Callback): void;
    cancelOutstandingCallback(): void;
    /**
     * Forcibly overwrites the current list of batched objects. Not recommended
     * for normal usage.
     */
    setList(objectsArgs: SimpleStringifyable[][], objects: T[]): void;
    private getKey(args);
    private handleIdleCallback;
    private mapCurrentObjectKey;
    private setKeysDifference(a, b, limit);
    private setKeysIntersection(a, b, limit);
    /**
     * Compares the keys of A from B -- and performs an "intersection" or
     * "difference" operation on the keys.
     *
     * Note that the order of operands A and B matters for the "difference"
     * operation.
     *
     * Returns an array of at most `limit` keys.
     */
    private setKeysOperation(a, b, operation, limit);
    /**
     * Returns true of objects `a` and `b` have exactly the same keys.
     */
    private setHasSameKeys(a, b);
}
