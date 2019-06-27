'use strict';
import CharacterSetupState from './CharacterSetupState';
import GearOnHandState from '@/state/GearOnHandState';
import AlertBus from '@/views/AlertBus';

export default class SetupState {
    public characters: CharacterSetupState[] = [];
    public gearOnHand: GearOnHandState[] = [];
    public hideUnselected?: boolean;
    public autoSaveToCloud?: boolean;

}
