import SetupState from './SetupState';
import CharacterSetupState from '@/state/CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';
import Observable from '@/state/Observable';
import FirebaseDataStore from '@/state/FirebaseDataStore';
import AlertBus from '@/views/AlertBus';

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
    }

    public get isAutoSaveToCloudOn(): boolean {
        return this.getState().autoSaveToCloud === true;
    }

    public set isAutoSaveToCloudOn(newValue: boolean) {
        const state = this.getState();
        state.autoSaveToCloud = newValue;
        this.setState(state);
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
        const stateJson = localStorage[this.localStorageKey];
        if (stateJson === undefined) {
            return new SetupState();
        }
        return JSON.parse(stateJson);
    }

    public saveDataToCloud(state: SetupState = this.getState()) {
        FirebaseDataStore.shared.authenticate().then(() => {
            FirebaseDataStore.shared.storeState(state, () => {
                AlertBus.alertMessage('state saved!!');
            }, (error) => {
                AlertBus.alertError('Error saving state: ' + error);
            });
        }).catch((error) => {
            AlertBus.alertError('login failure: ' + error);
        });
    }

    public pullDataFromCloud() {
        FirebaseDataStore.shared.authenticate().then(() => {
            FirebaseDataStore.shared.fetchState((state) => {
                AlertBus.alertMessage('State downloaded from cloud');
                this.setState(state);
            }, (error) => {
                AlertBus.alertError('Error saving state: ' + error);
            });
        }).catch((error) => {
            AlertBus.alertError('login failure: ' + error);
        });
    }


    public setState(value: SetupState) {
        this.observable.value = value;
        localStorage[this.localStorageKey] = JSON.stringify(value);
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
        const character = this.getState().gearOnHand.find((element) => element.name === name);
        if (character !== undefined) {
            return character;
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
