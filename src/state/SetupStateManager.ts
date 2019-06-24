import SetupState from './SetupState';
import CharacterSetupState from '@/state/CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';

export default class SetupStateManager {

    private localStorageKey = 'swgohGearFarmTrackerState';

    public getState(): SetupState {
        const stateJson = localStorage[this.localStorageKey];
        if (stateJson === undefined) {
            return new SetupState();
        }
        return JSON.parse(stateJson);
    }

    public setState(value: SetupState) {
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
