<template>
    <div class="character-list">
        <h1>Total Gear Needed</h1>
        <ul>
            <li v-for="gearSlot in allNeededGear()" :key="gearSlot.name">{{gearSlot.amount}} {{gearSlot.name}}</li>
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

@Component({
    components: {
        CharacterSetupView,

    },
})
export default class GearNeededPerCharacterView extends Vue {

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
        return this.flattenGearIngredients(list);
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
        return list.sort((a, b) => b.amount - a.amount);
    }
}
</script>
