<template>
    <div class="character-listing">
        <div class="name-section">
            <label>
                <input v-model="state.isSelected" v-on:change="stateChanged" type="checkbox"/>
                {{characterName}}
            </label>
        </div>
        <div class="left-pane">
            <div class="gear-level-selector">
                <label>
                    Current GL:
                    <select v-model="state.currentGearLevel" v-on:change="stateChanged">
                        <option v-for="gl in validGearLevels" :key="gl">{{gl}}</option>
                    </select>
                </label>
                <label>
                    Target GL:
                    <select v-model="state.targetGearLevel" v-on:change="stateChanged">
                        <option v-for="gl in validTargetGearLevels" :key="gl">{{gl}}</option>
                    </select>
                </label>
            </div>
            <div class="gear-level-selector">
            </div>
        </div>
        <div class="right-pane">
            <div>
                <input v-model="state.gearItems[0]" v-on:change="gearUpdated(0)" type="checkbox"/>
                <input v-model="state.gearItems[3]" v-on:change="gearUpdated(3)" type="checkbox"/>
            </div>
            <div>
                <input v-model="state.gearItems[1]" v-on:change="gearUpdated(1)" type="checkbox"/>
                <input v-model="state.gearItems[4]" v-on:change="gearUpdated(4)" type="checkbox"/>
            </div>
            <div>
                <input v-model="state.gearItems[2]" v-on:change="gearUpdated(2)" type="checkbox"/>
                <input v-model="state.gearItems[5]" v-on:change="gearUpdated(5)" type="checkbox"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop} from 'vue-property-decorator';
import CharacterSetupState from '@/state/CharacterSetupState';
import SetupStateManager from '@/state/SetupStateManager';
import {GearList} from '@/data/GearList';
import CharacterList from '@/CharacterList/CharacterList';
import AlertBus from '@/views/AlertBus';
import SetupStateObservingView from '@/components/SetupStateObservingView.vue';
import SetupState from '@/state/SetupState';
import SetupStateHelper from '@/state/SetupStateHelper';
import AppLog from '@/AppLog';

@Component({
    components: {},
})
export default class CharacterSetupView extends SetupStateObservingView {

    @Prop() public characterName?: string;

    private validGearLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    private state: CharacterSetupState = new CharacterSetupState('');
    private stateManager = SetupStateManager.shared;
    private gearList = GearList.shared;
    private characterList = CharacterList.shared;
    private tag = 'CharacterSetupView';

    // noinspection JSUnusedLocalSymbols Template Data
    private get validTargetGearLevels() {
        const currentGearLevel = this.state.currentGearLevel;
        return this.validGearLevels.filter((element) => element >= currentGearLevel);
    }

    // noinspection JSUnusedGlobalSymbols Lifecycle Method
    public mounted() {
        if (this.characterName !== undefined) {
            this.state = this.stateManager.getStateForCharacter(this.characterName);
        }
    }

    protected stateDidChange(newValue?: SetupState, oldValue?: SetupState) {
        this.state = new SetupStateHelper(newValue).getStateForCharacter(this.characterName);
    }

    private stateChanged() {
        this.stateManager.setStateForCharacter(this.state);
    }

    // noinspection JSUnusedLocalSymbols Template Data
    private gearUpdated(position: number) {
        if (this.state.gearItems[position]) {
            AlertBus.showDialog('Do you want to deduct this item\'s ingredients from your inventory?', 'Yes', () => {
                const currentGearLevel = this.state.currentGearLevel;
                if (this.characterName === undefined) {
                    AppLog.error(this.tag, 'Character Name Undefined');
                    return;
                }
                const gearId = this.characterList.gearIdForCharacter(this.characterName,
                    currentGearLevel, position + 1);
                if (gearId === undefined) {
                    AppLog.error(this.tag, 'Gear ID Undefined');
                    return;
                }
                const ingredients = this.gearList.ingredientsForGear(gearId);
                let message = '';
                ingredients.forEach((element) => {
                    const onHand = this.stateManager.getStateForGear(element.name);
                    onHand.amount -= element.amount;
                    this.stateManager.setStateForGear(onHand);
                    message += element.amount + ' ' + element.name + '\n';
                });
                message += 'Removed from inventory.';
                AlertBus.alertMessage(message);
            }, 'No');
        }
        this.stateChanged();
    }

}
</script>

<style scoped lang="scss">
    .name-section {
        padding: 5px 5px 0 5px;
        text-align: left;
    }

    .character-listing {
        margin: 1em;
        display: inline;
        float: left;
        max-width: 16em;
        background-color: #c4f5ff;
    }

    .left-pane {
        display: inline-block;
        text-align: left;
        padding: 1em;
    }

    .right-pane {
        float: right;
        padding: 5px 10px;
        display: inline-block;
    }

    .gear-level-selector {
        width: 8.5em;
        text-align: right;
    }

    .gear-level-selector label {
        text-align: right;
        display: block;
    }

    @media only screen and (max-width: 600px) {
        .character-listing {
            margin: 1em auto;
            display: block;
            float: none;
            max-width: 16em;
            background-color: #c4f5ff;
        }
    }

</style>
