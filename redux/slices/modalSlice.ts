import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  view: "login" | "signup" | "forgot";
}

const initialState: ModalState = {
  isOpen: false,
  view: "login",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<"login" | "signup" | "forgot">) => {
      state.isOpen = true;
      state.view = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    switchView: (state, action: PayloadAction<"login" | "signup" | "forgot">) => {
      state.view = action.payload;
    },
  },
});

export const { openModal, closeModal, switchView } = modalSlice.actions;
export default modalSlice.reducer;