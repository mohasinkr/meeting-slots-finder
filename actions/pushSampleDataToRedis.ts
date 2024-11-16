"use server";

import { participantAvailability, participants, schedules } from "@/constants/sampleData";
import { setRedisData } from "./setRedisData";

export async function pushSampleDataToRedis() {
    await setRedisData("participants", participants);
    await setRedisData("participantAvailability", participantAvailability);
    await setRedisData("schedules", schedules);
}