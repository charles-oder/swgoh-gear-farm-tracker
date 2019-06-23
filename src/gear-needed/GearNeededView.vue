<template>
    <div class="character-list">
        <h1>Character List</h1>
        <ul>
            <li v-for="character in characters" :key="character">
                {{character}}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import CharacterSetupView from '@/CharacterList/CharacterSetupView.vue';
    import SetupStateManager from "../state/SetupStateManager";

    @Component({
        components: {
            CharacterSetupView,

        },
    })
    export default class GearNeededView extends Vue {

        private stateManager = new SetupStateManager();

        private get characters(): Array<string> {
            return this.stateManager.selectedCharacters.map((element) => element.name);
        }

    }
</script>
