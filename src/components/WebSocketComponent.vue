<template>
  <div>
    <p>Latitude: {{ latitude }}</p>
    <p>Longitude: {{ longitude }}</p>
    <p>Heading: {{ heading }}</p>

    <div v-if="isLoading">
      <p>Connecting to WebSocket...</p>
      <p>{{ loadingSpinner }}</p>
    </div>

    <p v-if="isWebSocketOpen">WebSocket connection is open.</p>
    <p v-else>WebSocket connection is not open.</p>

  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import 'dotenv/config'
// import WebSocket from 'ws';

export default class WebSocketComponent extends Vue {
  public latitude: number = 0;
  public longitude: number = 0;
  public heading: number = 0;
  public isWebSocketOpen: boolean = false;
  public isLoading: boolean = true;
  public loadingSpinner: string ='';


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
    // this.$options.sockets.onmessage = this.handleWebSocketData;
    // const socket = new WebSocket(`ws://${process.env.BACKEND_ADDRESS}:${process.env.BACKEND_PORT}/ws`);
    const socket = new WebSocket(`ws://localhost:4200/ws`);
    socket.addEventListener('open', () => {
      this.isWebSocketOpen = true;
      this.isLoading = false; // Set loading state to false when the connection is open
    });
    const handleWebSocketData = (event: MessageEvent) => {
      // Parse WebSocket data and update component state
      const data = JSON.parse(event.data);
      this.latitude = data.latitude;
      this.longitude = data.longitude;
      this.heading = data.heading;
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
