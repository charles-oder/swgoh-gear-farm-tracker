<template>
    <div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import SetupState from '@/state/SetupState';
    import SetupStateManager from '@/state/SetupStateManager';

    // noinspection JSUnusedGlobalSymbols
    @Component
    export default class SetupStateObservingView extends Vue {

        protected setupState: SetupState = new SetupState();

        private stateObservableId: string = '';

        // noinspection JSUnusedGlobalSymbols Lifecycle
        protected created() {
            this.stateObservableId = SetupStateManager.shared.getObservable().observe((newValue, oldValue) => {
                this.stateDidChange(newValue, oldValue);
            });
        }

        // noinspection JSUnusedGlobalSymbols Lifecycle
        protected destroyed() {
            SetupStateManager.shared.getObservable().unobserve(this.stateObservableId);
        }

        protected stateDidChange(newValue?: SetupState, oldValue?: SetupState) {
            if (newValue !== undefined) {
                this.setupState = newValue!;
            }
        }
    }
</script>
