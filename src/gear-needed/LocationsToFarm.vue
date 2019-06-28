<template>
    <div class="character-list">
        <h1>Locations to Farm</h1>
        <ul>
            <li v-for="location in locationsToDisplay()" :key="location">
                {{location}}
                <ul>
                    <li v-for="gearSlot in needListForLocation(location)" :key="gearSlot.name">
                        <FarmListLineItem :name="gearSlot.name" :amount="gearSlot.amount"/>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
    import CharacterList from '@/CharacterList/CharacterList';
    import {GearList} from '@/data/GearList';
    import {GearIngredient} from '@/data/GearIngredient';
    import CharacterSetupState from '../state/CharacterSetupState';
    import GearOnHandState from '../state/GearOnHandState';
    import FarmListLineItem from '@/gear-needed/GearToFarmLineItem.vue';
    import SetupState from '@/state/SetupState';
    import SetupStateObservingView from '@/components/SetupStateObservingView.vue';

    // noinspection JSUnusedGlobalSymbols export default Required by Vue
    @Component({
        components: {
            FarmListLineItem,
            CharacterSetupView,

        },
    })
    export default class LocationsToFarm extends SetupStateObservingView {

        private characterList = CharacterList.shared;
        private gearList = GearList.shared;
        private needList: GearIngredient[] = [];

        public displayNeedList(): GearIngredient[] {
            return this.needList;
        }

        public needListForLocation(location: string): GearIngredient[] {
            const map = new Map<string, GearIngredient[]>();
            this.displayNeedList().forEach((e) => {
                this.gearList.getLocationsForGear(e.name).forEach((item) => {
                    let current = map.get(item.name);
                    if (current === undefined) {
                        current = [];
                    }
                    current.push(e);
                    map.set(item.name, current);
                });
            });

            const result = map.get(location);
            if (result === undefined) {
                return [];
            }
            return result;
        }

        public locationsToDisplay(): string[] {
            const locations: Set<string> = new Set<string>();
            this.displayNeedList().forEach((e) =>
                this.gearList.getLocationsForGear(e.name).forEach((l) =>
                    locations.add(l.name)));
            return Array.from(locations).sort();
        }

        protected mounted() {
            this.$ga.page('LocationsToFarm');
        }

        protected stateDidChange(newValue?: SetupState, oldValue?: SetupState) {
            const state = newValue ? newValue : new SetupState();
            const selectedCharacters = state.characters.filter((element) => element.isSelected);
            this.needList = this.allNeededGear(state.gearOnHand, selectedCharacters);
        }

        private getMissingGearSlots(character: CharacterSetupState): GearIngredient[] {
            const list: GearIngredient[] = [];

            for (let i = +character.currentGearLevel; i < +character.targetGearLevel; i++) {
                for (let j = 1; j <= 6; j++) {
                    if (i === +character.currentGearLevel && character.gearItems[j - 1]) {
                        continue;
                    }
                    const gearId = this.characterList.gearIdForCharacter(character.name, i, j);
                    if (gearId === undefined) {
                        continue;
                    }
                    const ingredients = this.gearList.ingredientsForGear(gearId);
                    ingredients.forEach((ingredient) => list.push(ingredient));
                }
            }
            return list;
        }

        private allNeededGear(gearOnHand: GearOnHandState[], characters: CharacterSetupState[]): GearIngredient[] {
            const list: GearIngredient[] = [];
            characters.forEach((character) => list.push(...this.getMissingGearSlots(character)));
            return this.subtractGearOnHand(this.flattenGearIngredients(list), gearOnHand)
                .sort((a, b) => b.amount - a.amount);
        }

        private flattenGearIngredients(input: GearIngredient[]): GearIngredient[] {
            let list: GearIngredient[] = [];
            input.forEach((item) => {
                const existingEntry = list.find((element) => element.name === item.name);
                if (existingEntry === undefined) {
                    list.push(item);
                    return;
                }
                existingEntry.amount += item.amount;
                list = list.filter((element) => element.name !== item.name);
                list.push(existingEntry);
            });
            return list;
        }

        private subtractGearOnHand(neededGear: GearIngredient[], onHand: GearOnHandState[]) {
            const list: GearIngredient[] = [];
            neededGear.forEach((need) => {
                const name = need.name;
                let amount = need.amount;
                const have = onHand.find((element) => element.name === need.name);
                if (have !== undefined) {
                    amount -= have.amount;
                }
                const newItem = new GearIngredient(name, amount);
                if (amount > 0) {
                    list.push(newItem);
                }
            });
            return list;
        }

    }
</script>

<style scoped lang="scss">

    ul {
        list-style: none;
        padding-left: 0;
        width: 30em;
        margin-left: 50%;
        transform: translateX(-50%);
    }

    h1 {
        color: #666;
    }
</style>
