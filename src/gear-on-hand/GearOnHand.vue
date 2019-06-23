<template>
    <div class="character-list">
        <h1>Gear On Hand</h1>
        <ul>
            <li v-for="gear in allGearNames()" :key="gear">
                <GearOnHandLineItem :gearName="gear" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SetupStateManager from '../state/SetupStateManager';
import {GearList} from '@/data/GearList';
import GearOnHandLineItem from '@/gear-on-hand/GearOnHandLineItem.vue';

@Component({
    components: {
        GearOnHandLineItem,
    },
})
export default class GearOnHand extends Vue {

    private gearList = new GearList();

    public allGearNames(): string[] {
        return this.gearList.allGearNames();
    }
 }
</script>
