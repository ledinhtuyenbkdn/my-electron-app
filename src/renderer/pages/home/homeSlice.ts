import { createSlice } from '@reduxjs/toolkit';

export enum Status {
  PROCESSING,
  LOWER,
  HIGHER,
  ERROR
}
export type ImageCard = {
  id: string;
  file: File;
  fileUrl: string;
  fileName: string;
  temperature: string;
  status: Status;
};

export type HomeState = {
  images: ImageCard[];
};

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    images: [],
  } as HomeState,
  reducers: {
    addImage: (state, action) => {
      state.images = [action.payload, ...state.images];
    },
    deleteImage: (state, action) => {
      const id = action.payload;
      state.images = state.images.filter(image => image.id !== id);
    },
    updateTemperature: (state, action) => {
      const { id, temperature } = action.payload;
      state.images = state.images.map(image => {
        if (image.id === id) {
          return {
            ...image,
            temperature,
          }
        } else {
          return image;
        }
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { addImage, deleteImage, updateTemperature } = homeSlice.actions;

export default homeSlice.reducer;
