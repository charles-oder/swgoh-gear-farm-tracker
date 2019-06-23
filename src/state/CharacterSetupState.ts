export default class CharacterSetupState {

    public name: string;
    public isSelected: boolean = false;
    public currentGearLevel: number = 1;
    public targetGearLevel: number = 1;
    public gearItems: boolean[] = [false, false, false, false, false, false];

    constructor(name: string) {
        this.name = name;
    }

}
