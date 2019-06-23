<template>
    <div class="character-list">
        <h1>Character List</h1>
        <ul>
            <li v-for="character in characters" :key="character">
                <h2>{{character}}</h2>
                <ul>
                    <li v-for="gearSlot in flattenGearList(character)" :key="gearSlot.name">{{gearSlot.amount}} {{gearSlot.name}}</li>
                </ul>
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

@Component({
    components: {
        CharacterSetupView,

    },
})
export default class GearNeededPerCharacterView extends Vue {

    private stateManager = new SetupStateManager();
    private characterList = new CharacterList();
    private gearList = new GearList();

    private get characters(): string[] {
        return this.stateManager.selectedCharacters.map((element) => element.name);
    }

    private getMissingGearSlots(characterName: string): GearIngredient[] {
        const character = this.stateManager.getStateForCharacter(characterName);
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

    private flattenGearList(characterName: string): GearIngredient[] {
        const baseList = this.getMissingGearSlots(characterName);
        let flattenedList: GearIngredient[] = [];
        baseList.forEach((element) => {
            let entry = flattenedList.find((item) => item.name === element.name);
            if (entry === undefined) {
                entry = element;
            } else {
                entry.amount += element.amount;
            }
            flattenedList = flattenedList.filter((item) => item.name !== element.name);
            flattenedList.push(entry);
        });
        return flattenedList.sort((a, b) => b.amount - a.amount);
    }

}
</script>