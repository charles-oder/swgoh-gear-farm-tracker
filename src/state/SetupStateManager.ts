import SetupState from './SetupState';
import CharacterSetupState from '@/state/CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';
import Observable from '@/state/Observable';
import FirebaseDataStore from '@/state/FirebaseDataStore';
import AlertBus from '@/views/AlertBus';
import AppLog from '@/AppLog';

export default class SetupStateManager {

    private static instance?: SetupStateManager;

    public static get shared(): SetupStateManager {
        if (this.instance === undefined) {
            this.instance = new SetupStateManager();
        }
        return this.instance!;
    }

    private localStorageKey = 'swgohGearFarmTrackerState';
    private observable: Observable<SetupState> = new Observable<SetupState>(undefined);

    private constructor() {
        this.observable.value = this.pullValueFromStorage();
        if (this.isAutoSaveToCloudOn) {
            AppLog.log('AutoSave is on, pulling state from cloud');
            this.pullDataFromCloud();
        }
    }

    public get isAutoSaveToCloudOn(): boolean {
        return localStorage.autoSaveToCloud;
    }

    public set isAutoSaveToCloudOn(newValue: boolean) {
        localStorage.autoSaveToCloud = newValue;
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
        AppLog.log('Pulling state from local storage...');
        const stateJson = localStorage[this.localStorageKey];
        if (stateJson === undefined) {
            AppLog.log('No state found in local storage, creating new state.');
            return new SetupState();
        }
        return JSON.parse(stateJson);
    }

    public saveDataToCloud(state: SetupState = this.getState()) {
        this.saveDataToCloudAndWait(state).catch((error) => {
            AlertBus.alertError('Error saving state: ' + error);
        });
    }

    public saveDataToCloudAndWait(state: SetupState = this.getState()): Promise<void> {
        AppLog.log('saving state to cloud: ' + JSON.stringify(state));
        return new Promise<void>((accept, reject) => {
            FirebaseDataStore.shared.authenticate().then(() => {
                FirebaseDataStore.shared.storeState(state).then(() => {
                    accept();
                }).catch((error) => {
                    AppLog.error('Error saving state: ' + error);
                    reject('Error saving state: ' + error);
                });
            }).catch((error) => {
                AppLog.error('login failure: ' + error);
                reject('login failure: ' + error);
            });
        });
    }

    public pullDataFromCloud() {
        AppLog.log('pulling state from cloud...');
        FirebaseDataStore.shared.authenticate().then(() => {
            FirebaseDataStore.shared.fetchState().then((state) => {
                AppLog.log('State downloaded from cloud');
                AlertBus.alertMessage('State downloaded from cloud');
                this.setState(state);
            }).catch((error) => {
                AppLog.error('Error saving state: ' + error);
                AlertBus.alertError('Error saving state: ' + error);
            });
        }).catch((error) => {
            AppLog.error('login failure: ' + error);
            AlertBus.alertError('login failure: ' + error);
        });
    }


    public setState(value: SetupState) {
        AppLog.log('saving state: ' + JSON.stringify(value));
        this.observable.value = value;
        localStorage[this.localStorageKey] = JSON.stringify(value);
        if (this.isAutoSaveToCloudOn) {
            AppLog.log('AutoSave is on, saving to cloud');
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
            AppLog.error('Character name undefined');
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
            AppLog.error('Gear name undefined');
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
