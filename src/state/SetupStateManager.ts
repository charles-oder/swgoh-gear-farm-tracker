import SetupState from './SetupState';
import CharacterSetupState from '@/state/CharacterSetupState';

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
}
