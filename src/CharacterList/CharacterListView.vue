<template>
  <div class="character-list">
      <h1>Character List</h1>
      <div>
          <label>
              Hide Unselected
              <input v-model="hideUnselected" type="checkbox" />
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import CharacterList from '@/CharacterList/CharacterList';
import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
import SetupStateManager from '@/state/SetupStateManager';

@Component({
    components: {
        CharacterSetupView,

    },
})
export default class CharacterListView extends Vue {

    private characterList = new CharacterList();
    private stateManager = new SetupStateManager();
    private hideUnselected: boolean = false;

    private characters(): string[] {
        if (this.hideUnselected) {
            return this.stateManager.selectedCharacters.map((element) => element.name);
        }
        return this.characterList.characterNames;
    }

    public mounted() {
        this.hideUnselected = this.stateManager.hideUnselected;
    }

    @Watch('hideUnselected')
    public hideUnselectedChanged(newValue: boolean, oldValue: boolean) {
        this.stateManager.hideUnselected = newValue
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

</style>
