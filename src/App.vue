<template>
    <div id="app">
        <NavigationMenu />
        <AlertView />
        <ModalDialog />
        <PullCharacterData />
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
    .close-button {
    }

    .menu-button {
        visibility: hidden;
        position: absolute;
        padding: 20px;
        top: 10px;
        right: 10px;
        cursor: pointer;
        background-image: url('./assets/menu-icon.png');
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
