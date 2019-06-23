<template>
    <div class="character-listing">
        <input v-model="state.isSelected" v-on:change="stateChanged" type="checkbox"/>
        <div>
            {{characterName}}
        </div>
        <div>
            <select v-model="state.currentGearLevel" v-on:change="stateChanged" >
                <option v-for="gl in validGearLevels" :key="gl">{{gl}}</option>
            </select>
        </div>
        <div>
            <select v-model="state.targetGearLevel" v-on:change="stateChanged" >
                <option v-for="gl in validTargetGearLevels" :key="gl">{{gl}}</option>
            </select>
        </div>
        <div>
            <div>
                <input v-model="state.gearItem1" v-on:change="stateChanged" type="checkbox"/>
                <input v-model="state.gearItem4" v-on:change="stateChanged" type="checkbox"/>
            </div>
            <div>
                <input v-model="state.gearItem2" v-on:change="stateChanged" type="checkbox"/>
                <input v-model="state.gearItem5" v-on:change="stateChanged" type="checkbox"/>
            </div>
            <div>
                <input v-model="state.gearItem3" v-on:change="stateChanged" type="checkbox"/>
                <input v-model="state.gearItem6" v-on:change="stateChanged" type="checkbox"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
    import CharacterSetupState from '@/state/CharacterSetupState';
    import SetupStateManager from '@/state/SetupStateManager';

    @Component({
        components: {

        },
    })
    export default class CharacterSetupView extends Vue {

        @Prop() public characterName?: string;

        private validGearLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        private state: CharacterSetupState = new CharacterSetupState('');
        private stateManager = new SetupStateManager();

        private get validTargetGearLevels() {
            const currentGearLevel = this.state.currentGearLevel;
            return this.validGearLevels.filter((element) => element >= currentGearLevel);
        }
        public mounted() {
            const name = this.characterName ? this.characterName : '';

            this.state = this.stateManager.getStateForCharacter(name);
        }

        private stateChanged() {
            if (this.state.targetGearLevel < this.state.currentGearLevel) {
                this.state.targetGearLevel = this.state.currentGearLevel;
            }
            this.stateManager.setStateForCharacter(this.state);
        }

    }
</script>
