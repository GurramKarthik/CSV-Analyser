import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:  {user:null},
    reducers :{
        setUser : (state, action)=>{
            state.user = action.payload
        }
    }

})

export default userSlice.reducer;
export const {setUser} = userSlice.actions
