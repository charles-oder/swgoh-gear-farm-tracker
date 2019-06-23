import data from '@/assets/swgoh-gear-list.json';
import {GearIngredient} from '@/data/GearIngredient';

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

    public allGearNames(): string[] {
        const allNames = this.gear.map((element) => element.name);
        const uniqueNames = new Set(allNames);
        return Array.from(uniqueNames).sort();
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
