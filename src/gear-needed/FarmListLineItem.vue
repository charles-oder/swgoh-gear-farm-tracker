<template>
    <div class="gear-listing">
        <div class="gear-name-row">
            <div class="amount">{{amount}}</div>
            <div class="name">{{name}}</div>
        </div>
        <div class="on-hand-row">
            <label>
                On Hand:
                <input v-model="state.amount" type="number" v-on:change="stateChanged"/>
            </label>
        </div>
        <div class="location-row">
            {{farmingLocations()}}
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
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
    private originalState: GearOnHandState = new GearOnHandState('');

    private stateManager = SetupStateManager.shared;
    private gearList = GearList.shared;

    // noinspection JSUnusedGlobalSymbols Lifecycle Method
    public mounted() {
        if (this.name === undefined) {
            return;
        }
        this.state = this.stateManager.getStateForGear(this.name);
        this.originalState = new GearOnHandState(this.state.name);
        this.originalState.amount = this.state.amount;
    }

    // noinspection JSUnusedLocalSymbols Template Data
    private stateChanged() {
        this.stateManager.setStateForGear(this.state);
    }

    // noinspection JSUnusedLocalSymbols Template Data
    private farmingLocations(): string {
        if (this.name === undefined) {
            return '';
        }
        return this.gearList.getCheapestLocationsForGear(this.name);
    }

}
</script>
<style scoped lang="scss">
    .gear-listing {
        margin: 1em;
        background-color: #c4f5ff;
        text-align: left;
        padding: 10px;
    }

    .amount {
        display: inline-block;
        font-weight: bold;
        margin-right: 1em;
    }

    .name {
        display: inline-block;
    }

    .gear-name-row {
        padding: 0.2em;
    }

    .on-hand-row {
        padding: 0.2em;
    }

    .on-hand-row input {
        width: 4em;
        text-align: right;
        position: relative;
        top: -2px;
    }

    .location-row {
        padding: 0 3px;
        font-size: 0.8em;
        color: #666;
    }
</style>
