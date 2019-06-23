<template>
    <div class="character-list">
        <h1>Gear to Farm</h1>
        <ul>
            <li v-for="gearSlot in allNeededGear()" :key="gearSlot.name">
                <FarmListLineItem :name="gearSlot.name" :amount="gearSlot.amount" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
    import SetupStateManager from '../state/SetupStateManager';
    import CharacterList from '@/CharacterList/CharacterList';
    import {GearList} from '@/data/GearList';
    import {GearIngredient} from '@/data/GearIngredient';
    import CharacterSetupState from '../state/CharacterSetupState';
    import GearOnHandState from "../state/GearOnHandState";
    import FarmListLineItem from '@/gear-needed/FarmListLineItem.vue';

    @Component({
        components: {
            FarmListLineItem,
            CharacterSetupView,

        },
    })
    export default class FarmListView extends Vue {

        private stateManager = new SetupStateManager();
        private characterList = new CharacterList();
        private gearList = new GearList();

        private get characters(): CharacterSetupState[] {
            return this.stateManager.selectedCharacters;
        }

        private getMissingGearSlots(character: CharacterSetupState): GearIngredient[] {
            const list: GearIngredient[] = [];

            for (let i = +character.currentGearLevel; i < +character.targetGearLevel; i++) {
                for (let j = 1; j <= 6; j++) {
                    if (i === +character.currentGearLevel && character['gearItem' + j]) {
                        continue;
                    }
                    const gearId = this.characterList.gearIdForCharacter(character.name, i, j);
                    const ingredients = this.gearList.ingredientsForGear(gearId);
                    ingredients.forEach((ingredient) => list.push(ingredient));
                }
            }
            return list;
        }

        private allNeededGear(): GearIngredient[] {
            const list: GearIngredient[] = [];
            this.characters.forEach((character) => list.push(... this.getMissingGearSlots(character)));
            return this.subtractGearOnHand(this.flattenGearIngredients(list), this.gearOnHand())
                .sort((a, b) => b.amount - a.amount);
        }

        private flattenGearIngredients(input: GearIngredient[]): GearIngredient[] {
            let list: GearIngredient[] = [];
            input.forEach((item) => {
                let existingEntry = list.find((element) => element.name === item.name)
                if (existingEntry === undefined) {
                    list.push(item)
                    return;
                }
                existingEntry.amount += item.amount;
                list = list.filter((element) => element.name !== item.name);
                list.push(existingEntry);
            });
            return list;
        }

        private subtractGearOnHand(neededGear: GearIngredient[], onHand: GearOnHandState[]) {
            let list: GearIngredient[] = [];
            neededGear.forEach((need) => {
                const name = need.name;
                let amount = need.amount;
                const have = onHand.find((element) => element.name === need.name)
                if (have !== undefined) {
                    amount -= have.amount;
                }
                let newItem = new GearIngredient(name, amount);
                if (amount > 0) {
                    list.push(newItem);
                }
            });
            return list;
        }

        private gearOnHand(): GearOnHandState[] {
            return this.stateManager.getAllGearOnHand();
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
