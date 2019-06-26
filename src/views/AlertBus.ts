
export default class AlertBus {


    public static get shared(): AlertBus {
        if (this.instance === undefined) {
            this.instance = new AlertBus();
        }
        return this.instance!;
    }

    public static alertMessage(message: string, link?: string, linkText?: string) {
        AlertBus.shared.alertMessage(message, link, linkText);
    }
    public static alertError(message: string, link?: string, linkText?: string)  {
        AlertBus.shared.alertError(message, link, linkText);
    }

    public static showDialog(message: string,
                             positiveTitle?: string,
                             positiveCallback?: () => void,
                             negativeTitle?: string,
                             negativeCallback?: () => void) {
        AlertBus.shared.showDialog(message, positiveTitle, positiveCallback, negativeTitle, negativeCallback);
    }

    private static instance?: AlertBus;

    public alertMessage: (message: string, link?: string, linkText?: string) => void = (() => {
        throw new Error('AlertView must be mounted first!');
    });
    public alertError: (message: string, link?: string, linkText?: string) => void = (() => {
        throw new Error('AlertView must be mounted first!');
    });

    public showDialog: (message: string,
                        positiveTitle?: string,
                        positiveCallback?: () => void,
                        negativeTitle?: string,
                        negativeCallback?: () => void) => void = (() => {
        throw new Error('ModalDialog must be mounted first!');
    });

    private constructor() {}

}
