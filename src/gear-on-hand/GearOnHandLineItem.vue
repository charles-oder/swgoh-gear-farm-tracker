<template>
    <div class="gear-on-hand-line-item">
        <label>
            <input v-model="state.amount" v-on:change="stateChanged" type="number"/>
            {{gearName}}
        </label>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import SetupStateManager from '../state/SetupStateManager';
import GearOnHandState from '../state/GearOnHandState';

@Component({
    components: {},
})
export default class GearOnHand extends Vue {

    @Prop() public gearName?: string;

    private stateManager = SetupStateManager.shared;
    private state: GearOnHandState = new GearOnHandState('');

    // noinspection JSUnusedGlobalSymbols Lifecycle Method
    public mounted() {
        const name = this.gearName ? this.gearName : '';

        this.state = this.stateManager.getStateForGear(name);
    }

    // noinspection JSUnusedLocalSymbols Template Data
    private stateChanged() {
        this.stateManager.setStateForGear(this.state);
    }
}
</script>

<style scoped lang="scss">

    input {
        width: 4em;
    }

    .gear-on-hand-line-item {
        text-align: left;
        padding: 0.2em;
    }
</style>
