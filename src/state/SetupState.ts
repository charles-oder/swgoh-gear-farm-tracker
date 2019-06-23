import CharacterSetupState from './CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';

export default class SetupState {
    public characters: CharacterSetupState[] = [];
    public gearOnHand: GearOnHandState[] = [];
}
