<!-- eslint-disable import/no-extraneous-dependencies -->
<template>
  <div ref="map" class="map"></div>
  <div ref="mapPos" class="mapPos"></div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { mapActions } from 'vuex'
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Tile, Vector } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';

export default class MapComponent extends Vue {
  // ({ default: [0, 0] }) initialPosition!: [number, number];
  private map: Map | null = null;
  private mapPos = { latitude: 48.21340378, longitude: 20.73998763, heading: 3.678493726 }

  mounted() {
    // Create OpenLayers map
    // this.map = new Map({
    //   target: this.$refs.map as HTMLElement,
    //   layers: [
    //     new TileLayer({
    //       source: new OSM(),
    //     }),
    //   ],
    //   view: new View({
    //     center: [0, 0],
    //     zoom: 2,
    //   }),
    // });
    this.initializeMap();
    this.initializeBoat();

    // this.map?.getView().setCenter([this.mapPos.longitude, this.mapPos.latitude]);

    this.$watch(
      () => this.$store.getters.getLastPositionForBoat,
      (newValue, oldValue) => {
        this.mapPos.latitude = newValue.latitude
        this.mapPos.longitude = newValue.longitude
        this.mapPos.heading = newValue.heading
        console.log(`Count changed from ${oldValue} to ${newValue}`);
        // React to the value change here
        this.map?.getView().setCenter([this.mapPos.longitude, this.mapPos.latitude]);
      }
    );
  }

  beforeDestroy() {
    // Cleanup resources when component is destroyed
    if (this.map) {
      this.map.dispose();
    }
  }

  initializeMap() {
    const map = new Map({
      target: this.$refs.map as HTMLElement,
      layers: [
        new Tile({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 10,
      }),
    });

    this.map = map;
  }

  initializeBoat() {
    const boatFeature = new Feature({
      geometry: new Point([0, 0]),
    });

    boatFeature.setStyle(
      new Style({
        image: new Icon({
          src: 'path/to/boat-icon.png',
          scale: 0.05,
          rotateWithView: true,
          rotation: Math.PI / 2,
        }),
      })
    );

    const boatLayer = new Vector({
      source: new VectorSource({
        features: [boatFeature],
      }),
    });

    this.map?.addLayer(boatLayer);

    const newPosition = [
      0 + Math.random() / 10,
      0 + Math.random() / 10,
    ];
    boatFeature.setGeometry(new Point(newPosition));
    this.map?.getView().setCenter(newPosition);

    // Simulate boat movement (replace this with your actual boat position update logic)
    // setInterval(() => {
    //   const newPosition = [
    //     this.initialPosition[0] + Math.random() / 10,
    //     this.initialPosition[1] + Math.random() / 10,
    //   ];
    //   boatFeature.setGeometry(new Point(newPosition));
    //   this.map?.getView().setCenter(newPosition);
    // }, 1000);
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
