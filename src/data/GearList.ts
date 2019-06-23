import data from '@/assets/swgoh-gear-list.json';
const gearData: IGearListData = data as IGearListData;

export class GearList {

    public gear: IGearEntry[];

    constructor() {
        this.gear = gearData.data;
    }

    public ingredientsForGear(id: string): GearIngredient[] {
        if (id === undefined) {
            return [];
        }
        const gearEntry = this.gear.find((element) => element.base_id === id);
        if (gearEntry === undefined) {
            return [];
        }
        return gearEntry.ingredients.map((element) => this.createGearIngredient(element));
    }

    public createGearIngredient(item: IIngredient): GearIngredient {
        const name = this.nameForId(item.gear);
        return new GearIngredient(name ? name : item.gear, item.amount);
    }

    public nameForId(id: string): string | undefined {
        if (id === undefined) {
            return undefined;
        }
        const gearEntry = this.gear.find((element) => element.base_id === id);
        if (gearEntry === undefined) {
            return undefined;
        }
        return gearEntry.name;
    }
}

export class GearIngredient {
    public name: string;
    public amount: number;

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }
}

interface IGearListData {
    data: IGearEntry[];
}

interface IGearEntry {
    base_id: string;
    name: string;
    ingredients: IIngredient[];
}

interface IIngredient {
    gear: string;
    amount: number;
}
