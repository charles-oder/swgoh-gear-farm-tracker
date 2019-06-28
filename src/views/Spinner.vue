0<template>
    <div :class="spinnerClass()">
        <div class="spinnerContainer">
            <div v-if="visible" class="loadingIndicator"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class Spinner extends Vue {
        @Prop() private visible!: boolean;

        private spinnerClass(): string {
            return this.visible ? 'outerContainerVisible' : 'outerContainerHidden';
        }
    }



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .outerContainerVisible {
        pointer-events: auto;
    }
    .outerContainerHidden {
        pointer-events: none;
    }
    .spinnerContainer {
        position: relative;
        top: 50%;
        margin: auto;
        width: 22px;
        height: 22px;
        pointer-events: auto;
    }

    .loadingIndicator {
        position: relative;
        top: -11px;
        border: 2px solid gray;
        border-top: 2px solid transparent;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
