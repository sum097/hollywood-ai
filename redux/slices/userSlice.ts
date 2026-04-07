import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  uid: string | null;
  email: string | null;
  isLoggedIn: boolean;
  subscriptionPlan: "basic" | "premium" | "vip+" ;
}

const initialState: UserState = {
  uid: null,
  email: null,
  isLoggedIn: false,
  subscriptionPlan: "basic",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ uid: string; email: string }>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.isLoggedIn = false;
      state.subscriptionPlan = "basic";
    },
    setSubscription: (state, action: PayloadAction<"basic" | "premium" | "vip+">) => {
      state.subscriptionPlan = action.payload;
    },
  },
});

export const { setUser, clearUser, setSubscription } = userSlice.actions;
export default userSlice.reducer;