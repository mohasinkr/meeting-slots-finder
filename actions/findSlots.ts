"use server";

import { addMinutes, format, isAfter, isBefore, parse } from "date-fns";
import { getRedisData } from "../lib/getRedisData";
import { FolderInput } from "lucide-react";
// import { participantAvailability, testInput, schedules } from "@/constants/sampleData";

interface Participant {
  name: string;
  threshold: number;
}

interface Availability {
  [day: string]: { start: string; end: string }[];
}

interface Schedule {
  [date: string]: { start: string; end: string }[];
}

interface CheckAvailabilityRequest {
  participant_ids: number[];
  date_range: {
    start: string;
    end: string;
  };
}

export type AvailabilityResponse = {
  [date: string]: string[];
};

export async function findOverlappingSlot(data: CheckAvailabilityRequest): Promise<AvailabilityResponse> {
  const participants = await getRedisData("participants");
  const participantAvailability = await getRedisData("participantAvailability");
  const schedules = await getRedisData("schedules");

  console.log(participants, "participants");
  console.log(participantAvailability, "participantAvailability");
  console.log(schedules, "schedules");

  const availableSlots = checkParticipantAvailableSlots({
    "participant_ids": data.participant_ids,
    date_range: data.date_range,
    participants,
    availability: participantAvailability,
    schedules,
  });
  // const availableSlots = checkParticipantAvailableSlots({
  //   participant_ids: testInput.participant_ids,
  //   date_range: testInput.date_range,
  //   participants,
  //   availability: participantAvailability,
  //   schedules,
  // });

  console.log(availableSlots, "availableSlots");
  return availableSlots;
}

function checkParticipantAvailableSlots({
  participant_ids,
  date_range,
  participants,
  availability,
  schedules,
}: {
  participant_ids: number[];
  date_range: { start: string; end: string };
  participants: { [key: string]: Participant };
  availability: { [key: string]: Availability };
  schedules: { [key: string]: Schedule };
}): AvailabilityResponse {
  const { start, end } = date_range;
  const startDate = parse(start, "dd/MM/yyyy", new Date());
  const endDate = parse(end, "dd/MM/yyyy", new Date());

  const commonSlots: AvailabilityResponse = {};

  // Iterate through the date range
  for (
    let date = startDate;
    isBefore(date, endDate) || format(date, "dd/MM/yyyy") === format(endDate, "dd/MM/yyyy");
    date = addMinutes(date, 1440)
  ) {
    const day = format(date, "EEEE");
    const formattedDate = format(date, "dd/MM/yyyy");

    const participantSlots: string[][] = [];
    participant_ids.forEach((id) => {
      const dailyAvailability = availability[id]?.[day] || [];
      const existingSchedules = schedules[id]?.[formattedDate] || [];

      const slots = get30MinuteSlots(dailyAvailability, existingSchedules, participants[id]?.threshold);
      participantSlots.push(slots);
    });

    // Find common 30-minute slots across all participants
    const dailyCommonSlots = findCommonSlots(participantSlots);
    if (dailyCommonSlots.length > 0) {
      commonSlots[formattedDate] = dailyCommonSlots;
    }
  }

  return commonSlots;
}

function get30MinuteSlots(
  availability: { start: string; end: string }[],
  schedules: { start: string; end: string }[],
  threshold: number
): string[] {
  const slots: string[] = [];

  availability.forEach(({ start, end }) => {
    let currentTime = parse(start, "HH:mm", new Date());
    const endTime = parse(end, "HH:mm", new Date());

    while (isBefore(currentTime, endTime) || format(currentTime, "HH:mm") === format(endTime, "HH:mm")) {
      const slot = `${format(currentTime, "HH:mm")}-${format(addMinutes(currentTime, 30), "HH:mm")}`;
      if (!isSlotConflicted(slot, schedules)) slots.push(slot);
      currentTime = addMinutes(currentTime, 30);
      if (slots.length >= threshold) break;
    }
  });

  return slots;
}

function isSlotConflicted(slot: string, schedules: { start: string; end: string }[]): boolean {
  const [slotStart, slotEnd] = slot.split("-").map((t) => parse(t.trim(), "HH:mm", new Date()));
  return schedules.some(({ start, end }) => {
    const scheduleStart = parse(start, "HH:mm", new Date());
    const scheduleEnd = parse(end, "HH:mm", new Date());
    return isBefore(slotStart, scheduleEnd) && isAfter(slotEnd, scheduleStart);
  });
}

function findCommonSlots(slotsArray: string[][]): string[] {
  if (slotsArray.length === 0) return [];
  return slotsArray.reduce((common, slots) => common.filter((slot) => slots.includes(slot)), slotsArray[0]);
}
