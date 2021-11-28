import { configureStore } from '@reduxjs/toolkit'
import courseReducer from '../features/course-slice'
import userReducer from '../features/user-slice'
import calculatorReducer from '../features/calculator-slice'

export default configureStore({
  reducer: {
    course: courseReducer,
    user: userReducer,
    calculator: calculatorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})