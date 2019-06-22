<template>
  <div class="character-list">
      Character List
      <ul>
          <li v-for="character in characters" :key="character">{{character}}</li>
      </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CharacterList from '@/CharacterList/CharacterList';

@Component({
  components: {
  },
})
export default class CharacterListView extends Vue {

    private characters = new CharacterList().characterNames;
    private characterList = new CharacterList();

    mounted() {
        
    }
}
</script>
