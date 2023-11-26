<template>
  <div class="home">
    <WebSocketComponent />
    <MapComponent />
  </div>
</template>

<script lang="ts">
import MapComponent from '@/components/MapComponent.vue';
import WebSocketComponent from '@/components/WebSocketComponent.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
    WebSocketComponent,
    MapComponent,
  },
})
export default class HomeView extends Vue {}
</script>
