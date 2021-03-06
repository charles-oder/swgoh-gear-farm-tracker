import data from '@/assets/swgoh-character-list.json';
import AppLog from '@/AppLog';

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

    private tag = 'CharacterList';

    private constructor() {
        this.characters = characterData.data
            .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        this.characterNames = characterData.data.map((element) => element.name);
    }

    public gearIdForCharacter(name: string, level: number, slot: number): string | undefined {
        const character = this.characters.find((element) => element.name === name);
        if (character === undefined) {
            AppLog.warn(this.tag, 'Character not found: ' + name);
            return undefined;
        }
        const gearLevel = character.gear_levels.find((element) => +element.tier === +level);
        if (gearLevel === undefined) {
            AppLog.warn(this.tag, 'Gear Level not found: ' + level + '\n' + JSON.stringify(character.gear_levels));
            return undefined;
        }
        if (slot > gearLevel.gear.length || slot < 1) {
            AppLog.warn(this.tag, 'Gear Slot not found: ' + slot);
            return undefined;
        }
        return gearLevel.gear[slot - 1];
    }

    public allCategories(): string[] {
        const result: Set<string> = new Set<string>();
        this.characters.forEach((c) => {
            c.categories.forEach((e) => {
                result.add(e);
            });
        });
        return Array.from(result);
    }
}

interface ICharacterData {
    data: ICharacter[];
}

interface ICharacter {
    name: string;
    gear_levels: IGearLevel[];
    categories: string[];
}

interface IGearLevel {
    tier: number;
    gear: string[];
}
