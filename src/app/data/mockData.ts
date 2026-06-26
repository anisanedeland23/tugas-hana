import type { LoginRole, Patient, RiskLevel } from "../types";

export const CREDENTIALS: Record<
  LoginRole,
  {
    email: string;
    password: string;
    name: string;
    sub: string;
    avatar: string;
  }
> = {
  nurse: {
    email: "siti.rahmawati@rsud.id",
    password: "perawat123",
    name: "Siti Rahmawati, S.Kep",
    sub: "Perawat Poli Paru",
    avatar: "SR",
  },
  doctor: {
    email: "hendra.wijaya@rsud.id",
    password: "dokter123",
    name: "Dr. Hendra Wijaya, Sp.P",
    sub: "Spesialis Paru",
    avatar: "HW",
  },
  patient: {
    email: "budi.santoso@gmail.com",
    password: "pasien123",
    name: "Budi Santoso",
    sub: "RM-2024-0847",
    avatar: "BS",
  },
};

export const MONTHLY_DATA = [
  { bulan: "Jan", kasus: 42 },
  { bulan: "Feb", kasus: 38 },
  { bulan: "Mar", kasus: 55 },
  { bulan: "Apr", kasus: 61 },
  { bulan: "Mei", kasus: 48 },
  { bulan: "Jun", kasus: 52 },
  { bulan: "Jul", kasus: 67 },
  { bulan: "Agu", kasus: 71 },
  { bulan: "Sep", kasus: 58 },
  { bulan: "Okt", kasus: 63 },
  { bulan: "Nov", kasus: 49 },
  { bulan: "Des", kasus: 44 },
];

export const RISK_DATA = [
  { name: "Rendah", value: 35, color: "#22C55E" },
  { name: "Sedang", value: 45, color: "#F59E0B" },
  { name: "Tinggi", value: 20, color: "#EF4444" },
];

export const MONITOR_DATA = [
  { time: "06:00", suhu: 38.5, spo2: 91, rr: 24 },
  { time: "09:00", suhu: 38.8, spo2: 90, rr: 26 },
  { time: "12:00", suhu: 39.1, spo2: 89, rr: 28 },
  { time: "15:00", suhu: 38.6, spo2: 92, rr: 24 },
  { time: "18:00", suhu: 38.2, spo2: 93, rr: 22 },
  { time: "21:00", suhu: 37.9, spo2: 94, rr: 21 },
];

export const PATIENTS: Patient[] = [
  {
    id: "RM-2024-0847",
    name: "Budi Santoso",
    age: 67,
    gender: "Laki-laki",
    nik: "3271081504570003",
    dob: "15 April 1957",
    phone: "0812-3456-7890",
    address: "Jl. Merdeka No. 45, Bandung",
    bpjs: "0001234567890",
    risk: "high" as RiskLevel,
    status: "waiting",
    diagnosis: "Pneumonia Komunitas",
    curb65: 3,
    aiScore: 87,
    confidence: 96,
    history: {
      diabetes: true,
      hipertensi: true,
      ppok: false,
      asma: false,
      jantung: false,
      pneumonia: true,
    },
    complaints: {
      batuk: true,
      sesak: true,
      demam: true,
      nyeri: false,
      durasi: "5 hari",
    },
    vital: {
      suhu: "38.8",
      rr: "28",
      hr: "102",
      spo2: "89",
      td: "148/92",
      bb: "68",
      tb: "165",
    },
  },
  {
    id: "RM-2024-0851",
    name: "Dewi Rahayu",
    age: 52,
    gender: "Perempuan",
    nik: "3271086505720012",
    dob: "25 Mei 1972",
    phone: "0856-7891-2345",
    address: "Jl. Sudirman No. 12, Bandung",
    bpjs: "0009876543210",
    risk: "medium" as RiskLevel,
    status: "verified",
    diagnosis: "Suspek Pneumonia",
    curb65: 2,
    aiScore: 62,
    confidence: 84,
    history: {
      diabetes: false,
      hipertensi: true,
      ppok: false,
      asma: true,
      jantung: false,
      pneumonia: false,
    },
    complaints: {
      batuk: true,
      sesak: true,
      demam: false,
      nyeri: false,
      durasi: "3 hari",
    },
    vital: {
      suhu: "37.9",
      rr: "22",
      hr: "88",
      spo2: "93",
      td: "132/84",
      bb: "58",
      tb: "158",
    },
  },
  {
    id: "RM-2024-0855",
    name: "Ahmad Fauzi",
    age: 45,
    gender: "Laki-laki",
    nik: "3271080307790021",
    dob: "03 Juli 1979",
    phone: "0878-9012-3456",
    address: "Jl. Diponegoro No. 88, Bandung",
    bpjs: "0005432198760",
    risk: "low" as RiskLevel,
    status: "done",
    diagnosis: "Infeksi Saluran Napas Atas",
    curb65: 1,
    aiScore: 23,
    confidence: 78,
    history: {
      diabetes: false,
      hipertensi: false,
      ppok: false,
      asma: false,
      jantung: false,
      pneumonia: false,
    },
    complaints: {
      batuk: true,
      sesak: false,
      demam: true,
      nyeri: false,
      durasi: "2 hari",
    },
    vital: {
      suhu: "37.5",
      rr: "18",
      hr: "82",
      spo2: "97",
      td: "120/78",
      bb: "72",
      tb: "170",
    },
  },
];
