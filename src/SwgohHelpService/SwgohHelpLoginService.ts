import SwgohHelpBaseService from '@/SwgohHelpService/SwgohHelpBaseService';

export default class SwgohHelpLoginService extends SwgohHelpBaseService<ISwgohLoginResponse> {

    public username: string = '';
    public password: string = '';

    protected getUrl(): string {
        return super.getUrl() + '/auth/signin';
    }

    protected createBody(): any {
        const params = new URLSearchParams();
        params.append('username', this.username);
        params.append('password', this.password);
        params.append('client_id', 'restful');
        params.append('client_secret', 'i-do-not-think-it-means-what-you-think-it-means');
        params.append('grant_type', 'password');
        return params;
    }

}

interface ISwgohLoginResponse {
    access_token: string
}
