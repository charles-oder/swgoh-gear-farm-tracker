import firebase from 'firebase/app';
import '@firebase/auth';
import '@firebase/database';
import SetupState from '@/state/SetupState';

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
    private credentials?: firebase.auth.UserCredential;

    private constructor() {
        this.app = firebase.initializeApp(firebaseConfig);
    }

    public authenticate(success: () => void, failure: (error: string) => void) {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/appstate');
        firebase.auth(this.app).signInWithPopup(provider).then((credentials) => {
            this.credentials = credentials;
            success();
        }).catch((error) => {
            failure(JSON.stringify(error));
        });
    }

    public storeState(state: SetupState, success: () => void, failure: (message: string) => void) {
        if (this.databaseRef === undefined) {
            failure('No database reference availalbe');
            return;
        }
        this.databaseRef.set(state).then(() => {
            success();
        }).catch((error) => {
            failure(JSON.stringify(error));
        });
    }

    public fetchState(success: (state: SetupState) => void, failure: (message: string) => void) {
        if (this.databaseRef === undefined) {
            failure('No database reference availalbe');
            return;
        }
        this.databaseRef.once('value').then((data) => {
            const json = JSON.stringify(data);
            const state = <SetupState> JSON.parse(json);
            success(state);
        }).catch((error) => {
            failure(JSON.stringify(error));
        });
    }
    private get databaseRef(): firebase.database.Reference | undefined {
        if (this.credentials === undefined
            || this.credentials.user === null) {
            return undefined;
        }
        const database = firebase.database(this.app);
        const path = 'swgoh-gear-farm/' + this.credentials.user.uid;
        return database.ref('swgoh-gear-farm/' + this.credentials.user.uid);
    }
}
