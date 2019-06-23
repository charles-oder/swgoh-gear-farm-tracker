0<template>
    <div :class="modalVisibility">
        <div class="container">
            <div class="message">{{displayMessage()}}</div>
            <div class="buttonPanel">
                <div class="positiveButton" @click="positiveButtonClicked">{{displayPositiveTitle()}}</div>
                <div class="negativeButton" @click="negativeButtonClicked">{{displayNegativeTitle()}}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class ModalDialog extends Vue {

        public static get shared(): ModalDialog {
            if (this.instance === undefined) {
                throw new Error('ModalDialog must be mounted first!');
            }
            return this.instance;
        }

        public static show(message: string,
                           positiveTitle?: string,
                           positiveCallback?: () => void,
                           negativeTitle?: string,
                           negativeCallback?: () => void) {
            ModalDialog.shared.show(message, positiveTitle, positiveCallback, negativeTitle, negativeCallback);
        }

        public static hide() {
            ModalDialog.shared.hide();
        }

        private static instance?: ModalDialog;

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

        public mounted() {
            ModalDialog.instance = this;
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
            return this.visible ? 'modalVisible' : 'modalInvisible';
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .modalVisible, .modalInvisible {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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
</style>
