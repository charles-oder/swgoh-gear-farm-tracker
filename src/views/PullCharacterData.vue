0<template>
    <div :class="modalVisibility">
        <div class="container">
            <div class="message">Enter your ally code to pull data from swgoh.gg</div>
            <div><input v-model="allyCode" type="text" /></div>
            <div class="buttonPanel">
                <div class="positiveButton" @click="positiveButtonClicked">Go</div>
                <div class="negativeButton" @click="negativeButtonClicked">Cancel</div>
            </div>
            <Spinner class="spinner" v-if="working" visible="true"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import SwgohGgPlayerDataService from '@/SwgohGgService/SwgohGgPlayerDataService';
    import Spinner from '@/views/Spinner.vue';
    import AlertBus from '@/views/AlertBus';
    import AppLog from '@/AppLog';
    import SetupStateManager from '@/state/SetupStateManager';
    @Component({
        components: {Spinner},
    })
    export default class PullCharacterData extends Vue {


        public static show() {
            if (this.instance === undefined) {
                throw new Error('PullCharacterData must be mounted first');
            }
            this.instance!.show();
        }

        private static instance?: PullCharacterData;

        private visible: boolean = false;
        private working: boolean = false;
        private allyCode: string = '';
        private service = new SwgohGgPlayerDataService();
        private tag = 'PullCharacterData';

        public hide() {
            this.visible = false;
        }

        public show() {
            this.visible = true;
        }

        // noinspection JSUnusedGlobalSymbols Lifecycle Method
        public mounted() {
            PullCharacterData.instance = this;
        }

        private positiveButtonClicked() {
            AppLog.log(this.tag, 'Fetch Ally Code: ' + this.allyCode);
            this.$ga.event('fetch-character-data');
            this.working = true;
            this.service.getCharacterData(this.allyCode).then((data) => {
                data.units.forEach((remoteCharacter) => {
                    const gear = remoteCharacter.data.gear.sort((g) => g.slot).map((g) => g.is_obtained);
                    this.updateLocalCharacter(remoteCharacter.data.name, remoteCharacter.data.gear_level, gear);
                });
                this.working = false;
                this.hide();
            }).catch((error) => {
                this.hide();
                AlertBus.alertError(error);
            });
        }

        private negativeButtonClicked() {
            this.hide();
        }

        private updateLocalCharacter(name: string, gearLevel: number, gearSlots: boolean[]) {
            AppLog.log(this.tag, 'Processing: ' + name + ', GL: ' + gearLevel + ', equipped: '
                + JSON.stringify(gearSlots));
            const state = SetupStateManager.shared.getStateForCharacter(name);
            state.currentGearLevel = gearLevel;
            state.gearItems = gearSlots;
            SetupStateManager.shared.setStateForCharacter(state);
        }

        get modalVisibility(): string {
            return this.visible ? 'modalVisible' : 'modalInvisible';
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .modalVisible, .modalInvisible {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        text-align: center;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.2);
        visibility: visible;
        pointer-events: auto;
        z-index: 999;
    }
    .modalVisible {
        visibility: visible;
        pointer-events: auto;
    }
    .modalInvisible {
        visibility: hidden;
        pointer-events: none;
    }
    .container {
        position: relative;
        background-color: white;
        width: 300px;
        margin: 15% auto auto auto;
        padding: 20px;
        border-radius: 5px;
    }

    .positiveButton, .negativeButton {
        padding: 5px;
        margin: 10px;
        width: 100px;
        cursor: pointer;
        color: white;
        font-weight: bold;
    }
    .positiveButton {
        background-color: #01681a;
        float: left;
    }
    .negativeButton {
        background-color: darkred;
        float: right;
    }
    .buttonPanel {
        background-color: white;
        height: 30px;
    }
    .message {
    }
    .spinner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
