// //sample data used for redis injection

export const participants = {
    1: { "name": "Adam", "threshold": 4 },
    2: { "name": "Bosco", "threshold": 4 },
    3: { "name": "Catherine", "threshold": 5 }
};

// Schedules Data for November
export const schedules = {
    1: {
      "01/11/2024": [{ start: "09:00", end: "09:30" }, { start: "15:00", end: "15:30" }],
      "05/11/2024": [{ start: "10:30", end: "11:00" }, { start: "14:30", end: "15:00" }],
      "10/11/2024": [{ start: "13:00", end: "13:30" }]
    },
    2: {
      "01/11/2024": [{ start: "10:00", end: "10:30" }],
      "05/11/2024": [{ start: "09:00", end: "09:30" }, { start: "15:30", end: "16:00" }],
      "10/11/2024": [{ start: "14:00", end: "14:30" }]
    },
    3: {
      "01/11/2024": [{ start: "09:30", end: "10:00" }],
      "05/11/2024": [{ start: "10:00", end: "10:30" }],
      "10/11/2024": [{ start: "10:30", end: "11:00" }]
    }
  };
  
  export const participantAvailability = {
    1: {
      Monday: [{ start: "09:00", end: "11:00" }, { start: "14:00", end: "16:30" }],
      Tuesday: [{ start: "09:00", end: "18:00" }]
    },
    2: {
      Monday: [{ start: "09:00", end: "18:00" }],
      Tuesday: [{ start: "09:00", end: "11:30" }]
    },
    3: {
      Monday: [{ start: "09:00", end: "18:00" }],
      Tuesday: [{ start: "09:00", end: "18:00" }]
    }
  };
  
  // Test Input Data for Checking Availability in November
  export const testInput = {
    participant_ids: [1, 2, 3], // IDs of participants to check availability for
    date_range: {
      start: "01/11/2024", // Start date in November
      end: "10/11/2024"    // End date in November
    }
  };
  