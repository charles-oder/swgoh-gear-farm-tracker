import Observable from '@/state/Observable';

describe('Observable', () => {
    it('invokes callback on observe', () => {
        const testObject = new Observable<string>('monkey');
        let value: string | undefined;
        testObject.observe((newValue, oldValue) => value = newValue);
        expect(value).toMatch('monkey');
    });
    it('invokes callback on change', () => {
        const testObject = new Observable<string>('monkey');
        let value: string | undefined;
        testObject.observe((newValue, oldValue) => value = newValue);
        testObject.value = 'banana';
        expect(value).toMatch('banana');
    });
    it('does not invoke callback after unobserve', () => {
        const testObject = new Observable<string>('monkey');
        let value: string | undefined;
        const id = testObject.observe((newValue, oldValue) => value = newValue);
        testObject.unobserve(id);
        testObject.value = 'banana';
        expect(value).toMatch('monkey');
    });
    it('invokes all observers on change', () => {
        const testObject = new Observable<string>('monkey');
        let value1: string | undefined;
        let value2: string | undefined;
        testObject.observe((newValue, oldValue) => value1 = newValue);
        testObject.observe((newValue, oldValue) => value2 = newValue);
        value1 = 'nothing';
        value2 = 'nothing';
        testObject.value = 'banana';
        expect(value1).toMatch('banana');
        expect(value1).toMatch('banana');
    });
});
