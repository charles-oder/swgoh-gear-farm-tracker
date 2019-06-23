<template>
    <div class="character-list">
        <div>
            {{amount}} {{name}}
        </div>
        <div>
            <input v-model="state.amount" type="number" v-on:change="stateChanged"/>
        </div>
        <div>
            {{farmingLocations()}}
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
    import SetupStateManager from '../state/SetupStateManager';
    import GearOnHandState from '@/state/GearOnHandState';
    import {GearList} from '@/data/GearList';

    @Component({
        components: {
            CharacterSetupView,

        },
    })
    export default class FarmListLineItem extends Vue {

        @Prop() public name?: string;
        @Prop() public amount?: number;

        private state: GearOnHandState = new GearOnHandState('');

        private stateManager = new SetupStateManager();
        private gearList = new GearList();

        public mounted() {
            if (this.name === undefined) {
                return;
            }
            this.state = this.stateManager.getStateForGear(this.name);
        }

        private stateChanged() {
            //this.stateManager.setStateForGear(this.state);
        }

        private farmingLocations(): string {
            return this.gearList.getCheapestLocationsForGear(this.name);
        }

    }
</script>
