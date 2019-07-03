<template>
    <div class="navigation-menu">
        <div class="menu-button" @click="openMenu()"></div>
        <div id="nav" :class="menuClass">
            <div class="nav-button close-button" @click="closeMenu()">
                <a href="#">Close</a>
            </div>
            <router-link class="nav-button"
                         @click.native="closeMenu()"
                         to="/characters">Character Setup</router-link>
            <router-link class="nav-button"
                         @click.native="closeMenu()"
                         to="/gear-to-farm">Gear to Farm</router-link>
            <router-link class="nav-button"
                         @click.native="closeMenu()"
                         to="/locations-to-farm">Locations to Farm</router-link>
            <router-link class="nav-button"
                         @click.native="closeMenu()"
                         to="/gear-on-hand">Gear On Hand</router-link>
            <router-link class="nav-button"
                         @click.native="closeMenu()"
                         to="/gear-needed-per-character">Gear Needed/Character</router-link>
            <router-link class="nav-button"
                         @click.native="closeMenu()"
                         to="/gear-needed-total">Total Gear Needed</router-link>
            <div class="nav-button" @click="fetchCharacterData()">
                <a href="#">Fetch Character Data</a>
            </div>
            <div class="nav-button" v-if="!isAutoSaveOn" @click="confirmSetAutosave(true)">
                <a href="#">Turn On Auto Cloud Sync</a>
            </div>
            <div class="nav-button" v-if="!isAutoSaveOn" @click="confirmSaveToCloud">
                <a href="#">Save Data To Cloud</a>
            </div>
            <div class="nav-button" v-if="!isAutoSaveOn" @click="confirmPullFromCloud">
                <a href="#">Load Data From Cloud</a>
            </div>
            <div class="nav-button" v-if="isAutoSaveOn" @click="confirmSetAutosave(false)">
                <a href="#">Turn Off Auto Cloud Sync</a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ModalDialog from '../views/ModalDialog.vue';
    import AlertView from '../views/AlertView.vue';
    import SetupStateManager from '../state/SetupStateManager';
    import AlertBus from '../views/AlertBus';
    import PullCharacterData from '../views/PullCharacterData.vue';

    @Component({
        components: {
            PullCharacterData,
            AlertView,
            ModalDialog,
        },
    })
    export default class NavigationMenu extends Vue {

        private isAutoSaveOn: boolean = SetupStateManager.shared.isAutoSaveToCloudOn;
        private menuClass: string = 'menu-initial';

        protected mounted() {
            this.$ga.event('app', 'launch');
        }
        private setAutoSave(newValue: boolean) {
            this.isAutoSaveOn = newValue;
            SetupStateManager.shared.isAutoSaveToCloudOn = newValue;
        }

        private closeMenu() {
            this.menuClass = 'menu-closed';
        }

        private openMenu() {
            this.menuClass = 'menu-open';
        }

        private fetchCharacterData() {
            PullCharacterData.show();
        }

        private confirmSetAutosave(autoSave: boolean) {
            const message = autoSave
                ? 'Are you sure you want to automatically download data from the cloud? This' +
                ' will overwrite any existing local data. (May require enabling popups)'
                : 'Are you sure you want to turn off automatic cloud sync?';
            AlertBus.showDialog(message, 'Yes', () => {
                this.closeMenu();
                this.setAutoSave(autoSave);
                if (autoSave) {
                    SetupStateManager.shared.pullDataFromCloud();
                }
            });
        }

        private confirmSaveToCloud() {
            AlertBus.showDialog('Are you sure you want to overwrite your cloud data? (May require enabling popups)',
                'Yes', () => {
                    this.closeMenu();
                    SetupStateManager.shared.saveDataToCloudAndWait().then(() => {
                        AlertBus.alertMessage('Data Saved');
                    });
                });
        }

        private confirmPullFromCloud() {
            AlertBus.showDialog('Are you sure you want to overwrite your local data? (May require enabling popups)' ,
                'Yes', () => {
                    this.closeMenu();
                    SetupStateManager.shared.pullDataFromCloudAndWait().then(() => {
                        AlertBus.alertMessage('Data Loaded');
                    });
                });
        }

    }
</script>

<style lang="scss">

    .menu-button {
        visibility: hidden;
        position: absolute;
        padding: 20px;
        top: 10px;
        right: 10px;
        cursor: pointer;
        background-image: url('../assets/menu-icon.png');
        background-size:     cover;                      /* <------ */
        background-repeat:   no-repeat;
        background-position: center center;              /* optional, center the image */
    }

    .nav-button {
        padding: 0.8em;
        display: inline-block;
        cursor: pointer;
    }

    .nav-button:hover {
        background-color: rgba(0, 0, 0, 0.05);
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
        display: block;

        a {
            font-weight: bold;
            color: #f4cbb9;
            text-decoration: none;
            &.router-link-exact-active {
                color: #a6827c;
            }
        }

    }

    #page-container {
        z-index: -1;
    }

    @media only screen and (min-width: 1020px) {
        .close-button {
            visibility: hidden;
        }
    }

    @media only screen and (max-width: 1020px) {
        .close-button {
        }

        .menu-open {
            animation: slideLeft 0.2s ease-in;
            animation-fill-mode: forwards;
        }

        .menu-closed {
            transform: translateX(100%);
            animation: slideRight 0.2s ease-in;
            animation-fill-mode: forwards;
        }

        .menu-initial {
            transform: translateX(100%);
        }

        .menu-button {
            visibility: visible;
            color: #333;
        }

        .nav-button {
            padding: 0.8em 0;
            margin: 0;
            width: 100%;
            text-indent: 0.8em;
        }

        .nav-button:hover {
            background-color: #444;
        }

        #nav {
            z-index: 1;
            position: fixed;
            top: 0;
            right: 0;
            width: 70%;
            max-width: 20em;
            height: 100%;
            background-color: #333;
            padding: 0;
            text-align: left;
            overflow: auto;
            a {
                color: #CCC;
                width: 100%;
                &.router-link-exact-active {
                    color: #CCC;
                    background-color: #666;
                }
            }
        }
    }

    @keyframes slideLeft {
        0% {
            transform: translateX(100%);
        }

        100% {
            transform: translateX(0);
        }
    }

    @keyframes slideRight {
        0% {
            transform: translateX(0);
        }

        100% {
            transform: translateX(100%);
        }
    }

</style>
