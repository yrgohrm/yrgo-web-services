import { tz, TZDate } from '@date-fns/tz'
import { format, parse, constructNow, startOfWeek, endOfWeek, addDays, addWeeks, isAfter, isSaturday, isSunday } from "date-fns"
import { xoshiro128ss } from "./nonrandom.ts"
import { yaml } from "./apidoc.ts"

import type { Config } from "@netlify/functions"
import type { paths } from "./bookings-schema"

type Employee = paths["/bookings"]["get"]["responses"]["200"]["content"]["application/json"][number]

type Booking = Employee["bookings"][number];

type InternalBooking = Omit<Booking, "from" | "to"> & { from: TZDate; to: TZDate }

type Profession = Employee["professions"][number];

type Percentage = Booking["percentage"]

export const config: Config = {
  path: "/bookings"
}

const stockholm = tz("Europe/Stockholm")

const names = [
  "Elena Popescu",
  "Aisha Abdi",
  "Alejandro Rodríguez",
  "Anna Larsson",
  "Charlotte Dupont",
  "Alexander Nyström",
  "Daniel Eriksson",
  "Elin Andersson",
  "Emma Holm",
  "Erik Johansson",
  "Fatima El-Masri",
  "Frida Öhman",
  "Giovanni Ricci",
  "Gustav Pettersson",
  "Hassan Al-Farsi",
  "Ida Magnusson",
  "Johan Svensson",
  "Lars Lindberg",
  "Liam O'Connor",
  "Maja Persson",
  "Marcus Sjöberg",
  "Karin Forsberg",
  "Maria Gonzalez",
  "Oscar Nilsson",
  "Viktor Bergström",
  "Sofia Karlsson",
  "Takahiro Tanaka",
  "Nina Dahl",
];

const getRandomElement = <T>(arr: T[], randomGen: () => number): T => arr[Math.floor(randomGen() * arr.length)];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST",
}

export default async (req: Request) => {
  // set up very liberal CORS policy
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    })
  }
  else if (req.method === "GET") {
    return get(req);
  }

  return error(400)
}

function generateProfessions(nonRandom: () => number): Profession[] {
  const professions: Profession[] = ["Carpenter", "Electrician", "Painter", "Mason", "Plumber"];

  if (nonRandom() < 0.2) {
    return [getRandomElement(professions, nonRandom), getRandomElement(professions, nonRandom)];
  }

  return [getRandomElement(professions, nonRandom)];
}

function generateOneWorkBooking(start: TZDate, professions: Profession[], percentage: Percentage, nonRandom: () => number): InternalBooking {

  if (nonRandom() < 0.25) {
    start = addDays(start, Math.floor(nonRandom() * 4), { in: stockholm });
  }

  const duration = Math.ceil(nonRandom() * 10 + 1);
  let end = addDays(start, duration, { in: stockholm });

  while (isSaturday(end) || isSunday(end)) {
    end = addDays(end, 1, { in: stockholm });
  }

  return {
    activity: getRandomElement(professions, nonRandom),
    from: start,
    to: end,
    percentage,
    status: getRandomElement(["Booked", "Preliminary"], nonRandom),
  };
}

function generateWorkBookings(start: TZDate, professions: Profession[], nonRandom: () => number): InternalBooking[] {
  if (nonRandom() < 0.25) {
    return [generateOneWorkBooking(start, professions, 50, nonRandom), generateOneWorkBooking(start, professions, 50, nonRandom)];
  }

  return [generateOneWorkBooking(start, professions, 100, nonRandom)];
}

function generateAbsentBooking(start: TZDate, nonRandom: () => number): InternalBooking[] {
  const duration = Math.ceil(nonRandom() * 10 + 1);
  let end = addDays(start, duration, { in: stockholm });

  while (isSaturday(end) || isSunday(end)) {
    end = addDays(end, 1, { in: stockholm });
  }

  return [{
    activity: "Other",
    from: start,
    to: end,
    percentage: 100,
    status: "Absent",
  }];
}

function endDate(bookings: InternalBooking[]): TZDate {
  let end = bookings[0].to;

  for (const b of bookings) {
    if (isAfter(b.to, end)) {
      end = b.to
    }
  }

  return end
}

function convertBooking(booking: InternalBooking): Booking {
  return {
    activity: booking.activity,
    percentage: booking.percentage,
    status: booking.status,
    from: format(booking.from, "yyyy-MM-dd", { in: stockholm }),
    to: format(booking.to, "yyyy-MM-dd", { in: stockholm }),
  }
}

function generateBookings(start: TZDate, end: TZDate, professions: Profession[], nonRandom: () => number): Booking[] {
  let currentDate = start;

  const allBookings = [];

  while (isAfter(end, currentDate)) {
    const bookings = (nonRandom() < 0.2)
      ? generateAbsentBooking(currentDate, nonRandom)
      : generateWorkBookings(currentDate, professions, nonRandom);

    currentDate = addDays(endDate(bookings), 1, { in: stockholm });
    while (isSaturday(currentDate) || isSunday(currentDate)) {
      currentDate = addDays(currentDate, 1, { in: stockholm });
    }

    allBookings.push(...bookings);
  }

  return allBookings.map(convertBooking);
}

function generateEmployee(name: string, start: TZDate, end: TZDate, nonRandom: () => number): Employee {
  const professions = generateProfessions(nonRandom);

  const bookings = generateBookings(start, end, professions, nonRandom);

  return {
    name,
    professions,
    bookings,
  };
}

function get(req: Request) {
  const url = new URL(req.url);

  const apidoc = url.searchParams.get("apidoc");
  if (apidoc != null) {
    return new Response(yaml, { status: 200, headers: { "Content-type": "application/json", ...corsHeaders } });
  }

  // this will give us the very same random-looking sequence every time
  const nonRandom = xoshiro128ss(2516329459, 7397229, 3213755023, 2504815977);

  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  const now = TZDate.tz("Europe/Stockholm");

  const start = startParam != null
    ? parse(startParam, "yyyy-MM-dd", now)
    : startOfWeek(constructNow(now), { weekStartsOn: 1, in: stockholm });

  const end = endParam != null
    ? parse(endParam, "yyyy-MM-dd", now)
    : endOfWeek(addWeeks(start, 4, { in: stockholm }), { in: stockholm });

  if (!isAfter(end, start)) {
    return error(400);
  }

  const data: Employee[] = []
  for (const name of names) {
    data.push(generateEmployee(name, start, end, nonRandom))
  }

  const json = JSON.stringify(data)

  return new Response(json, { headers: { "Content-type": "application/json", ...corsHeaders } })
}

function error(status: number): Response {
  return new Response(null, { status, headers: corsHeaders })
}
