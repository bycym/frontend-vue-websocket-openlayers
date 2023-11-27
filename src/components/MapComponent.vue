<!-- eslint-disable import/no-extraneous-dependencies -->
<template>
  <div ref="map" class="map"></div>
  <!-- <p>{{ mapPos.latitude }} - {{ mapPos.longitude }} - {{ mapPos.heading }}</p> -->
  <div>
    <button @click="toggleRecording">{{ isRecording ? 'Stop Recording' : 'Start Recording' }}</button>
    <button @click="playRecordedPath" :disabled="!recordedPath.length">Play</button>
  </div>
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
import { OSM, TileWMS, Vector as VectorSource } from 'ol/source';
import { Style, Icon, Fill, Stroke } from 'ol/style';
import { WatchOptions, WatchStopHandle } from 'vue';
import { mapState } from 'vuex';
import store from '@/store/store';
import { mapGetters } from 'vuex';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat } from 'ol/proj';
import { Geometry } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
//... In component definition


export default class MapComponent extends Vue {
  // ({ default: [0, 0] }) initialPosition!: [number, number];
  private map: Map | null = null;
  private boatFeature = new Feature({
    geometry: new Point([0, 0]),
  });;
  // public mapPos = { latitude: 48.21340378, longitude: 20.73998763, heading: 3.678493726 }
  // data() {
  //   return {
  //     dataToBeWatched: ''
  //   }
  // }
  private boatLayer!: Vector<VectorSource<Feature<Point>>>
  private boatPath: [number, number][] = [];
  public isRecording: boolean = false
  public recordedPath: number[][] = []
  private playbackInterval = -1
  private boatTrackingInterval = -1
  // get lastPositionForBoat() {
  //   return this.$store.getters.getCount;
  // }
  mounted() {
    this.initializeMap();
    this.initializeBoat();
    this.boatTrackingInterval = this.trackBoat();
  }

  beforeDestroy() {
    if (this.map) {
      this.map.dispose();
    }
  }

  initializeMap() {
    this.map = new Map({
      target: this.$refs.map as HTMLElement,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 18,
      }),
    });
  }

  initializeBoat() {
    this.boatFeature = new Feature({
      geometry: new Point([0, 0]),
      name: 'Boat',
    });

    this.boatFeature.setStyle(
      new Style({
        image: new Icon({
          src: require('@/assets/boat-icon.png'),
          scale: 0.05,
          rotateWithView: true,
          rotation: Math.PI / 2,
        }),
      })
    );

    this.boatLayer = new VectorLayer({
      source: new VectorSource({
        features: [this.boatFeature],
      }),
    });

    this.map?.addLayer(this.boatLayer);
  }
  trackBoat(): number {
    return setInterval(() => {
      const { latitude, longitude, heading } = store.getLastPositionForBoat('csobanka')
      // store position
      if (this.isRecording) this.recordedPath.push([longitude, latitude])

      this.moveBoat(longitude, latitude);
    }, 1000);
  }
  private moveBoat(longitude: number, latitude: number) {
    const coordinates = fromLonLat([longitude, latitude]);
    this.boatFeature.setGeometry(new Point(coordinates));
    this.map?.getView().setCenter(coordinates);

    // Calculate rotation based on the previous and current coordinates
    let prevCoordinates = this.boatFeature?.getGeometry()?.getCoordinates();
    if (!prevCoordinates) prevCoordinates = [0, 0];
    const rotation = Math.atan2(
      coordinates[1] - prevCoordinates[1],
      coordinates[0] - prevCoordinates[0]
    );

    // Set the new coordinates and rotation
    this.boatFeature.getGeometry()?.setCoordinates(coordinates);
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    if (!this.isRecording) {
      // Stop recording, if needed
    }
  }
  playRecordedPath() {
    clearInterval(this.boatTrackingInterval)

    if (this.recordedPath.length > 0) {
      let currentIndex = 0;
      const playbackInterval = setInterval(() => {
        const [lon, lat] = this.recordedPath[currentIndex];
        this.moveBoat(lon, lat)
        if (currentIndex >= this.recordedPath.length) {
          clearInterval(playbackInterval);
        }
      }, 1000);
    }
  }
  calculateRotation(coordinates: Coordinate) {
    // const prevCoordinates = this.boatFeature?.getGeometry().getCoordinates();
    // return Math.atan2(coordinates[1] - prevCoordinates[1], coordinates[0] - prevCoordinates[0]);
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
