<!-- eslint-disable import/no-extraneous-dependencies -->
<template>
  <div ref="map" class="map"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default class MapComponent extends Vue {
  private map: Map | null = null;

  mounted() {
    // Create OpenLayers map
    this.map = new Map({
      target: this.$refs.map as HTMLElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }

  beforeDestroy() {
    // Cleanup resources when component is destroyed
    if (this.map) {
      this.map.dispose();
    }
  }
}
</script>

<style scoped>
/* Add your component styles here */
.map {
  width: 100%;
  height: 400px;
}
</style>
