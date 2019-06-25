import {Watch} from 'vue-property-decorator';
import Uuid from '@/utility/Uuid';

export default class Observable<T> {

    private internalValue?: T;
    private observers: Array<IObserver<T>> = [];

    constructor(initialValue: T | undefined) {
        this.internalValue = initialValue;
    }

    public get value(): T | undefined {
        return this.internalValue;
    }

    public set value(newValue: T | undefined) {
        const oldValue = this.internalValue;
        this.internalValue = newValue;
        this.valueDidChange(newValue, oldValue);
    }

    public observe(callback: (newValue: T | undefined, oldValue: T | undefined) => void): string {
        const id: string = Uuid.newGuid();
        const newObserver = { id, callback } as IObserver<T>;
        this.observers.push(newObserver);
        callback(this.value, this.value);
        return id;
    }

    public unobserve(id: string) {
        this.observers = this.observers.filter((element) => element.id !== id);
    }

    private valueDidChange(newValue: T | undefined, oldValue: T | undefined) {
        this.observers.forEach((observer) => observer.callback(newValue, oldValue));
    }
}

interface IObserver<T> {
    id: string;
    callback: (newValue: T | undefined, oldValue: T | undefined) => void;
}
