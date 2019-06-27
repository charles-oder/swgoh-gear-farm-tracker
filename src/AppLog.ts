
export default class AppLog {

    public static log(message: string) {
        console.log(this.getCaller() + ': ' + message);
    }

    public static warn(message: string) {
        console.warn(this.getCaller() + ': ' + message);
    }

    public static error(message: string) {
        console.error(this.getCaller() + ': ' + message);
    }

    private static getCaller(error: Error = new Error()): string {
        const stack = error.stack;
        if (stack === undefined) {
            return 'undefined';
        }
        const lines = stack.split('\n');
        if (lines.length < 4) {
            return 'undefined';
        }
        const caller = lines[3];
        return caller.split(' (')[0].replace('at ', '');
    }
}
