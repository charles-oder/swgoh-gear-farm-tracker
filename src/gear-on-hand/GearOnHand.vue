<template>
    <div class="gear-on-hand-list">
        <div class="page-title">
            <h1>Gear On Hand</h1>
        </div>
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
import {GearList} from '@/data/GearList';
import GearOnHandLineItem from '@/gear-on-hand/GearOnHandLineItem.vue';

// noinspection JSUnusedGlobalSymbols export default Required by Vue
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

    protected mounted() {
        this.$ga.page('GearOnHand');
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

    .page-title {
        text-align: center;
    }

    .gear-on-hand-list {
        width: 90%;
    }

    .list-container {
        padding: 20px;
        width: 30em;
        max-width: 90%;
        margin: auto;
    }
</style>
