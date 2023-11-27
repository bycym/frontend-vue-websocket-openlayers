<template>
  <div>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <p>Heading: {{ heading }}</p>
    <div v-if="isLoading">
      <p>Connecting to WebSocket...</p>
      <p>{{ loadingSpinner }}</p>
    </div>
    <p v-else>
    <p>WebSocket connection is open.</p>
    </p>

  </div>
</template>

<script lang="ts">
import { PositionType } from '@/store/store.js';
import { throwStatement } from '@babel/types';
import { Vue } from 'vue-class-component';
import store from '@/store/store';


export default class WebSocketComponent extends Vue {
  public isLoading: boolean = true;
  public loadingSpinner: string = '|/-\\';
  public isWebSocketOpen: boolean = false;

  public latitude: number = 0;
  public longitude: number = 0;
  public heading: number = 0;

  data() {
    return {
      latitude: 0,
      longitude: 0,
      heading: 0,
      isWebSocketOpen: false,
      isLoading: true,
      loadingSpinner: '|/-\\',
    };
  }
  mounted() {
    const socket = new WebSocket(`ws://localhost:4200/ws`);
    socket.addEventListener('open', () => {
      this.isWebSocketOpen = true;
      this.isLoading = false; // Set loading state to false when the connection is open
    });
    const handleWebSocketData = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.heading = data.heading;

      const position = {
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        created: new Date(),
      } as PositionType
      console
      store.addPositionToBoat('csobanka', position)
      // this.$store.dispatch({
      //   type: "addPositionToBoat",
      //   // TODO: better handling boatname
      //   payload: { boatName: "botName", position: position },
      // })
    }
    socket.addEventListener('message', handleWebSocketData);
    socket.addEventListener('close', () => {
      this.isWebSocketOpen = false;
      this.isLoading = false; // Set loading state to false when the connection is closed
    });
    // Show loading spinner while connecting
    const spinnerInterval = setInterval(() => {
      if (this.isLoading) {
        this.loadingSpinner = this.loadingSpinner.charAt(this.loadingSpinner.length - 1) + this.loadingSpinner.slice(0, -1);
      } else {
        clearInterval(spinnerInterval); // Stop the loading spinner when the connection is open or closed
      }
    }, 200);
  }
}
</script>

<style scoped>
/* Add your component styles here */
</style>
