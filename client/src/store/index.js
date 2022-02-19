import { configureStore } from '@reduxjs/toolkit'
import courseReducer from '../features/course-slice'
import userReducer from '../features/user-slice'
import calculatorReducer from '../features/calculator-slice'
import reviewReducer from '../features/review-slice'
import eventReducer from '../features/event-slice'
import countdownReducer from "../features/countdown-slice";

export default configureStore({
  reducer: {
    course: courseReducer,
    user: userReducer,
    calculator: calculatorReducer,
    review: reviewReducer,
    mainEvent: eventReducer,
    countdown: countdownReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})