"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { ParticipantArrayItem } from "../availability-form/form";

interface MultiSelectProps {
  selected: ParticipantArrayItem[];
  setSelected: React.Dispatch<React.SetStateAction<ParticipantArrayItem[]>>;
}

export function MultiSelect({ selected, setSelected }: MultiSelectProps) {
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getParticipants");
        const data = await response.json();
        const participantData = data[0];

        const participantsArray: ParticipantArrayItem[] = Object.keys(
          participantData
        ).map((id) => ({
          value: id,
          label: participantData[id].name,
        }));

        console.log(participantsArray, "participantsArray");

        setParticipants(participantsArray);
      } catch (error) {
        const participantsArray: ParticipantArrayItem[] = [
          {
            value: "1",
            label: "Adam",
          },
          {
            value: "2",
            label: "Bosco",
          },
          {
            value: "3",
            label: "Catherine",
          },
        ];
        setParticipants(participantsArray);
        console.error("Error fetching participants:", error);
      }
    };

    fetchData();
  }, []);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [participants, setParticipants] = React.useState<
    ParticipantArrayItem[]
  >([]);
  // const [selected, setSelected] = React.useState<ParticipantArrayItem[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback(
    (participants: ParticipantArrayItem) => {
      setSelected((prev) => prev.filter((s) => s.value !== participants.value));
    },
    []
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  const selectables = participants.filter(
    (participants) => !selected.includes(participants)
  );

  console.log(selected, "selected");

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((participants) => {
            return (
              <Badge key={participants?.value} variant="secondary">
                {participants?.label || ""}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(participants);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(participants)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select frameworks..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((participants: ParticipantArrayItem) => {
                  return (
                    <CommandItem
                      key={participants.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, participants]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {participants.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
