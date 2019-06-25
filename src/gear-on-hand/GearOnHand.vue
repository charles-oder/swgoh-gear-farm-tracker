<template>
    <div class="gear-on-hand-list">
        <h1>Gear On Hand</h1>
        <div class="list-container">
            <ul>
                <li v-for="gear in allGearNames()" :key="gear">
                    <GearOnHandLineItem :gearName="gear"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import SetupStateManager from '../state/SetupStateManager';
import {GearList} from '@/data/GearList';
import GearOnHandLineItem from '@/gear-on-hand/GearOnHandLineItem.vue';

@Component({
    components: {
        GearOnHandLineItem,
    },
})
export default class GearOnHand extends Vue {

    private gearList = GearList.shared;

    public allGearNames(): string[] {
        return this.gearList.allGearNames();
    }
}
</script>

<style scoped lang="scss">

    ul {
        list-style: none;
        padding-left: 0;
    }

    h1 {
        color: #666;
    }

    .gear-on-hand-list {
        width: 100%;
    }

    .list-container {
        width: 30em;
        margin-left: 50%;
        transform: translateX(-50%);
    }
</style>
