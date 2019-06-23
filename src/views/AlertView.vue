0<template>
    <div :class="alertVisibility()">
        {{displayMessage()}} <a :href="this.displayLink()">{{displayLinkText()}}</a>
        <div class="closeButton" @click="close">X</div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class AlertView extends Vue {

        public static get shared(): AlertView {
            if (this.instance === undefined) {
                throw new Error('AlertView must be mounted first!');
            }
            return this.instance;
        }

        public static showError(message: string, link?: string, linkText?: string) {
            AlertView.shared.showError(message, link, linkText);
        }

        public static hideError() {
            AlertView.shared.close();
        }

        private static instance?: AlertView;

        private visible: boolean = false;
        private message?: string;
        private link?: string;
        private linkText?: string;

        public mounted() {
            AlertView.instance = this;
        }

        public close() {
            this.message = undefined;
            this.link = undefined;
            this.linkText = undefined;
            this.visible = false;
        }

        public showError(message: string, link?: string, linkText?: string) {
            this.message = message;
            this.link = link;
            this.linkText = linkText === undefined ? link : linkText;
            this.visible = true;
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
            return this.visible ? 'alertContainerVisible' : 'alertContainerHidden';
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
        background-color: lightpink;
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
        float: right;
        cursor: pointer;
        margin-right: 20px;
    }
</style>
