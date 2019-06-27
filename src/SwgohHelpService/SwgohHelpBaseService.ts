import {AxiosRequestConfig, AxiosResponse} from 'axios';
import Axios from 'axios';

export default class SwgohHelpBaseService<T> {

    protected urlBase = 'https://api.swgoh.help';

    public post(): Promise<T> {
        return new Promise<T>((accept, reject) => {
            Axios.post(this.getUrl(), this.createBody(), this.createAxiosConfig())
                .then((response) => {
                    if (response.status < 200 || response.status > 299) {
                        reject(JSON.stringify(response.data));
                    } else {
                        accept(this.createResponse(response.data));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    protected createResponse(response: AxiosResponse): T {
        return response as unknown as T;
    }

    protected getUrl(): string {
        return this.urlBase;
    }

    protected createBody(): any {
        return {};
    }

    protected createAxiosConfig(): AxiosRequestConfig {
        return {};
    }

}
