export type Role = "nurse" | "doctor";

export type LoginRole = "nurse" | "doctor" | "patient";

export type NurseView =
  | "dashboard"
  | "verifikasi"
  | "xray"
  | "ai-hasil"
  | "vital"
  | "curb65"
  | "laporan"
  | "jadwal"
  | "riwayat";

export type DoctorView =
  | "dashboard"
  | "detail"
  | "review-ai"
  | "diagnosa"
  | "resep"
  | "rencana"
  | "edukasi"
  | "monitoring"
  | "riwayat-dx"
  | "approval";

export type PatientView =
  | "dashboard"
  | "hasil"
  | "terapi"
  | "jadwal"
  | "riwayat";

export type RiskLevel = "low" | "medium" | "high";

export type PatientStatus =
  | "waiting"
  | "verified"
  | "done"
  | "reviewing"
  | "scheduled"
  | "ongoing";

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  nik: string;
  dob: string;
  phone: string;
  address: string;
  bpjs: string;
  risk: RiskLevel;
  status: PatientStatus | string;
  diagnosis: string;
  curb65: number;
  aiScore: number;
  confidence: number;
  history: {
    diabetes: boolean;
    hipertensi: boolean;
    ppok: boolean;
    asma: boolean;
    jantung: boolean;
    pneumonia: boolean;
  };
  complaints: {
    batuk: boolean;
    sesak: boolean;
    demam: boolean;
    nyeri: boolean;
    durasi: string;
  };
  vital: {
    suhu: string;
    rr: string;
    hr: string;
    spo2: string;
    td: string;
    bb: string;
    tb: string;
  };
};
