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
            <div><a href="#" @click="confirmSaveToCloud">Save Data To Cloud</a> |
                <a href="#" @click="confirmPullFromCloud">Load Data From Cloud</a></div>
            <AlertView />
            <ModalDialog />
        </div>
        <router-view/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import ModalDialog from '@/views/ModalDialog.vue';
    import AlertView from '@/views/AlertView.vue';
    import FirebaseDataStore from '@/state/FirebaseDataStore';
    import SetupStateManager from '@/state/SetupStateManager';

    @Component({
        components: {
            AlertView,
            ModalDialog,
        },
    })
    export default class App extends Vue {


        private confirmSaveToCloud() {
            ModalDialog.show('Are you sure you want to overwrite your cloud data?', 'Yes', () => {
                this.saveDataToCloud();
            });
        }

        private confirmPullFromCloud() {
            ModalDialog.show('Are you sure you want to overwrite your local data?', 'Yes', () => {
                this.pullDataFromCloud();
            });
        }

        private saveDataToCloud() {
            const stateManager = SetupStateManager.shared;
            const localState = stateManager.getState();
            FirebaseDataStore.shared.authenticate(() => {
                FirebaseDataStore.shared.storeState(localState, () => {
                    AlertView.showMessage('state saved!!');
                }, (error) => {
                    AlertView.showError('Error saving state: ' + error);
                });
            }, (error) => {
                AlertView.showError('login failure: ' + error);
            });
        }

        private pullDataFromCloud() {
            const stateManager = SetupStateManager.shared;
            FirebaseDataStore.shared.authenticate(() => {
                FirebaseDataStore.shared.fetchState((state) => {
                    AlertView.showMessage('State downloaded from cloud');
                    stateManager.setState(state);
                    location.reload();
                }, (error) => {
                    AlertView.showError('Error saving state: ' + error);
                });
            }, (error) => {
                AlertView.showError('login failure: ' + error);
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
