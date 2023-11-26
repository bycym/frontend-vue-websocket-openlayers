/* eslint-disable max-len */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
import { createApp } from 'vue';
import { createStore } from 'vuex';

export type PositionType = {
  latitude: number,
  longitude: number,
  heading: number,
  created: Date,
}

export type BoatType = {
  boatName: string,
  updated: Date,
  positions: Array<PositionType>
}

const store = createStore({
  state: {
    boat: [
      {
        boatName: 'yolo',
        updated: new Date(),
        positions: [
          {
            latitude: 0,
            longitude: 0,
            heading: 0,
            created: new Date(),
          } as PositionType,
          {
            latitude: 0,
            longitude: 0,
            heading: 0,
            created: new Date(new Date().setHours(new Date().getHours() + 2)),
          } as PositionType,
        ] as Array<PositionType>,
      } as BoatType,
    ],
  },
  mutations: {
    ADD_POSITION_TO_BOAT(state, payload: {boatName: string, position: PositionType}): void {
      const { boatName, position } = payload;
      const storedBoat: BoatType | undefined = state.boat.find((boat: BoatType) => boat.boatName === boatName);
      if (!storedBoat) return;
      storedBoat.positions.push(position);
    },
  },
  getters: {
    getLastPositionForBoat(state, boatName: string): PositionType | undefined {
      return state.boat.find((boat: BoatType) => boat.boatName === boatName)?.positions
        .sort((posA: PositionType, posB: PositionType) =>
          posA.created.getTime() - posB.created.getTime())[0];
    },
    // getTodoById: (state) => (id: number) => state.todos.find((todo) => todo.id === id),
  },
  actions: {
    addPositionToBoat({ commit }, payload: {boatName: string, position: PositionType}) {
      commit('ADD_POSITION_TO_BOAT', payload);
    },
  },
});

export default store;
