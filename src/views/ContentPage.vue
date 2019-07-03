<template>
    <div class="content-page-container">
        <div class="page-title">
            <h1>{{pageTitle}}</h1>
        </div>
        <slot class="page-content"></slot>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    // noinspection JSUnusedGlobalSymbols export default Required by Vue
    @Component({
        components: {

        },
    })
    export default class GearOnHand extends Vue {

        @Prop()
        private pageTitle?: string;

    }
</script>

<style scoped lang="scss">

    .page-title {
        text-align: center;
    }

    .page-title h1 {
        color: #666;
    }

</style>
