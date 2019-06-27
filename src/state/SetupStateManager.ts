import SetupState from './SetupState';
import CharacterSetupState from '@/state/CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';
import Observable from '@/state/Observable';
import FirebaseDataStore from '@/state/FirebaseDataStore';
import AlertBus from '@/views/AlertBus';
import AppLog from '@/AppLog';

export default class SetupStateManager {

    private static instance?: SetupStateManager;
    private tag = 'SetupStateManager';

    public static get shared(): SetupStateManager {
        if (this.instance === undefined) {
            this.instance = new SetupStateManager();
        }
        return this.instance!;
    }

    private localStorageKey = 'swgohGearFarmTrackerState';
    private observable: Observable<SetupState> = new Observable<SetupState>(undefined);
    private authenticating: boolean = false;

    private constructor() {
        this.observable.value = this.pullValueFromStorage();
        if (this.isAutoSaveToCloudOn) {
            AppLog.log(this.tag, 'AutoSave is on, pulling state from cloud');
            this.pullDataFromCloud();
        }
    }

    public get isAutoSaveToCloudOn(): boolean {
        return localStorage.autoSaveToCloud === 'true';
    }

    public set isAutoSaveToCloudOn(newValue: boolean) {
        localStorage.autoSaveToCloud = '' + newValue;
    }

    public getObservable(): Observable<SetupState> {
        return this.observable;
    }

    public getState(): SetupState {
        if (this.observable.value === undefined) {
            this.observable.value = this.pullValueFromStorage();
        }
        return this.observable.value!;
    }

    public pullValueFromStorage(): SetupState {
        AppLog.log(this.tag, 'Pulling state from local storage...');
        const stateJson = localStorage[this.localStorageKey];
        if (stateJson === undefined) {
            AppLog.log(this.tag, 'No state found in local storage, creating new state.');
            return new SetupState();
        }
        return JSON.parse(stateJson);
    }

    public saveDataToCloud(state: SetupState = this.getState()) {
        if (this.authenticating) {
            AppLog.log(this.tag, 'Already authenticating, waiting');
            return;
        }

        this.saveDataToCloudAndWait(state).catch((error) => {
            AlertBus.alertError('Error saving state: ' + error);
        });
    }

    public saveDataToCloudAndWait(state: SetupState = this.getState()): Promise<void> {
        AppLog.verbose(this.tag, 'saving state to cloud: ' + JSON.stringify(state));
        return new Promise<void>((accept, reject) => {
            this.authenticating = true;
            FirebaseDataStore.shared.authenticate().then(() => {
                this.authenticating = false;
                FirebaseDataStore.shared.storeState(state).then(() => {
                    AppLog.log(this.tag, 'Save successfully');
                    accept();
                }).catch((error) => {
                    AppLog.error(this.tag, 'Error saving state: ' + error);
                    reject('Error saving state: ' + error);
                });
            }).catch((error) => {
                AppLog.error(this.tag, 'login failure: ' + error);
                reject('login failure: ' + error);
            });
        });
    }

    public pullDataFromCloud() {
        if (this.authenticating) {
            AppLog.log(this.tag, 'Already authenticating, waiting');
            return;
        }
        this.pullDataFromCloudAndWait().catch((e) => {
            AlertBus.alertError('Error fetching state: ' + e);
        });
    }

    public pullDataFromCloudAndWait(): Promise<void> {
        AppLog.log(this.tag, 'pulling state from cloud...');
        return new Promise<void>((accept, reject) => {
            this.authenticating = true;
            FirebaseDataStore.shared.authenticate().then(() => {
                this.authenticating = false;
                FirebaseDataStore.shared.fetchState().then((state) => {
                    AppLog.log(this.tag, 'State downloaded from cloud');
                    this.setState(state);
                    accept();
                }).catch((error) => {
                    AppLog.error(this.tag, 'Error fetching state: ' + error);
                    reject('Error fetching state: ' + error);
                });
            }).catch((error) => {
                AppLog.error(this.tag, 'login failure: ' + error);
                reject('login failure: ' + error);
            });
        });
    }


    public setState(value: SetupState) {
        AppLog.verbose(this.tag, 'saving state: ' + JSON.stringify(value));
        this.observable.value = value;
        localStorage[this.localStorageKey] = JSON.stringify(value);
        if (this.isAutoSaveToCloudOn) {
            AppLog.log(this.tag, 'AutoSave is on, saving to cloud');
            this.saveDataToCloud(value);
        }
    }

    public get hideUnselected(): boolean {
        return this.getState().hideUnselected === true;
    }

    public set hideUnselected(newValue: boolean) {
        const oldState = this.getState();
        oldState.hideUnselected = newValue;
        this.setState(oldState);
    }

    public get selectedCharacters(): CharacterSetupState[] {
        return this.getState().characters.filter((element) => element.isSelected);
    }

    public getStateForCharacter(name: string): CharacterSetupState {
        const character = this.getState().characters.find((element) => element.name === name);
        if (character !== undefined) {
            return character;
        }
        return new CharacterSetupState(name);
    }

    public setStateForCharacter(character: CharacterSetupState) {
        const state = this.getState();
        const characters = this.getState().characters.filter((element) => element.name !== character.name);
        characters.push(character);
        state.characters = characters;
        this.setState(state);
    }

    public getStateForGear(name: string): GearOnHandState {
        const item = this.getState().gearOnHand.find((element) => element.name === name);
        if (item !== undefined) {
            AppLog.error(this.tag, 'Gear name undefined');
            return item;
        }
        return new GearOnHandState(name);
    }

    public setStateForGear(gear: GearOnHandState) {
        const state = this.getState();
        const listings = this.getState().gearOnHand.filter((element) => element.name !== gear.name);
        listings.push(gear);
        state.gearOnHand = listings;
        this.setState(state);
    }

    public getAllGearOnHand(): GearOnHandState[] {
        return this.getState().gearOnHand;
    }
}
