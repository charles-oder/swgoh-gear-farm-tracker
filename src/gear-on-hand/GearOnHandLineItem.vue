<template>
    <div class="ger-on-hand-line-item">
        <label>
            <input v-model="state.amount" v-on:change="stateChanged" type="number"/>
        </label>
        {{gearName}}
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

    private stateManager = new SetupStateManager();
    private state: GearOnHandState = new GearOnHandState('');

    public mounted() {
        const name = this.gearName ? this.gearName : '';

        this.state = this.stateManager.getStateForGear(name);
    }

    private stateChanged() {
        this.stateManager.setStateForGear(this.state);
    }
}
</script>
