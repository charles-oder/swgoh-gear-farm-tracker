import data from '@/assets/swgoh-character-list.json';
import AlertBus from '@/views/AlertBus';

const characterData: ICharacterData = data as ICharacterData;

export default class CharacterList {

    private static instance?: CharacterList;

    public static get shared(): CharacterList {
        if (this.instance === undefined) {
            this.instance = new CharacterList();
        }
        return this.instance!;
    }

    public get data(): any {
        return data;
    }

    public characterNames: string[];
    public characters: ICharacter[];

    private constructor() {
        this.characters = characterData.data
            .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        this.characterNames = characterData.data.map((element) => element.name);
    }

    public gearIdForCharacter(name: string, level: number, slot: number): string | undefined {
        const character = this.characters.find((element) => element.name === name);
        if (character === undefined) {
            AlertBus.alertError('Character not found: ' + name);
            return undefined;
        }
        const gearLevel = character.gear_levels.find((element) => +element.tier === +level);
        if (gearLevel === undefined) {
            AlertBus.alertError('Gear Level not found: ' + level + '\n' + JSON.stringify(character.gear_levels));
            return undefined;
        }
        if (slot > gearLevel.gear.length || slot < 1) {
            AlertBus.alertError('Gear Slot not found: ' + slot);
            return undefined;
        }
        return gearLevel.gear[slot - 1];
    }
}

interface ICharacterData {
    data: ICharacter[];
}

interface ICharacter {
    name: string;
    gear_levels: IGearLevel[];
}

interface IGearLevel {
    tier: number;
    gear: string[];
}
