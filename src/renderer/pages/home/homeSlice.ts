import { createSlice } from '@reduxjs/toolkit';

export enum Status {
  PROCESSING = 'Đang xử lý',
  LOWER = 'Thấp hơn',
  HIGHER = 'Cao hơn',
  ERROR = 'Lỗi'
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
  limit: number;
};

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    images: [],
    limit: 20,
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
      const tempNum = parseFloat(temperature);
      let status = Status.ERROR;
      if (tempNum <= state.limit) {
        status = Status.LOWER;
      }
      if (tempNum > state.limit) {
        status = Status.HIGHER;
      }
      state.images = state.images.map(image => {
        if (image.id === id) {
          return {
            ...image,
            temperature,
            status: status,
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
