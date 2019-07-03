<template>
    <div class="character-list">
        <h1>Character List</h1>
        <div class="filter-controls">
                <input name="focus"
                              class="search-box"
                              v-model="nameFilter"
                              type="text"
                              placeholder="Search by Name" />
                <button class="close-icon" type="reset" @click="clearFilter()"></button>
                <select class="search-box" v-model="categoryFilter">
                    <option selected>All</option>
                    <option v-for="category in categories()" :key="category">{{category}}</option>
                </select>
                <div>
                    <label>
                        Hide Unselected
                        <input v-model="hideUnselected" type="checkbox"/>
                    </label>
                </div>
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
import AppLog from '@/AppLog';

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
    private categoryFilter: string = 'All';

    // noinspection JSUnusedGlobalSymbols Lifecycle Method
    public mounted() {
        this.hideUnselected = this.stateManager.hideUnselected;
        this.$ga.page('CharacterListView');
    }

    public clearFilter() {
        this.nameFilter = '';
    }

    public categories(): string[] {
        return this.characterList.allCategories();
    }

    @Watch('hideUnselected')
    public hideUnselectedChanged(newValue: boolean, oldValue: boolean) {
        this.stateManager.hideUnselected = newValue;
    }

    // noinspection JSUnusedLocalSymbols Used in Template
    private characters(): string[] {
        const selectednames = this.stateManager.selectedCharacters.map((element) => element.name);
        return this.characterList.characters.filter((c) => {
            if (this.categoryFilter === 'All') {
                return true;
            }
            return c.categories.includes(this.categoryFilter);
        }).filter((c) => {
            return c.name.toLowerCase().includes(this.nameFilter.toLowerCase());
        }).filter((c) => {
            return this.hideUnselected ? selectednames.includes(c.name) : true;
        }).map((c) => c.name).sort();
    }
}
</script>

<style scoped lang="scss">

    ul {
        width: 90%;
        max-width: 20em;
        list-style: none;
        padding-left: 0;
        margin: auto;
    }

    h1 {
        color: #666;
    }

    .search-box,.close-icon {
        position: relative;
        padding: 5px;
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
        right: 15px;
        top: 0;
        bottom: 0;
        margin: auto;
        padding: 2px;
        text-align: center;
        color: #333;
        font-weight: normal;
        font-size: 12px;
        cursor: pointer;
    }
    .search-box:not(:valid) ~ .close-icon {
        display: none;
    }
    .filter-controls {
        padding: 10px;
    }
</style>
