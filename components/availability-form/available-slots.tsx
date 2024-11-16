import React from "react";
import Typography from "../ui/typography";
import { AvailabilityResponse } from "@/actions/findSlots";

const AvailableSlots = ({ slots }: { slots: AvailabilityResponse }) => {
  return (
    <div className="bg-brand-skin rounded-md px-10 py-10 max-w-[600px] min-h-40">
      <Typography className="underline">Available Slots</Typography>
      {slots &&
        Object.keys(slots).map((date) => (
          <div key={date}>
            <Typography variant={"sm"} className="font-bold mt-4 mb-2 underline">
              {date}
            </Typography>
            <div className="flex gap-x-1 flex-wrap">
              {slots[date].map((timeSlot, index) => (
                <Typography
                  variant={"sm"}
                  key={`${date}-${index}`}
                  className="w-fit px-1 py-2 bg-brand-purple my-1 rounded-md text-white"
                >
                  {timeSlot}
                </Typography>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AvailableSlots;
