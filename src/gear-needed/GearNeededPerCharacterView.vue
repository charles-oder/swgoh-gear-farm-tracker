<template>
    <div class="character-list">
        <h1>Character List</h1>
        <div class="list-container">
            <ul>
                <li class="character-pane" v-for="character in characters" :key="character">
                    <h2>{{character}}</h2>
                    <ul class="gear-list">
                        <li v-for="gearSlot in flattenGearList(character)" :key="gearSlot.name">
                            <div class="amount">{{gearSlot.amount}}</div> {{gearSlot.name}}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
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
        width: 1.5em;
        margin-right: 1em;
    }

    .character-pane {
        padding: 0 1em;
        margin-bottom: 2em;
    }
</style>
