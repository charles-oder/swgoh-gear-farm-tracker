export default class CharacterSetupState {

    public name: string;
    public isSelected: boolean = false;
    public currentGearLevel: number = 1;
    public targetGearLevel: number = 1;
    public gearItem1: boolean = false;
    public gearItem2: boolean = false;
    public gearItem3: boolean = false;
    public gearItem4: boolean = false;
    public gearItem5: boolean = false;
    public gearItem6: boolean = false;

    constructor(name: string) {
        this.name = name;
    }
}
