

export default class AppLog {

    public static logLevel: number = 2;

    public static verbose(tag: string, message: string) {
        if (this.logLevel > 2) {
            console.log(tag + ': ' + message);
        }
    }

    public static log(tag: string, message: string) {
        if (this.logLevel > 1) {
            console.log(tag + ': ' + message);
        }
    }

    public static warn(tag: string, message: string) {
        if (this.logLevel > 0) {
            console.warn(tag + ': ' + message);
        }
    }

    public static error(tag: string, message: string) {
        console.error(tag + ': ' + message);
    }

}
