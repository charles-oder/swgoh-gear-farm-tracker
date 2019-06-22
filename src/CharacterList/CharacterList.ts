import data from '../assets/swgoh-character-list.json'

let characterData: ICharacterData = <ICharacterData> data;

export default class CharacterList {

    constructor() {
        this.characters = characterData.data
            .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        this.characterNames = characterData.data.map(element => element.name);
    }

    public characterNames: Array<String>;
    public characters: Array<ICharacter>;

    public get data(): any {
        return data;
    }
}

interface ICharacterData {
    data: Array<ICharacter>
}

interface ICharacter {
    name: String
}