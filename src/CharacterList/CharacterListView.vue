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
            <li><div>Selected</div><div>Name</div><div>Gear Level</div><div>Target Gear Level</div><div>Gear Equipped</div></li>
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
}
</script>
