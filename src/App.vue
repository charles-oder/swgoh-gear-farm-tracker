<template>
    <div id="app">
        <div id="nav">
            <router-link class="nav-button" to="/characters">Character Setup</router-link>
            <router-link class="nav-button" to="/gear-to-farm">Gear to Farm</router-link>
            <router-link class="nav-button" to="/locations-to-farm">Locations to Farm</router-link>
            <router-link class="nav-button" to="/gear-on-hand">Gear On Hand</router-link>
            <router-link class="nav-button" to="/gear-needed-per-character">Gear Needed/Character</router-link>
            <router-link class="nav-button" to="/gear-needed-total">Total Gear Needed</router-link>
            <div class="nav-button" v-if="!isAutoSaveOn">
                <a href="#" @click="confirmSetAutosave(true)">Turn On Auto Cloud Sync</a>
            </div>
            <div class="nav-button" v-if="!isAutoSaveOn">
                <a href="#" @click="confirmSaveToCloud">Save Data To Cloud</a>
            </div>
            <div class="nav-button" v-if="!isAutoSaveOn">
                <a href="#" @click="confirmPullFromCloud">Load Data From Cloud</a>
            </div>
            <div class="nav-button" v-if="isAutoSaveOn">
                <a href="#" @click="confirmSetAutosave(false)">Turn Off Auto Cloud Sync</a>
            </div>
            <AlertView />
            <ModalDialog />
        </div>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ModalDialog from '@/views/ModalDialog.vue';
    import AlertView from '@/views/AlertView.vue';
    import SetupStateManager from '@/state/SetupStateManager';
    import AlertBus from '@/views/AlertBus';

    @Component({
        components: {
            AlertView,
            ModalDialog,
        },
    })
    export default class App extends Vue {

        private isAutoSaveOn: boolean = SetupStateManager.shared.isAutoSaveToCloudOn;

        private setAutoSave(newValue: boolean) {
            this.isAutoSaveOn = newValue;
            SetupStateManager.shared.isAutoSaveToCloudOn = newValue;
        }

        private confirmSetAutosave(autoSave: boolean) {
            const message = autoSave
                ? 'Are you sure you want to automatically download data from the cloud? This' +
                ' will overwrite any existing local data. (May require enabling popups)'
                : 'Are you sure you want to turn off automatic cloud sync?';
            AlertBus.showDialog(message, 'Yes', () => {
                this.setAutoSave(autoSave);
                if (autoSave) {
                    SetupStateManager.shared.pullDataFromCloud();
                }
            });
        }

        private confirmSaveToCloud() {
            AlertBus.showDialog('Are you sure you want to overwrite your cloud data? (May require enabling popups)',
                'Yes', () => {
                SetupStateManager.shared.saveDataToCloudAndWait().then(() => {
                    AlertBus.alertMessage('Data Saved');
                });
            });
        }

        private confirmPullFromCloud() {
            AlertBus.showDialog('Are you sure you want to overwrite your local data? (May require enabling popups)' ,
                'Yes', () => {
                SetupStateManager.shared.pullDataFromCloudAndWait().then(() => {
                    AlertBus.alertMessage('Data Loaded');
                });
            });
        }

    }
</script>

<style lang="scss">

    .nav-button {
        margin: 0.4em;
        padding:0.4em;
        display: inline-block;
    }
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #f4cbb9;
            text-decoration: none;
            &.router-link-exact-active {
                color: #a6827c;
            }
        }
    }
</style>
