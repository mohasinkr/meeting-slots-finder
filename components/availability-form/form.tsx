"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import DatePicker from "./date-picker";
import { MultiSelect } from "../ui/multi-select";
import { findOverlappingSlot } from "@/actions/findSlots";
import { useState } from "react";
import AvailableSlots from "./available-slots";
import LoadingSpinner from "../ui/loading-spinner";
import { format } from "date-fns";

export type ParticipantArrayItem = {
  value: string;
  label: string;
};

export const FormSchema = z
  .object({
    startDate: z.date({
      required_error: "Start date is required.",
    }),
    endDate: z.date({
      required_error: "End date is required.",
    }),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than start date.",
    path: ["endDate"],
  });

const AvailabilityForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [loading, setLoading] = useState(false);

  const [selectedParticipants, setSelectedParticipants] = useState<
    ParticipantArrayItem[]
  >([]);

  const [availableSlots, setAvailableSlots] = useState({});

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true); // for button spinner

    const finalData = {
      participant_ids: selectedParticipants.map((p) => Number(p.value)),
      date_range: {
        //convert date to dd/MM/yyyy format
        start: format(data.startDate, "dd/MM/yyyy"),
        end: format(data.endDate, "dd/MM/yyyy"),
      },
    };

    console.log(finalData, "data");

    try {
      const response = await findOverlappingSlot(finalData);
      setAvailableSlots(response);
      console.log(response, "response");
    }catch(err){
      console.log(err, "err");
    } finally {
      setLoading(false); // End loading
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-[300px]"
        >
          <MultiSelect
            selected={selectedParticipants}
            setSelected={setSelectedParticipants}
          />
          <DatePicker form={form} name="startDate" label="Start Date" />
          <DatePicker form={form} name="endDate" label="End Date" />
          <Button type="submit" className="w-full">
            {loading ? <LoadingSpinner /> : "Check Slot"}
          </Button>
        </form>
      </Form>
      <AvailableSlots slots={availableSlots} />
    </>
  );
};

export default AvailabilityForm;
