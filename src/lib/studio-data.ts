import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Scissors,
} from "lucide-react";

export type Service = {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "mens-cut",
    name: "Strzyżenie męskie",
    price: "60 zł",
    duration: "45 min",
    description: "Precyzyjne strzyżenie, mycie i stylizacja końcowa.",
  },
  {
    id: "cut-beard",
    name: "Strzyżenie + broda",
    price: "90 zł",
    duration: "60 min",
    description: "Pełna usługa fryzjersko-barberska z konturowaniem.",
  },
  {
    id: "beard",
    name: "Broda",
    price: "45 zł",
    duration: "30 min",
    description: "Trymowanie, kontur i pielęgnacja zarostu.",
  },
  {
    id: "kids-cut",
    name: "Strzyżenie dziecięce",
    price: "50 zł",
    duration: "40 min",
    description: "Spokojna wizyta dla młodszych klientów.",
  },
];

export const timeSlots = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
];

export const salonInfo = [
  {
    label: "Adres",
    value: "ul. Mokotowska 18, 00-561 Warszawa",
    Icon: MapPin,
  },
  {
    label: "Godziny otwarcia",
    value: "Pon-Pt 09:00-20:00, Sob 09:00-15:00",
    Icon: Clock3,
  },
  {
    label: "Telefon",
    value: "+48 512 804 117",
    Icon: Phone,
  },
  {
    label: "E-mail",
    value: "kontakt@studionoir.pl",
    Icon: Mail,
  },
];

export const highlights = [
  { value: "4.9/5", label: "średnia ocen" },
  { value: "12 lat", label: "doświadczenia" },
  { value: "3", label: "stylistów" },
];

export const ScissorsIcon = Scissors;
export const CalendarIcon = CalendarDays;
