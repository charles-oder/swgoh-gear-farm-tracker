0<template>
    <div :class="alertVisibilityClass">
        <div class="message-text">{{displayMessage()}} <a :href="this.displayLink()">{{displayLinkText()}}</a></div>
        <div class="banner-close-button" @click="close">X</div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AlertBus from '@/views/AlertBus';

@Component
export default class AlertView extends Vue {

    private alertVisibilityClass: string = 'alert-container initial message';
    private message?: string;
    private link?: string;
    private linkText?: string;
    private autoCloseTime?: number;
    private readonly autoCloseTimeout: number = 5000;


    // noinspection JSUnusedGlobalSymbols Lifecycle Method
    public mounted() {
        AlertBus.shared.alertMessage = this.showMessage;
        AlertBus.shared.alertError = this.showError;
    }

    public close() {
        this.autoCloseTime = undefined;
        if (!this.alertVisibilityClass.includes('visible')) {
            return;
        }
        this.alertVisibilityClass = this.alertVisibilityClass.replace('visible', 'hidden');
    }

    public showError(message: string, link?: string, linkText?: string) {
        this.close();
        this.message = message;
        this.link = link;
        this.linkText = linkText === undefined ? link : linkText;
        this.alertVisibilityClass = 'alert-container visible error';
        this.startAutoCloseTimer();
    }

    public showMessage(message: string, link?: string, linkText?: string) {
        this.close();
        this.message = message;
        this.link = link;
        this.linkText = linkText === undefined ? link : linkText;
        this.alertVisibilityClass = 'alert-container visible message';
        this.startAutoCloseTimer();
    }

    private startAutoCloseTimer() {
        this.autoCloseTime = new Date().getTime() + (this.autoCloseTimeout - 100);
        setTimeout(() => {
            const now = new Date().getTime();
            if (this.autoCloseTime !== undefined && now > this.autoCloseTime) {
                this.close();
            }
        }, this.autoCloseTimeout);
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

    .alert-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        padding: 20px 0;
        z-index: 998;
    }

    .visible {
        transform: translateY(0);
        pointer-events: auto;
        animation: slideDown 0.5s ease-out;
    }

    .hidden {
        transform: translateY(-100%);
        pointer-events: none;
        animation: slideUp 0.5s ease-in;
    }

    .initial {
        transform: translateY(-100%);
        pointer-events: none;
    }

    .banner-close-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        cursor: pointer;
        padding: 20px;
        z-index: 999;
    }

    .message {
        background-color: palegreen;
    }

    .error {
        background-color: lightpink;
    }

    .message-text {
        padding: 0 2em;
        white-space: pre;
        vertical-align: center;
    }

    @keyframes slideDown {
        0% {
            opacity: 0;
            transform: translateY(-100%);
        }

        100% {
            opacity: 100%;
            transform: translateY(0);
        }
    }

    @keyframes slideUp {
        0% {
            opacity: 100%;
            transform: translateY(0);
        }

        100% {
            opacity: 0;
            transform: translateY(-100%);
        }
    }

</style>
