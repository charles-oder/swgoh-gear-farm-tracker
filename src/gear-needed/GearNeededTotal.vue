<template>
    <div class="character-list">
        <h1>Total Gear Needed</h1>
        <div class="list-container">
            <ul class="gear-list">
                <li v-for="gearSlot in allNeededGear()" :key="gearSlot.name">
                    <div class="amount">{{gearSlot.amount}}</div>
                    {{gearSlot.name}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
import SetupStateManager from '../state/SetupStateManager';
import CharacterList from '@/CharacterList/CharacterList';
import {GearList} from '@/data/GearList';
import {GearIngredient} from '@/data/GearIngredient';
import CharacterSetupState from '../state/CharacterSetupState';
import SetupStateObservingView from '@/components/SetupStateObservingView.vue';
import SetupState from '@/state/SetupState';

// noinspection JSUnusedGlobalSymbols export default Required by Vue
@Component({
    components: {
        CharacterSetupView,

    },
})
export default class GearNeededPerCharacterView extends SetupStateObservingView {

    private stateManager = SetupStateManager.shared;
    private characterList = CharacterList.shared;
    private gearList = GearList.shared;
    private characters: CharacterSetupState[] = [];

    protected stateDidChange(newValue?: SetupState, oldValue?: SetupState) {
        if (newValue === undefined) {
            this.characters = [];
            return;
        }
        this.characters = newValue.characters.filter((e) => e.isSelected);
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

    // noinspection JSUnusedLocalSymbols Template Data
    private allNeededGear(): GearIngredient[] {
        const list: GearIngredient[] = [];
        this.characters.forEach((c) => list.push(...this.getMissingGearSlots(c)));
        return this.flattenGearIngredients(list);
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
        return list.sort((a, b) => b.amount - a.amount);
    }
}
</script>

<style scoped lang="scss">

    ul {
        list-style: none;
        padding-left: 0;
    }

    h1 {
        color: #666;
    }

    .character-list {
        width: 100%;
    }

    .list-container {
        text-align: left;
        width: 30em;
        margin-left: 50%;
        transform: translateX(-50%);
    }

    .gear-list li {
        padding: 0.2em;
    }

    .amount {
        font-weight: bold;
        display: inline-block;
        text-align: right;
        width: 2em;
        margin-right: 1em;
    }

    .character-pane {
        padding: 0 1em;
        margin-bottom: 2em;
    }
</style>
