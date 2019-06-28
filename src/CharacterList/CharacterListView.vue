<template>
    <div class="character-list">
        <h1>Character List</h1>
        <div>
            <form>
                <input name="focus"
                              class="search-box"
                              v-model="nameFilter"
                              type="text"
                              placeholder="Search by Name" />
                <button class="close-icon" type="reset" @click="clearFilter()"></button>
                <label>
                    Hide Unselected
                    <input v-model="hideUnselected" type="checkbox"/>
                </label>
            </form>
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

    public clearFilter() {
        this.nameFilter = '';
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

    .search-box,.close-icon {
        position: relative;
        padding: 10px;
    }
    .search-box {
        width: 200px;
        border: 1px solid #ccc;
        outline: 0;
        border-radius: 5px;
    }
    .search-box:focus {
        border: 1px solid #333;
    }
    .close-icon {
        border:1px solid transparent;
        background-color: transparent;
        display: inline-block;
        vertical-align: middle;
        outline: 0;
        cursor: pointer;
    }
    .close-icon:after {
        content: "X";
        display: block;
        width: 15px;
        height: 15px;
        position: absolute;
        z-index:1;
        right: 35px;
        top: 0;
        bottom: 0;
        margin: auto;
        padding: 2px;
        text-align: center;
        color: black;
        font-weight: normal;
        font-size: 12px;
        cursor: pointer;
    }
    .search-box:not(:valid) ~ .close-icon {
        display: none;
    }
</style>
