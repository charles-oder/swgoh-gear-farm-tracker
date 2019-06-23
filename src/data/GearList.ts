import data from '@/assets/swgoh-gear-list.json';
import locationData from '@/assets/swgoh-gear-locations.json';
import {GearIngredient} from '@/data/GearIngredient';

const gearData: IGearListData = data as IGearListData;
const gearLocations: IGearLocationData = locationData as IGearLocationData;

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

    public ingredientsForGearNamed(name: string): GearIngredient[] {
        if (name === undefined) {
            return [];
        }
        const gearEntry = this.gear.find((element) => element.name === name);
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
        const baseComponents = this.gear.filter((element) => element.ingredients.length === 0);
        const allNames = baseComponents.map((element) => element.name);
        const uniqueNames = new Set(allNames);
        return Array.from(uniqueNames).sort();
    }

    public getMinimumCostForGear(name: string): number {
        if (name === undefined) {
            return 0;
        }
        const gearEntry = gearLocations.gearList.find((element) => element.name === name);
        if (gearEntry === undefined || gearEntry.cheapestLocations.length < 1) {
            return 0;
        }
        const cheapestLocation = gearEntry.cheapestLocations[0];
        return cheapestLocation.cost;
    }

    public getCheapestLocationsForGear(name: string): string {
        if (name === undefined) {
            return 'None';
        }
        const gearEntry = gearLocations.gearList.find((element) => element.name === name);
        if (gearEntry === undefined) {
            return 'Raid Only';
        }
        let output = '';
        gearEntry.cheapestLocations.forEach((element) => {
            if (output.length > 0) {
                output += ', ';
            }
            output += element.name;
        });
        if (output === '') {
            return 'Raid Only';
        }
        return output;
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

interface IGearLocationData {
    gearList: IGearLocationEntry[];
}

interface IGearLocationEntry {
    name: string;
    locations: ILocation[];
    cheapestLocations: ILocation[];
}

interface ILocation {
    name: string;
    cost: number;
}
