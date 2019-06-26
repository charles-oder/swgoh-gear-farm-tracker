0<template>
    <div :class="alertVisibility()">
        <div class="message-text">{{displayMessage()}} <a :href="this.displayLink()">{{displayLinkText()}}</a></div>
        <div class="closeButton" @click="close">X</div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AlertBus from '@/views/AlertBus';

    @Component
    export default class AlertView extends Vue {

        private visible: boolean = false;
        private isError: boolean = false;
        private message?: string;
        private link?: string;
        private linkText?: string;


        // noinspection JSUnusedGlobalSymbols Lifecycle Method
        public mounted() {
            AlertBus.shared.alertMessage = this.showMessage;
            AlertBus.shared.alertError = this.showError;
        }

        public close() {
            this.message = undefined;
            this.link = undefined;
            this.linkText = undefined;
            this.visible = false;
        }

        public showError(message: string, link?: string, linkText?: string) {
            this.close();
            this.message = message;
            this.link = link;
            this.linkText = linkText === undefined ? link : linkText;
            this.visible = true;
            this.isError = true;
        }

        public showMessage(message: string, link?: string, linkText?: string) {
            this.close();
            this.message = message;
            this.link = link;
            this.linkText = linkText === undefined ? link : linkText;
            this.visible = true;
            this.isError = false;
        }

        private displayMessage(): string | undefined {
            return this.message;
        }

        private displayLink(): string | undefined {
            return this.link;
        }

        private displayLinkText(): string | undefined {
            return this.linkText;
        }

        private alertVisibility(): string {
            let className = this.visible ? 'alertContainerVisible' : 'alertContainerHidden';
            className += this.isError ? ' error' : ' message';
            return className;
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    a {
        font-weight: bold;
        color: #2c3e50;
        &.router-link-exact-active {
            color: #42b983;
        }
    }

    .alertContainerVisible, .alertContainerHidden {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        padding: 20px 0;
        z-index: 998;
    }
    .alertContainerVisible {
        visibility: visible;
        pointer-events: auto;
    }
    .alertContainerHidden {
        visibility: hidden;
        pointer-events: none;
    }
    .closeButton {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        float: right;
        cursor: pointer;
        padding: 20px;
    }

    .message {
        background-color: palegreen;
        animation: dock 2s linear 1 alternate;
    }

    .error {
        background-color: lightpink;
        animation: dock 2s linear 1 alternate;
    }

    .message-text {
        padding: 0 2em;
        white-space: pre;
        vertical-align: center;
    }

</style>
