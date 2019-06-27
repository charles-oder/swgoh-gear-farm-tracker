import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/database';
import SetupState from '@/state/SetupState';
import {FirebaseStatePayload} from '@/state/FirebaseStatepayload';

const firebaseConfig = {
    apiKey: 'AIzaSyCns_MdaSzFXefQDlAb51HYiY8RCAiTk00',
    authDomain: 'swgoh-gear-farm.firebaseapp.com',
    databaseURL: 'https://swgoh-gear-farm.firebaseio.com',
    projectId: 'swgoh-gear-farm',
    storageBucket: '',
    messagingSenderId: '165128696116',
    appId: '1:165128696116:web:1e5de61c9549e111',
};

export default class FirebaseDataStore {

    private static instance?: FirebaseDataStore;

    public static get shared(): FirebaseDataStore {
        if (this.instance === undefined) {
            this.instance = new FirebaseDataStore();
        }
        return this.instance;
    }

    private app: firebase.app.App;
    private user?: firebase.User;

    private constructor() {
        this.app = firebase.initializeApp(firebaseConfig);
    }

    public authenticate(): Promise<void> {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/appstate');

        return new Promise<void>((accept, reject) => {
            firebase.auth(this.app).onAuthStateChanged((user) => {
                if (user === null) {
                    firebase.auth(this.app).setPersistence(firebase.auth.Auth.Persistence.SESSION)
                        .then(() => {
                            firebase.auth(this.app).signInWithPopup(provider).then((credentials) => {
                                if (credentials.user === null) {
                                    reject('No user data returned');
                                    return;
                                }
                                this.user = credentials.user;
                                accept();
                            }).catch((error) => {
                                reject(JSON.stringify(error));
                            });
                        })
                        .catch((error) => {
                            reject(JSON.stringify(error));
                        });
                } else {
                    this.user = user;
                    accept();
                }
            });
        });


    }

    public storeState(state: SetupState): Promise<void> {
        return new Promise<void>((accept, reject) => {
            if (this.databaseRef === undefined) {
                reject('No database reference availalbe');
                return;
            }
            const payload = new FirebaseStatePayload(JSON.stringify(state));
            this.databaseRef.set(payload).then(() => {
                accept();
            }).catch((error) => {
                reject(JSON.stringify(error));
            });
        });
    }

    public fetchState(): Promise<SetupState> {
        return new Promise<SetupState>((accept, reject) => {
            if (this.databaseRef === undefined) {
                reject('No database reference availalbe');
                return;
            }
            this.databaseRef.once('value').then((data) => {
                const json = JSON.stringify(data);
                const statePayload = JSON.parse(json) as FirebaseStatePayload;
                const state = JSON.parse(statePayload.stateJson) as SetupState;
                accept(state);
            }).catch((error) => {
                reject(JSON.stringify(error));
            });
        });
    }
    private get databaseRef(): firebase.database.Reference | undefined {
        if (this.user === undefined) {
            return undefined;
        }
        const database = firebase.database(this.app);
        const path = 'swgoh-gear-farm/' + this.user.uid;
        return database.ref('swgoh-gear-farm/' + this.user.uid);
    }
}
