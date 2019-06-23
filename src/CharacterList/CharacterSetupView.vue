<template>
    <div class="character-listing">
        <div class="left-pane">
            <div class="name-section">
                <label>
                    <input v-model="state.isSelected" v-on:change="stateChanged" type="checkbox"/>
                    {{characterName}}
                </label>
            </div>
            <div class="gear-level-selector">
                <label>
                    Current GL:
                    <select v-model="state.currentGearLevel" v-on:change="stateChanged" >
                        <option v-for="gl in validGearLevels" :key="gl">{{gl}}</option>
                    </select>
                </label>
                <label>
                    Target GL:
                    <select v-model="state.targetGearLevel" v-on:change="stateChanged" >
                        <option v-for="gl in validTargetGearLevels" :key="gl">{{gl}}</option>
                    </select>
                </label>
            </div>
            <div class="gear-level-selector">
            </div>
        </div>
        <div class="right-pane">
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

        private validGearLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
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
            this.stateManager.setStateForCharacter(this.state);
        }

    }
</script>

<style scoped lang="scss">
    .character-listing {
        margin: 2em;
        background-color: #c4f5ff;
    }
    .left-pane {
        display: inline-block;
        text-align: left;
        padding: 1em;
    }
    .right-pane {
        padding: 1em;
        display: inline-block;
    }

    .gear-level-selector {
        text-align: right;
    }

    .gear-level-selector label {
        text-align: right;
        display: block;
    }
</style>
