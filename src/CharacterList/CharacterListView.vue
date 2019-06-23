<template>
  <div class="character-list">
      <h1>Character List</h1>
      <ul>
            <li><div>Selected</div><div>Name</div><div>Gear Level</div><div>Target Gear Level</div><div>Gear Equipped</div></li>
            <li v-for="character in characters" :key="character">
                <CharacterSetupView :characterName="character"/>
            </li>
      </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import CharacterList from '@/CharacterList/CharacterList';
import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';

@Component({
    components: {
        CharacterSetupView,

    },
})
export default class CharacterListView extends Vue {

    private characters = new CharacterList().characterNames;

}
</script>
