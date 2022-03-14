import { createSlice } from '@reduxjs/toolkit';

export enum Status {
  PROCESSING = 'Đang xử lý',
  LOWER = 'Thấp hơn',
  HIGHER = 'Cao hơn',
  ERROR = 'Lỗi',
}
export type ImageCard = {
  id: string;
  fileUrl: string;
  fileName: string;
  path: string;
  temperature: number;
  status: Status;
};

export type HomeState = {
  images: ImageCard[];
  limit: number;
  processing: boolean;
};

export const homeSlice = createSlice({
  name: 'home',
  initialState: {
    images: [],
    limit: 20,
    processing: false,
  } as HomeState,
  reducers: {
    addImage: (state, action) => {
      state.images = [action.payload, ...state.images];
    },
    startProcessing: (state) => {
      state.processing = true;
    },
    finishProcessing: (state) => {
      state.processing = false;
    },
    addImages: (state, action) => {
      state.images = [...action.payload, ...state.images];
    },
    deleteImage: (state, action) => {
      const id = action.payload;
      state.images = state.images.filter((image) => image.id !== id);
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
      state.images = state.images.map((image) => {
        if (image.id === id) {
          return {
            ...image,
            temperature: status === Status.ERROR ? 0 : tempNum,
            status,
          };
        }
        return image;
      });
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.images = state.images.map((image) => {
        if (image.status === Status.LOWER || image.status === Status.HIGHER) {
          let newStatus = image.status;
          if (image.temperature <= action.payload) {
            newStatus = Status.LOWER;
          }
          if (image.temperature > action.payload) {
            newStatus = Status.HIGHER;
          }
          return {
            ...image,
            status: newStatus,
          };
        }
        return image;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { addImage, deleteImage, updateTemperature, setLimit, addImages, startProcessing, finishProcessing } =
  homeSlice.actions;

export default homeSlice.reducer;
