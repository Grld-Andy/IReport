import type { ActivityFeed } from "@/types/ActivityFeed";

export const activityFeeds: Array<ActivityFeed> = [
  {
    name: "Sarah Martinez",
    action: "created incident",
    details: "Reported a multi-vehicle collision on Highway 8 near Exit 14.",
    time: new Date("2026-03-04T08:15:00"),
  },
  {
    name: "Dispatch Unit 12",
    action: "assigned responders",
    details: "Fire Department and EMS dispatched to Downtown Sector 3.",
    time: new Date("2026-03-04T08:18:00"),
  },
  {
    name: "Officer James Liu",
    action: "updated status",
    details: "Traffic diverted. One lane reopened.",
    time: new Date("2026-03-04T08:32:00"),
  },
  {
    name: "EMS Team Bravo",
    action: "medical update",
    details: "Two individuals transported to Mercy General Hospital.",
    time: new Date("2026-03-04T08:45:00"),
  },
  {
    name: "System",
    action: "priority escalated",
    details: "Incident severity upgraded to Level 2.",
    time: new Date("2026-03-04T09:02:00"),
  }
];