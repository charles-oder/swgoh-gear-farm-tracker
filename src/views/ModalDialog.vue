0<template>
    <div :class="modalVisibility">
        <div class="container">
            <div class="message">{{displayMessage()}}</div>
            <div class="button-panel">
                <div class="dialog-button positive-button" @click="positiveButtonClicked">{{displayPositiveTitle()}}</div>
                <div class="dialog-button negative-button" @click="negativeButtonClicked">{{displayNegativeTitle()}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import AlertBus from '@/views/AlertBus';

    @Component
    export default class ModalDialog extends Vue {

        private visible: boolean = false;
        private message?: string;
        private positiveTitle?: string;
        private positiveCallback?: () => void;
        private negativeTitle?: string;
        private negativeCallback?: () => void;

        public hide() {
            this.message = undefined;
            this.positiveTitle = undefined;
            this.positiveCallback = undefined;
            this.negativeTitle = undefined;
            this.negativeCallback = undefined;
            this.visible = false;
        }

        public show(message: string,
                    positiveTitle?: string,
                    positiveCallback?: () => void,
                    negativeTitle?: string,
                    negativeCallback?: () => void) {
            this.message = message;
            this.positiveTitle = positiveTitle;
            this.positiveCallback = positiveCallback;
            this.negativeTitle = negativeTitle;
            this.negativeCallback = negativeCallback;
            this.visible = true;
        }

        // noinspection JSUnusedGlobalSymbols Lifecycle Method
        public mounted() {
            AlertBus.shared.showDialog = this.show;
        }

        private displayMessage(): string | undefined {
            return this.message;
        }

        private displayPositiveTitle(): string {
            if (this.positiveTitle === undefined) {
                return 'OK';
            }
            return this.positiveTitle;
        }

        private displayNegativeTitle(): string {
            if (this.negativeTitle === undefined) {
                return 'Cancel';
            }
            return this.negativeTitle;
        }

        private positiveButtonClicked() {
            if (this.positiveCallback !== undefined) {
                this.positiveCallback();
            }
            this.hide();
        }

        private negativeButtonClicked() {
            if (this.negativeCallback !== undefined) {
                this.negativeCallback();
            }
            this.hide();
        }


        get modalVisibility(): string {
            return this.visible ? 'modal-dialog dialog-visible' : 'modal-dialog dialog-invisible';
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .modal-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.2);
        visibility: visible;
        pointer-events: auto;
        z-index: 999;
    }

    .dialog-visible {
        visibility: visible;
        pointer-events: auto;
    }

    .dialog-invisible {
        visibility: hidden;
        pointer-events: none;
    }

    .container {
        position: relative;
        top: 25%;
        background-color: white;
        width: 70%;
        max-width: 300px;
        margin: auto;
        padding: 20px;
        border-radius: 5px;
    }

    .dialog-button {
        padding: 5px;
        margin: 10px;
        width: 30%;
        cursor: pointer;
        color: white;
        font-weight: bold;
    }

    .positive-button {
        background-color: #01681a;
        float: left;
    }

    .negative-button {
        background-color: darkred;
        float: right;
    }

    .button-panel {
        background-color: white;
        height: 30px;
    }

    .message {
    }
</style>
