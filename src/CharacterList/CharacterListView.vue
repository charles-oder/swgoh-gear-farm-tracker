<template>
    <div class="character-list">
        <h1>Character List</h1>
        <div>
            <label>Filter: <input v-model="nameFilter" type="text"></label>
            <label>
                Hide Unselected
                <input v-model="hideUnselected" type="checkbox"/>
            </label>
        </div>
        <ul>
            <li v-for="character in characters()" :key="character">
                <CharacterSetupView :characterName="character"/>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import CharacterList from '@/CharacterList/CharacterList';
import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
import SetupStateManager from '@/state/SetupStateManager';

// noinspection JSUnusedGlobalSymbols export default Required by Vue
@Component({
    components: {
        CharacterSetupView,

    },
})
export default class CharacterListView extends Vue {

    private characterList = CharacterList.shared;
    private stateManager = SetupStateManager.shared;
    private hideUnselected: boolean = false;
    private nameFilter: string = '';

    // noinspection JSUnusedGlobalSymbols Lifecycle Method
    public mounted() {
        this.hideUnselected = this.stateManager.hideUnselected;
    }

    @Watch('hideUnselected')
    public hideUnselectedChanged(newValue: boolean, oldValue: boolean) {
        this.stateManager.hideUnselected = newValue;
    }

    // noinspection JSUnusedLocalSymbols Used in Template
    private characters(): string[] {
        if (this.hideUnselected) {
            return this.stateManager.selectedCharacters.map((element) => element.name).sort();
        }
        return this.characterList.characterNames.filter((e) => e.toLowerCase().includes(this.nameFilter.toLowerCase()));
    }
}
</script>

<style scoped lang="scss">

    ul {
        width: 20em;
        list-style: none;
        padding-left: 0;
        margin-left: 50%;
        transform: translateX(-50%);
    }

    h1 {
        color: #666;
    }

</style>
