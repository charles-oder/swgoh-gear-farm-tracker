<template>
    <div id="app">
        <div id="nav">
            <router-link to="/characters">Character Setup</router-link>
            |
            <router-link to="/farm-list">Farm List</router-link>
            |
            <router-link to="/gear-on-hand">Gear On Hand</router-link>
            |
            <router-link to="/gear-needed-per-character">Gear Needed/Character</router-link>
            |
            <router-link to="/gear-needed-total">Total Gear Needed</router-link>
            <div>
                <span v-if="!isAutoSaveOn" >
                    <a href="#" @click="confirmSetAutosave(true)">Turn On AutoSave</a> |
                    <a href="#" @click="confirmSaveToCloud">Save Data To Cloud</a> |
                    <a href="#" @click="confirmPullFromCloud">Load Data From Cloud</a>
                </span>
                <span v-if="isAutoSaveOn" >
                    <a href="#" @click="confirmSetAutosave(false)">Turn Off AutoSave</a>
                </span>
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
    import FirebaseDataStore from '@/state/FirebaseDataStore';
    import SetupStateManager from '@/state/SetupStateManager';
    import AlertBus from '@/views/AlertBus';

    @Component({
        components: {
            AlertView,
            ModalDialog,
        },
    })
    export default class App extends Vue {

        private isAutoSaveOn: boolean = false;

        protected mounted() {
            this.isAutoSaveOn = SetupStateManager.shared.isAutoSaveToCloudOn;
        }
        private setAutoSave(newValue: boolean) {
            this.isAutoSaveOn = newValue;
            SetupStateManager.shared.isAutoSaveToCloudOn = newValue;
        }

        private confirmSetAutosave(autoSave: boolean) {
            const message = autoSave
                ? 'Are you sure you want to automatically download data from the cloud? This' +
                ' will overwrite any existing local data.'
                : 'Are you sure you want to turn off automatic cloud sync?';
            AlertBus.showDialog(message, 'Yes', () => {
                this.setAutoSave(autoSave);
                if (autoSave) {
                    SetupStateManager.shared.pullDataFromCloud();
                }
            });
        }

        private confirmSaveToCloud() {
            AlertBus.showDialog('Are you sure you want to overwrite your cloud data?', 'Yes', () => {
                SetupStateManager.shared.saveDataToCloudAndWait().then(() => {
                    AlertBus.alertMessage('Data Saved');
                });
            });
        }

        private confirmPullFromCloud() {
            AlertBus.showDialog('Are you sure you want to overwrite your local data?', 'Yes', () => {
                SetupStateManager.shared.pullDataFromCloud();
            });
        }

    }
</script>

<style lang="scss">
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
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
