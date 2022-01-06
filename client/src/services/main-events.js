import { createAsyncThunk } from '@reduxjs/toolkit'
import { callCloud } from '../utils/cloud'

const FAKE_EVENTS = [
  {
    eventOwner: "Null🐷",
    eventParticipants: [
      {name: "进击的炮灰", availableDate: "2021-12-31", avaliableTimeslots: ["12:00", "18:00"]},
      {name: "Nine1e", availableDate: "2021-12-31", avaliableTimeslots: ["13:00", "19:00"]}
    ],
    name: "UQ例会",
    expectedTime: "2021-12-31 16:00:00"
  },
  {
    eventOwner: "进击的炮灰",
    eventParticipants: [],
    name: "研发例会",
    expectedTime: "2021-12-31 16:00:00"
  },
  {
    eventOwner: "Nine1e",
    eventParticipants: [],
    name: "前端例会",
    expectedTime: "2021-12-31 16:00:00"
  },
  {
    eventOwner: "Arthur",
    eventParticipants: [],
    name: "后端例会",
    expectedTime: "2021-12-31 16:00:00"
  },
  {
    eventOwner: "Jjes",
    eventParticipants: [],
    name: "小红书运营会议",
    expectedTime: "2021-12-31 16:00:00"
  }

]

export const fetchMainEvents = createAsyncThunk(
  "mainEvent/fetchMainEvents",
  async (param) => {
    return FAKE_EVENTS
  }
)