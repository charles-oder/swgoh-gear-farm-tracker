import CharacterSetupState from '@/state/CharacterSetupState';
import SetupState from '@/state/SetupState';

export default class SetupStateHelper {

    private state: SetupState;

    public constructor(state: SetupState | undefined) {
        this.state = state ? state : new SetupState();
    }

    public getStateForCharacter(name: string | undefined): CharacterSetupState {
        if (name === undefined) {
            return new CharacterSetupState('');
        }
        const filtered = this.state.characters.filter((element) => element.name === name);
        if (filtered.length < 1) {
            return new CharacterSetupState(name);
        }
        return filtered[0];
    }

}
