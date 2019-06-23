import SetupState from './SetupState';
import CharacterSetupState from '@/state/CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';

export default class SetupStateManager {

    private localStorageKey = 'swgohGearFarmTrackerState';

    private get state(): SetupState {
        const stateJson = localStorage[this.localStorageKey];
        if (stateJson === undefined) {
            return new SetupState();
        }
        return JSON.parse(stateJson);
    }

    private set state(value: SetupState) {
        localStorage[this.localStorageKey] = JSON.stringify(value);
    }

    public get selectedCharacters(): CharacterSetupState[] {
        return this.state.characters.filter((element) => element.isSelected);
    }

    public getStateForCharacter(name: string): CharacterSetupState {
        const character = this.state.characters.find((element) => element.name === name);
        if (character !== undefined) {
            return character;
        }
        return new CharacterSetupState(name);
    }

    public setStateForCharacter(character: CharacterSetupState) {
        const state = this.state;
        const characters = this.state.characters.filter((element) => element.name !== character.name);
        characters.push(character);
        state.characters = characters;
        this.state = state;
    }

    public getStateForGear(name: string): GearOnHandState {
        const character = this.state.gearOnHand.find((element) => element.name === name);
        if (character !== undefined) {
            return character;
        }
        return new GearOnHandState(name);
    }

    public setStateForGear(gear: GearOnHandState) {
        const state = this.state;
        const listings = this.state.gearOnHand.filter((element) => element.name !== gear.name);
        listings.push(gear);
        state.gearOnHand = listings;
        this.state = state;
    }

    public getAllGearOnHand(): GearOnHandState[] {
        return this.state.gearOnHand;
    }
}
