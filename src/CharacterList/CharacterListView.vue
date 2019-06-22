<template>
  <div class="character-list">
      <h1>Character List</h1>
      <ul>
            <li>Select All<input type="checkbox"/><span>Name</span><span>Gear Level</span></li>
            <li v-for="character in characters" :key="character">
                <input v-model="state['selected'][character]" v-on:change="stateChanged" type="checkbox"/>
                <div>
                    {{character}}
                </div>
                <div>
                    <select v-model="state['currentGearLevel'][character]" v-on:change="stateChanged" >
                        <option v-for="gl in validGearLevels" :key="gl">{{gl}}</option>
                    </select>
                </div>
                <div>
                    <select v-model="state['targetGearLevel'][character]" v-on:change="stateChanged" >
                        <option v-for="gl in validGearLevels" :key="gl">{{gl}}</option>
                    </select>
                </div>
                <div>
                    <div>
                        <input v-model="state['position1'][character]" v-on:change="stateChanged" type="checkbox"/>
                        <input v-model="state['position4'][character]" v-on:change="stateChanged" type="checkbox"/>
                    </div>
                    <div>
                        <input v-model="state['position2'][character]" v-on:change="stateChanged" type="checkbox"/>
                        <input v-model="state['position5'][character]" type="checkbox"/>
                    </div>
                    <div>
                        <input v-model="state['position3'][character]" v-on:change="stateChanged" type="checkbox"/>
                        <input v-model="state['position6'][character]" v-on:change="stateChanged" type="checkbox"/>
                    </div>
                </div>
            </li>
      </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import CharacterList from '@/CharacterList/CharacterList';

@Component({
  components: {
  },
})
export default class CharacterListView extends Vue {

    private static defaultState = {
        selected: {},
        currentGearLevel: {},
        targetGearLevel: {},
        position1: {},
        position2: {},
        position3: {},
        position4: {},
        position5: {},
        position6: {},
    };
    private characters = new CharacterList().characterNames;
    private characterList = new CharacterList();
    private validGearLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    private state = CharacterListView.defaultState;

    mounted() {
        this.setupInitialState();
    }

    private setupInitialState() {
        let existingStateJson = localStorage.characterState

        if (existingStateJson === undefined) {
            return;
        }
        let existingState = JSON.parse(existingStateJson);

        if (existingState === undefined) {
            return;
        }
        this.state = existingState
    }

    @Watch("state.selected") 
    @Watch("state.currentGearLevel") 
    @Watch("state.targetGearLevel") 
    @Watch("state.position1") 
    @Watch("state.position2") 
    @Watch("state.position3") 
    @Watch("state.position4") 
    @Watch("state.position5") 
    @Watch("state.position6")
    @Watch("state.*")
    private stateChanged() {
        localStorage.characterState = JSON.stringify(this.state);
    }

}
</script>
