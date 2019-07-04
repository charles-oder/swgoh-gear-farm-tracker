<template>
    <div id="app">
        <AlertView />
        <ModalDialog />
        <PullCharacterData />
        <NavigationMenu />
        <router-view id="page-container"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import ModalDialog from '@/views/ModalDialog.vue';
    import AlertView from '@/views/AlertView.vue';
    import PullCharacterData from '@/views/PullCharacterData.vue';
    import NavigationMenu from '@/navigation/NavigationMenu.vue';

    @Component({
        components: {
            NavigationMenu,
            PullCharacterData,
            AlertView,
            ModalDialog,
        },
    })
    export default class App extends Vue {

        protected mounted() {
            this.$ga.event('app', 'launch');
        }
    }
</script>

<style lang="scss">

    body {
        margin: 0;
    }

    #page-container {
        position: fixed;
        width: 100vw;
        height: calc(100vh - 40px);
        top: 90px;
        left: 0;
        overflow: auto;
    }

    @media only screen and (max-width: 1020px) {
        #page-container {
            top: 0;
            height: 100vh;
        }
    }

</style>
