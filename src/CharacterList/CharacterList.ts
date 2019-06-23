import data from '@/assets/swgoh-character-list.json';

const characterData: ICharacterData = data as ICharacterData;

export default class CharacterList {

    public get data(): any {
        return data;
    }

    public characterNames: string[];
    public characters: ICharacter[];

    constructor() {
        this.characters = characterData.data
            .sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        this.characterNames = characterData.data.map((element) => element.name);
    }
}

interface ICharacterData {
    data: ICharacter[];
}

interface ICharacter {
    name: string;
}
