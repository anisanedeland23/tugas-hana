import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  UserCheck,
  ScanLine,
  Brain,
  HeartPulse,
  Calculator,
  FileText,
  Calendar,
  History,
  User,
  Stethoscope,
  Pill,
  ClipboardList,
  BookOpen,
  Activity,
  CheckCircle2,
  Bell,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Send,
  Save,
  Plus,
  Trash2,
  Shield,
  Search,
  Filter,
  Thermometer,
  Wind,
  Droplets,
  ChevronRight,
  LogOut,
  Eye,
  Printer,
  Download,
  X,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import type {
  Role,
  LoginRole,
  NurseView,
  DoctorView,
  PatientView,
  RiskLevel,
} from "./types";

import {
  CREDENTIALS,
  MONTHLY_DATA,
  RISK_DATA,
  MONITOR_DATA,
  PATIENTS,
} from "./data/mockData";

// ── Shared UI Primitives ──────────────────────────────────────────────────────
type ClassValue = string | undefined | false | null | Record<string, boolean>;

function cn(...classes: ClassValue[]) {
  return classes
    .flatMap((item) => {
      if (!item) return [];

      if (typeof item === "string") {
        return [item];
      }

      return Object.entries(item)
        .filter(([, value]) => value)
        .map(([className]) => className);
    })
    .join(" ");
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const map = {
    low: {
      label: "Rendah",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    medium: {
      label: "Sedang",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    high: { label: "Tinggi", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const { label, cls } = map[level];
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-xs font-semibold border font-mono tracking-wide",
        cls,
      )}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    waiting: {
      label: "Menunggu",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    verified: {
      label: "Terverifikasi",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    done: {
      label: "Selesai",
      cls: "bg-slate-50 text-slate-600 border-slate-200",
    },
    reviewing: {
      label: "Review",
      cls: "bg-purple-50 text-purple-700 border-purple-200",
    },
    scheduled: {
      label: "Dijadwalkan",
      cls: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    ongoing: {
      label: "Berlangsung",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };
  const d = map[status] || {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={cn("px-2 py-0.5 rounded text-xs font-medium border", d.cls)}
    >
      {d.label}
    </span>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    cyan: "bg-cyan-50 text-cyan-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="bg-white rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all">
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
          colors[color],
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="font-mono text-2xl font-bold text-foreground leading-none">
        {value}
      </div>
      <div className="text-xs font-semibold text-foreground mt-1.5 leading-tight">
        {title}
      </div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function Btn({
  children,
  variant = "primary",
  onClick,
  className,
  disabled,
}: {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "ghost"
    | "outline"
    | "success";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    danger:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    ghost: "text-foreground hover:bg-accent",
    outline: "border border-border text-foreground hover:bg-accent",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        base,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  unit,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  unit?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-10"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  sub,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  sub?: string;
}) {
  return (
    <label className="flex items-start gap-3 p-2.5 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded accent-primary"
      />
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {sub && (
          <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        )}
      </div>
    </label>
  );
}

function PatientRow({
  p,
  onSelect,
  selected,
}: {
  p: (typeof PATIENTS)[0];
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <tr
      onClick={onSelect}
      className={cn(
        "cursor-pointer transition-colors",
        selected ? "bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      <td className="px-4 py-3">
        <div className="font-semibold text-sm text-foreground">{p.name}</div>
        <div className="text-xs text-muted-foreground font-mono">{p.id}</div>
      </td>
      <td className="px-4 py-3 text-sm text-foreground">{p.age} th</td>
      <td className="px-4 py-3">
        <RiskBadge level={p.risk} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={p.status} />
      </td>
      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
        {p.curb65}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                p.aiScore >= 70
                  ? "bg-red-500"
                  : p.aiScore >= 40
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
              style={{ width: `${p.aiScore}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {p.aiScore}%
          </span>
        </div>
      </td>
    </tr>
  );
}

// ── X-Ray Visual ──────────────────────────────────────────────────────────────
function XrayVisual({
  heatmap = false,
  small = false,
}: {
  heatmap?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative bg-black rounded-lg overflow-hidden",
        small ? "h-48" : "h-80",
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 42%, #3d3d3d 0%, #181818 55%, #080808 100%)",
        }}
      />
      <div
        className="absolute"
        style={{
          left: "13%",
          top: "16%",
          width: "31%",
          height: "62%",
          background:
            "radial-gradient(ellipse, #555 0%, #2c2c2c 65%, transparent 100%)",
          borderRadius: "45% 30% 36% 44% / 44% 30% 56% 46%",
        }}
      />
      <div
        className="absolute"
        style={{
          right: "13%",
          top: "16%",
          width: "31%",
          height: "62%",
          background:
            "radial-gradient(ellipse, #4a4a4a 0%, #2a2a2a 65%, transparent 100%)",
          borderRadius: "30% 45% 44% 36% / 30% 44% 46% 56%",
        }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: "8%",
            right: "8%",
            top: `${20 + i * 10}%`,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 8%, rgba(70,70,70,0.35) 12%, rgba(70,70,70,0.35) 88%, transparent 92%)",
          }}
        />
      ))}
      <div
        className="absolute"
        style={{
          left: "47%",
          top: "8%",
          width: "6%",
          height: "77%",
          background:
            "linear-gradient(180deg, rgba(95,95,95,0.45), rgba(65,65,65,0.4))",
        }}
      />
      {heatmap && (
        <>
          <div
            className="absolute"
            style={{
              right: "15%",
              bottom: "20%",
              width: "26%",
              height: "32%",
              background:
                "radial-gradient(ellipse, rgba(255,50,0,0.62) 0%, rgba(255,130,0,0.4) 45%, rgba(255,210,0,0.18) 70%, transparent 100%)",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute"
            style={{
              right: "19%",
              bottom: "26%",
              width: "13%",
              height: "17%",
              background:
                "radial-gradient(ellipse, rgba(255,10,0,0.88) 0%, rgba(255,55,0,0.55) 55%, transparent 100%)",
              borderRadius: "50%",
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black/70 border border-white/10 rounded px-1.5 py-0.5 flex items-center gap-1">
            <div className="flex gap-0.5">
              {["#22C55E", "#A3E635", "#FCD34D", "#FB923C", "#EF4444"].map(
                (c, i) => (
                  <div
                    key={i}
                    style={{
                      background: c,
                      width: 6,
                      height: 10,
                      borderRadius: 1,
                    }}
                  />
                ),
              )}
            </div>
            <span className="text-white/60 text-[8px] font-mono">
              AI Heatmap
            </span>
          </div>
        </>
      )}
      <div className="absolute top-1.5 left-2 font-mono text-[8px] text-gray-500">
        R
      </div>
      <div className="absolute top-1.5 right-2 font-mono text-[8px] text-gray-500">
        PA
      </div>
      <div className="absolute bottom-1.5 left-2 font-mono text-[9px] text-gray-500 leading-tight">
        <div>RM-2024-0847</div>
        <div>25/06/2024 08:32</div>
      </div>
    </div>
  );
}

// ── Nurse: Dashboard ──────────────────────────────────────────────────────────
function NurseDashboard() {
  return (
    <div>
      <SectionHeader
        title="Dashboard Perawat"
        sub="Ringkasan aktivitas harian — Rabu, 25 Juni 2024"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          title="Pasien Hari Ini"
          value={24}
          sub="+3 dari kemarin"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Menunggu Verifikasi"
          value={8}
          sub="Perlu segera"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Hasil AI Pending"
          value={5}
          sub="Menunggu review"
          icon={Brain}
          color="purple"
        />
        <StatCard
          title="Konsultasi Hari Ini"
          value={12}
          sub="4 berlangsung"
          icon={Calendar}
          color="cyan"
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {(
          [
            ["Risiko Rendah", 9, "Rawat jalan", "emerald", Shield],
            ["Risiko Sedang", 11, "Observasi ketat", "amber", AlertTriangle],
            ["Risiko Tinggi", 4, "Rawat inap", "red", AlertTriangle],
          ] as const
        ).map(([label, val, note, color, Icon]) => (
          <div
            key={label}
            className={cn(
              "rounded-xl p-4 border",
              color === "emerald"
                ? "bg-emerald-50 border-emerald-200"
                : color === "amber"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-red-50 border-red-200",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon
                className={cn(
                  "w-4 h-4",
                  color === "emerald"
                    ? "text-emerald-600"
                    : color === "amber"
                      ? "text-amber-600"
                      : "text-red-600",
                )}
              />
              <span
                className={cn(
                  "text-xs font-semibold",
                  color === "emerald"
                    ? "text-emerald-700"
                    : color === "amber"
                      ? "text-amber-700"
                      : "text-red-700",
                )}
              >
                {label}
              </span>
            </div>
            <div
              className={cn(
                "font-mono text-3xl font-bold",
                color === "emerald"
                  ? "text-emerald-700"
                  : color === "amber"
                    ? "text-amber-700"
                    : "text-red-700",
              )}
            >
              {val}
            </div>
            <div
              className={cn(
                "text-xs mt-1",
                color === "emerald"
                  ? "text-emerald-600"
                  : color === "amber"
                    ? "text-amber-600"
                    : "text-red-600",
              )}
            >
              {note}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Tren Kasus Pneumonia 2024
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_DATA} barSize={18}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="bulan"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(27,79,216,0.05)" }}
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
              <Bar
                key="bar-kasus-nurse"
                name="Kasus"
                dataKey="kasus"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Notifikasi Terbaru
          </h3>
          <div className="space-y-2">
            {[
              {
                type: "high",
                msg: "Budi Santoso — CURB-65 Score 3, perlu rawat inap",
                time: "10 mnt lalu",
              },
              {
                type: "medium",
                msg: "Dewi Rahayu — Hasil AI confidence 84%, menunggu review",
                time: "25 mnt lalu",
              },
              {
                type: "info",
                msg: "Scan X-ray Ahmad Fauzi berhasil diproses AI",
                time: "1 jam lalu",
              },
              {
                type: "schedule",
                msg: "Konsultasi Dr. Hendra Wijaya pukul 14:00 dijadwalkan",
                time: "2 jam lalu",
              },
              {
                type: "low",
                msg: "3 pasien baru mendaftar melalui poli umum",
                time: "3 jam lalu",
              },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
              >
                <div
                  className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", {
                    "bg-red-500": n.type === "high",
                    "bg-amber-500": n.type === "medium",
                    "bg-blue-500": n.type === "info" || n.type === "schedule",
                    "bg-emerald-500": n.type === "low",
                  })}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">
                    {n.msg}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Nurse: Verifikasi Data Pasien ─────────────────────────────────────────────
function VerifikasiPasien({
  patients,
  selectedPatientId,
  onSelectPatient,
}: {
  patients: typeof PATIENTS;
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
}) {
  const [tab, setTab] = useState<"identitas" | "riwayat" | "keluhan">(
    "identitas",
  );

  const p =
    patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];

  const [status, setStatus] = useState<
    null | "verified" | "rejected" | "revision"
  >(null);

  return (
    <div>
      <SectionHeader
        title="Verifikasi Data Pasien"
        sub="Periksa dan validasi data pasien sebelum proses lebih lanjut"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Patient list */}
        <Card className="p-4 lg:col-span-1">
          <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Daftar Pasien
          </h3>

          <div className="space-y-1.5">
            {patients.map((pt) => (
              <button
                key={pt.id}
                onClick={() => {
                  onSelectPatient(pt.id);
                  setStatus(null);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all border",
                  pt.id === selectedPatientId
                    ? "border-primary/30 bg-primary/5"
                    : "border-transparent hover:bg-muted/50",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-foreground">
                    {pt.name}
                  </span>
                  <RiskBadge level={pt.risk} />
                </div>

                <div className="text-xs text-muted-foreground font-mono">
                  {pt.id} · {pt.age} th
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Detail */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex border-b border-border">
              {(["identitas", "riwayat", "keluhan"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "px-5 py-3 text-xs font-semibold capitalize transition-colors border-b-2 -mb-px",
                    tab === t
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "identitas"
                    ? "Data Identitas"
                    : t === "riwayat"
                      ? "Riwayat Penyakit"
                      : "Keluhan"}
                </button>
              ))}
            </div>

            <div className="p-5">
              {tab === "identitas" && (
                <div className="grid grid-cols-2 gap-4">
                  <FieldInput label="Nama Lengkap" value={p.name} readOnly />
                  <FieldInput label="Nomor Rekam Medis" value={p.id} readOnly />
                  <FieldInput label="NIK" value={p.nik} readOnly />
                  <FieldInput label="Tanggal Lahir" value={p.dob} readOnly />
                  <FieldInput label="Umur" value={`${p.age} Tahun`} readOnly />
                  <FieldInput label="Jenis Kelamin" value={p.gender} readOnly />
                  <FieldInput label="Nomor HP" value={p.phone} readOnly />
                  <FieldInput label="BPJS / Asuransi" value={p.bpjs} readOnly />

                  <div className="col-span-2">
                    <FieldInput label="Alamat" value={p.address} readOnly />
                  </div>
                </div>
              )}

              {tab === "riwayat" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ["Diabetes Melitus", p.history.diabetes],
                    ["Hipertensi", p.history.hipertensi],
                    ["PPOK", p.history.ppok],
                    ["Asma Bronkial", p.history.asma],
                    ["Penyakit Jantung", p.history.jantung],
                    ["Riwayat Pneumonia", p.history.pneumonia],
                  ].map(([label, val]) => (
                    <div
                      key={String(label)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border text-sm font-medium",
                        val
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-muted/50 border-border text-muted-foreground",
                      )}
                    >
                      <span>{String(label)}</span>
                      <span
                        className={cn(
                          "font-mono text-xs px-2 py-0.5 rounded",
                          val
                            ? "bg-red-100 text-red-700"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        {val ? "Ya" : "Tidak"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "keluhan" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      ["Batuk", p.complaints.batuk],
                      ["Sesak Napas", p.complaints.sesak],
                      ["Demam", p.complaints.demam],
                      ["Nyeri Dada", p.complaints.nyeri],
                    ].map(([label, val]) => (
                      <div
                        key={String(label)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border text-sm font-medium",
                          val
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-muted/50 border-border text-muted-foreground",
                        )}
                      >
                        <span>{String(label)}</span>
                        <span
                          className={cn(
                            "font-mono text-xs px-2 py-0.5 rounded",
                            val
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-500",
                          )}
                        >
                          {val ? "Ya" : "Tidak"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <FieldInput
                    label="Durasi Gejala"
                    value={p.complaints.durasi}
                    readOnly
                  />
                </div>
              )}
            </div>
          </Card>

          {status && (
            <div
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border text-sm font-medium",
                status === "verified"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : status === "rejected"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-amber-50 border-amber-200 text-amber-700",
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              {status === "verified"
                ? "Data berhasil diverifikasi"
                : status === "rejected"
                  ? "Data ditolak"
                  : "Permintaan perbaikan data dikirim"}
            </div>
          )}

          <div className="flex gap-3">
            <Btn variant="success" onClick={() => setStatus("verified")}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verifikasi Data
            </Btn>

            <Btn variant="danger" onClick={() => setStatus("rejected")}>
              <X className="w-3.5 h-3.5" />
              Tolak Data
            </Btn>

            <Btn variant="outline" onClick={() => setStatus("revision")}>
              <ArrowRight className="w-3.5 h-3.5" />
              Minta Perbaikan
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Nurse: X-Ray Scanner ──────────────────────────────────────────────────────
function XRayScanner() {
  const [uploaded, setUploaded] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [rotate, setRotate] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [quality, setQuality] = useState<null | "valid" | "invalid">(null);

  return (
    <div>
      <SectionHeader
        title="X-Ray Scanner"
        sub="Upload dan validasi citra rontgen dada pasien"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">
                Preview Citra X-Ray
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono text-muted-foreground w-10 text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setRotate((rotate + 90) % 360)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div
              className="overflow-hidden rounded-lg bg-black"
              style={{ transition: "all 0.2s" }}
            >
              <div
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotate}deg)`,
                  transformOrigin: "center",
                  transition: "transform 0.2s",
                }}
              >
                <XrayVisual />
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Btn variant="primary">
              <ScanLine className="w-3.5 h-3.5" />
              Proses dengan AI
            </Btn>
            <Btn variant="outline">
              <RotateCw className="w-3.5 h-3.5" />
              Upload Ulang
            </Btn>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Detail File
            </h3>
            <div className="space-y-2.5">
              {[
                ["Nama File", "xray_budi_25062024.dcm"],
                ["Format", "DICOM (.dcm)"],
                ["Ukuran", "4.2 MB"],
                ["Resolusi", "2048 × 2048 px"],
                ["Tanggal Upload", "25 Jun 2024, 08:32"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-start">
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="text-xs font-mono font-medium text-foreground text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Validasi Gambar
            </h3>
            <div className="space-y-2">
              {[
                ["Kualitas Gambar", true],
                ["Resolusi Memadai", true],
                ["Posisi Dada Benar", true],
              ].map(([label, ok]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <span className="text-xs text-foreground">
                    {String(label)}
                  </span>
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      ok ? "bg-emerald-100" : "bg-red-100",
                    )}
                  >
                    {ok ? (
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <X className="w-3 h-3 text-red-600" />
                    )}
                  </span>
                </div>
              ))}
            </div>
            {quality === null && (
              <div className="flex gap-2 mt-3">
                <Btn
                  variant="success"
                  className="flex-1 justify-center"
                  onClick={() => setQuality("valid")}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Valid
                </Btn>
                <Btn
                  variant="danger"
                  className="flex-1 justify-center"
                  onClick={() => setQuality("invalid")}
                >
                  <X className="w-3.5 h-3.5" />
                  Upload Ulang
                </Btn>
              </div>
            )}
            {quality === "valid" && (
              <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Gambar valid — siap diproses AI
              </div>
            )}
            {quality === "invalid" && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Perlu upload ulang
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Pasien Terpilih
            </h3>
            <div className="space-y-1.5">
              <div className="text-sm font-bold text-foreground">
                Budi Santoso
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                RM-2024-0847 · 67 th
              </div>
              <RiskBadge level="high" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Nurse: Hasil Analisis AI ──────────────────────────────────────────────────
function HasilAnalisisAI() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <SectionHeader
        title="Hasil Analisis AI"
        sub="Hasil pemrosesan X-ray dengan model deep learning pneumonia detection"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Risk Score
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="font-mono text-4xl font-bold text-red-600">
                  87%
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  risiko pneumonia
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full"
                  style={{ width: "87%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs font-semibold text-muted-foreground mb-2">
                Confidence Score
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="font-mono text-4xl font-bold text-blue-600">
                  96%
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  akurasi model
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  style={{ width: "96%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">
                Heatmap Pneumonia
              </h3>
              <RiskBadge level="high" />
            </div>
            <XrayVisual heatmap />
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-semibold text-red-700 mb-1">
                Temuan AI:
              </p>
              <p className="text-xs text-red-600 leading-relaxed">
                "AI mendeteksi infiltrat konsolidasi pada lobus kanan bawah
                dengan confidence 96%. Pola opasitas menunjukkan tanda-tanda
                pneumonia bakterial. Area yang teridentifikasi ditandai dengan
                heatmap merah pada gambar."
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Kategori Risiko
            </h3>
            <div className="space-y-2">
              {(["low", "medium", "high"] as const).map((level) => {
                const map = {
                  low: { label: "Rendah (0–40%)", active: false },
                  medium: { label: "Sedang (40–70%)", active: false },
                  high: { label: "Tinggi (>70%)", active: true },
                };
                const d = map[level];
                return (
                  <div
                    key={level}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-lg border",
                      d.active
                        ? "border-red-300 bg-red-50"
                        : "border-border bg-muted/30",
                    )}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        level === "low"
                          ? "bg-emerald-400"
                          : level === "medium"
                            ? "bg-amber-400"
                            : "bg-red-500",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        d.active
                          ? "text-red-700 font-bold"
                          : "text-muted-foreground",
                      )}
                    >
                      {d.label}
                    </span>
                    {d.active && (
                      <CheckCircle className="w-3.5 h-3.5 text-red-600 ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Pasien
            </h3>
            <div className="space-y-1.5 mb-3">
              <div className="font-bold text-sm text-foreground">
                Budi Santoso
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                RM-2024-0847
              </div>
              <div className="text-xs text-muted-foreground">
                67 th · Laki-laki
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Diproses: 25 Jun 2024, 08:47
            </div>
          </Card>

          {sent ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-medium text-emerald-700">
              <CheckCircle className="w-4 h-4" />
              Berhasil dikirim ke dokter
            </div>
          ) : (
            <div className="space-y-2">
              <Btn
                variant="primary"
                className="w-full justify-center"
                onClick={() => setSent(true)}
              >
                <Send className="w-3.5 h-3.5" />
                Kirim ke Dokter
              </Btn>
              <Btn variant="outline" className="w-full justify-center">
                <Save className="w-3.5 h-3.5" />
                Simpan Draft
              </Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Nurse: Input Tanda Vital ──────────────────────────────────────────────────
function InputTandaVital({
  selectedPatient,
  onUpdatePatientVital,
}: {
  selectedPatient: (typeof PATIENTS)[0];
  onUpdatePatientVital: (
    patientId: string,
    vital: (typeof PATIENTS)[0]["vital"],
  ) => void;
}) {
  const [vals, setVals] = useState(selectedPatient.vital);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setVals(selectedPatient.vital);
    setSaved(false);
  }, [selectedPatient]);

  const set = (k: keyof typeof vals) => (v: string) =>
    setVals((prev) => ({ ...prev, [k]: v }));

  const isCritical =
    parseFloat(vals.spo2) < 92 ||
    parseFloat(vals.suhu) > 38.5 ||
    parseInt(vals.rr) >= 25;

  return (
    <div>
      <SectionHeader
        title="Input Tanda Vital"
        sub="Catat tanda-tanda vital pasien sebelum pemeriksaan dokter"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Pasien: {selectedPatient.name}
                </h3>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">
                  {selectedPatient.id} · {selectedPatient.age} th ·{" "}
                  {selectedPatient.gender}
                </div>
              </div>

              <div className="text-xs text-muted-foreground font-mono">
                25 Jun 2024 · 09:15
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "p-3 rounded-xl border",
                  parseFloat(vals.suhu) > 38.5
                    ? "border-red-200 bg-red-50"
                    : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer
                    className={cn(
                      "w-4 h-4",
                      parseFloat(vals.suhu) > 38.5
                        ? "text-red-500"
                        : "text-muted-foreground",
                    )}
                  />

                  <span className="text-xs font-semibold text-muted-foreground">
                    Suhu Tubuh
                  </span>
                </div>

                <FieldInput
                  label=""
                  value={vals.suhu}
                  onChange={set("suhu")}
                  unit="°C"
                />

                {parseFloat(vals.suhu) > 38.5 && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">
                    ⚠ Demam tinggi
                  </p>
                )}
              </div>

              <div
                className={cn(
                  "p-3 rounded-xl border",
                  parseInt(vals.rr) >= 25
                    ? "border-red-200 bg-red-50"
                    : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wind
                    className={cn(
                      "w-4 h-4",
                      parseInt(vals.rr) >= 25
                        ? "text-red-500"
                        : "text-muted-foreground",
                    )}
                  />

                  <span className="text-xs font-semibold text-muted-foreground">
                    Respiratory Rate
                  </span>
                </div>

                <FieldInput
                  label=""
                  value={vals.rr}
                  onChange={set("rr")}
                  unit="x/mnt"
                />

                {parseInt(vals.rr) >= 25 && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">
                    ⚠ Takipnea
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Heart Rate
                  </span>
                </div>

                <FieldInput
                  label=""
                  value={vals.hr}
                  onChange={set("hr")}
                  unit="bpm"
                />
              </div>

              <div
                className={cn(
                  "p-3 rounded-xl border",
                  parseFloat(vals.spo2) < 92
                    ? "border-red-200 bg-red-50"
                    : "border-border bg-muted/20",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Droplets
                    className={cn(
                      "w-4 h-4",
                      parseFloat(vals.spo2) < 92
                        ? "text-red-500"
                        : "text-muted-foreground",
                    )}
                  />

                  <span className="text-xs font-semibold text-muted-foreground">
                    Saturasi O₂ (SpO₂)
                  </span>
                </div>

                <FieldInput
                  label=""
                  value={vals.spo2}
                  onChange={set("spo2")}
                  unit="%"
                />

                {parseFloat(vals.spo2) < 92 && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">
                    ⚠ Hipoksemia
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Tekanan Darah
                  </span>
                </div>

                <FieldInput
                  label=""
                  value={vals.td}
                  onChange={set("td")}
                  unit="mmHg"
                />
              </div>

              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Berat / Tinggi Badan
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FieldInput
                    label=""
                    value={vals.bb}
                    onChange={set("bb")}
                    unit="kg"
                  />

                  <FieldInput
                    label=""
                    value={vals.tb}
                    onChange={set("tb")}
                    unit="cm"
                  />
                </div>
              </div>
            </div>

            {isCritical && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 font-medium">
                  Perhatian: Beberapa tanda vital menunjukkan kondisi kritis.
                  Segera laporkan ke dokter.
                </p>
              </div>
            )}

            {saved && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tanda vital berhasil disimpan untuk {selectedPatient.name}
              </div>
            )}

            <div className="mt-4">
              <Btn
                variant="primary"
                onClick={() => {
                  onUpdatePatientVital(selectedPatient.id, vals);
                  setSaved(true);
                }}
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Tanda Vital
              </Btn>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Panduan Nilai Normal
            </h3>

            <div className="space-y-2">
              {[
                ["Suhu", "36.5 – 37.5°C"],
                ["RR Dewasa", "12 – 20 x/mnt"],
                ["Heart Rate", "60 – 100 bpm"],
                ["SpO₂", "≥ 95%"],
                ["Tekanan Darah", "< 140/90 mmHg"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono font-medium text-foreground">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Pasien Aktif
            </h3>

            <div className="space-y-1.5">
              <div className="text-sm font-bold text-foreground">
                {selectedPatient.name}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {selectedPatient.id}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedPatient.age} th · {selectedPatient.gender}
              </div>
              <RiskBadge level={selectedPatient.risk} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Nurse: CURB-65 ────────────────────────────────────────────────────────────
function CURB65() {
  const [answers, setAnswers] = useState({
    c: false,
    u: false,
    r: false,
    b: false,
    age: true,
  });
  const score = Object.values(answers).filter(Boolean).length;
  const toggle = (k: keyof typeof answers) =>
    setAnswers((prev) => ({ ...prev, [k]: !prev[k] }));
  const risk = score <= 1 ? "low" : score === 2 ? "medium" : "high";
  const rec =
    score <= 1
      ? "Rawat Jalan"
      : score === 2
        ? "Pertimbangkan Rawat Inap"
        : "Rawat Inap Intensif";
  const recColor =
    risk === "low" ? "emerald" : risk === "medium" ? "amber" : "red";

  return (
    <div>
      <SectionHeader
        title="CURB-65 Scoring"
        sub="Penilaian tingkat keparahan pneumonia komunitas untuk menentukan tata laksana"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Kriteria Penilaian
            </h3>
            <div className="space-y-2.5">
              <Checkbox
                label="C — Confusion (Kebingungan)"
                checked={answers.c}
                onChange={() => toggle("c")}
                sub="Kebingungan baru (disorientasi terhadap orang, tempat, atau waktu)"
              />
              <Checkbox
                label="U — Uremia (BUN > 7 mmol/L)"
                checked={answers.u}
                onChange={() => toggle("u")}
                sub="Blood urea nitrogen > 7 mmol/L atau urea > 19 mg/dL"
              />
              <Checkbox
                label="R — Respiratory Rate ≥ 30 x/menit"
                checked={answers.r}
                onChange={() => toggle("r")}
                sub="Laju napas ≥ 30 kali per menit saat istirahat"
              />
              <Checkbox
                label="B — Blood Pressure Rendah"
                checked={answers.b}
                onChange={() => toggle("b")}
                sub="Sistolik < 90 mmHg atau diastolik ≤ 60 mmHg"
              />
              <Checkbox
                label="65 — Usia ≥ 65 Tahun"
                checked={answers.age}
                onChange={() => toggle("age")}
                sub="Pasien berusia 65 tahun atau lebih"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">
              Hasil Kalkulasi
            </h3>
            <div className="text-center mb-5">
              <div
                className={cn(
                  "inline-flex items-center justify-center w-20 h-20 rounded-full font-mono text-4xl font-bold border-4",
                  risk === "low"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : risk === "medium"
                      ? "bg-amber-50 border-amber-400 text-amber-700"
                      : "bg-red-50 border-red-400 text-red-700",
                )}
              >
                {score}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                dari 5 poin
              </div>
            </div>
            <div className="space-y-1 mb-5">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i < score
                      ? score >= 3
                        ? "bg-red-500"
                        : score === 2
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      : "bg-muted",
                  )}
                />
              ))}
            </div>
            <div
              className={cn(
                "p-3 rounded-xl border text-center",
                recColor === "emerald"
                  ? "bg-emerald-50 border-emerald-200"
                  : recColor === "amber"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-red-50 border-red-200",
              )}
            >
              <div
                className={cn(
                  "text-xs font-semibold mb-1",
                  recColor === "emerald"
                    ? "text-emerald-700"
                    : recColor === "amber"
                      ? "text-amber-700"
                      : "text-red-700",
                )}
              >
                <RiskBadge level={risk} />
              </div>
              <div
                className={cn(
                  "text-sm font-bold mt-2",
                  recColor === "emerald"
                    ? "text-emerald-800"
                    : recColor === "amber"
                      ? "text-amber-800"
                      : "text-red-800",
                )}
              >
                {rec}
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Panduan
            </h3>
            <div className="space-y-2">
              {[
                ["0–1", "Rawat Jalan", "emerald"],
                ["2", "Pertimbangkan Rawat Inap", "amber"],
                ["≥ 3", "Rawat Inap Intensif / ICU", "red"],
              ].map(([sc, label, color]) => (
                <div
                  key={sc}
                  className={cn(
                    "flex items-center gap-2.5 p-2 rounded-lg",
                    color === "emerald"
                      ? "bg-emerald-50"
                      : color === "amber"
                        ? "bg-amber-50"
                        : "bg-red-50",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono font-bold text-sm w-6",
                      color === "emerald"
                        ? "text-emerald-700"
                        : color === "amber"
                          ? "text-amber-700"
                          : "text-red-700",
                    )}
                  >
                    {sc}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      color === "emerald"
                        ? "text-emerald-700"
                        : color === "amber"
                          ? "text-amber-700"
                          : "text-red-700",
                    )}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Nurse: Laporan Awal ───────────────────────────────────────────────────────
function LaporanAwal() {
  const [catatan, setCatatan] = useState(
    "Pasien datang dengan keluhan batuk produktif dan sesak napas sejak 5 hari yang lalu. Riwayat diabetes dan hipertensi. Kondisi umum tampak sakit sedang, GCS 15.",
  );
  const [sent, setSent] = useState(false);
  return (
    <div>
      <SectionHeader
        title="Laporan Awal Perawat"
        sub="Ringkasan kondisi pasien sebelum dikirim ke dokter"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Ringkasan Pasien
            </h3>
            <div className="space-y-3">
              {[
                ["Nama Pasien", "Budi Santoso"],
                ["Rekam Medis", "RM-2024-0847"],
                ["Keluhan Utama", "Batuk, sesak napas, demam 5 hari"],
                ["Hasil AI", "Risk Score 87% · Confidence 96%"],
                ["CURB-65", "Score 3 → Rawat Inap Intensif"],
                ["Suhu", "38.8°C"],
                ["SpO₂", "89% (Hipoksemia)"],
                ["RR", "28 x/menit (Takipnea)"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between items-start gap-4 py-2 border-b border-border/50 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="text-xs font-semibold text-foreground text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Catatan Perawat
            </h3>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none leading-relaxed"
            />
            {sent ? (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Laporan berhasil dikirim ke Dr. Hendra Wijaya
              </div>
            ) : (
              <div className="flex gap-3 mt-4">
                <Btn variant="primary" onClick={() => setSent(true)}>
                  <Send className="w-3.5 h-3.5" />
                  Kirim ke Dokter
                </Btn>
                <Btn variant="outline">
                  <Save className="w-3.5 h-3.5" />
                  Simpan Draft
                </Btn>
                <Btn variant="ghost">
                  <Printer className="w-3.5 h-3.5" />
                  Cetak
                </Btn>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Nurse: Jadwal Konsultasi ──────────────────────────────────────────────────
function JadwalKonsultasi() {
  const schedules = [
    {
      time: "08:00",
      patient: "Ahmad Fauzi",
      doctor: "Dr. Sari Indah, Sp.P",
      status: "done",
      room: "Poli Paru A",
    },
    {
      time: "09:30",
      patient: "Rina Wulandari",
      doctor: "Dr. Hendra Wijaya, Sp.P",
      status: "ongoing",
      room: "Poli Paru B",
    },
    {
      time: "11:00",
      patient: "Dewi Rahayu",
      doctor: "Dr. Hendra Wijaya, Sp.P",
      status: "scheduled",
      room: "Poli Paru B",
    },
    {
      time: "14:00",
      patient: "Budi Santoso",
      doctor: "Dr. Sari Indah, Sp.P",
      status: "waiting",
      room: "Poli Paru A",
    },
    {
      time: "15:30",
      patient: "Muhamad Rizki",
      doctor: "Dr. Bambang Setiawan, Sp.P",
      status: "waiting",
      room: "Poli Paru C",
    },
  ];
  return (
    <div>
      <SectionHeader
        title="Jadwal Konsultasi"
        sub="Daftar jadwal konsultasi dokter hari ini"
      />
      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">
            Rabu, 25 Juni 2024
          </h3>
          <Btn variant="secondary">
            <Plus className="w-3.5 h-3.5" />
            Tambah Jadwal
          </Btn>
        </div>
        <div className="divide-y divide-border">
          {schedules.map((s, i) => (
            <div
              key={i}
              className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
            >
              <div className="font-mono text-sm font-bold text-primary w-12">
                {s.time}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground">
                  {s.patient}
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.doctor} · {s.room}
                </div>
              </div>
              <StatusBadge status={s.status} />
              {s.status === "waiting" && (
                <Btn variant="primary" className="text-xs py-1 px-3">
                  <Bell className="w-3 h-3" />
                  Reminder
                </Btn>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Nurse: Riwayat Pasien ─────────────────────────────────────────────────────
function RiwayatPasien() {
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState("scan");
  const p = PATIENTS[sel];
  const history = {
    scan: [
      {
        date: "25 Jun 2024",
        result: "Infiltrat lobus kanan bawah",
        ai: "87%",
        status: "reviewed",
      },
      { date: "10 Jan 2024", result: "Normal", ai: "12%", status: "reviewed" },
    ],
    curb65: [
      {
        date: "25 Jun 2024",
        score: 3,
        risk: "high" as RiskLevel,
        rec: "Rawat Inap",
      },
      {
        date: "10 Jan 2024",
        score: 1,
        risk: "low" as RiskLevel,
        rec: "Rawat Jalan",
      },
    ],
    diagnosa: [
      {
        date: "25 Jun 2024",
        dx: "Pneumonia Komunitas",
        icd: "J18.9",
        dokter: "Dr. Hendra Wijaya",
      },
      {
        date: "10 Jan 2024",
        dx: "ISPA",
        icd: "J06.9",
        dokter: "Dr. Sari Indah",
      },
    ],
    rawat: [
      {
        date: "10 Jan 2024",
        masuk: "10 Jan 2024",
        keluar: "15 Jan 2024",
        diagnosa: "Pneumonia",
        kamar: "Kelas II / 204B",
      },
    ],
  };
  return (
    <div>
      <SectionHeader
        title="Riwayat Pasien"
        sub="Riwayat lengkap pemeriksaan dan tata laksana pasien"
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="space-y-2">
          {PATIENTS.map((pt, i) => (
            <button
              key={i}
              onClick={() => setSel(i)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all",
                i === sel
                  ? "border-primary/30 bg-primary/5"
                  : "bg-white border-border hover:bg-muted/30",
              )}
            >
              <div className="font-semibold text-sm text-foreground">
                {pt.name}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                {pt.id}
              </div>
              <div className="mt-1">
                <RiskBadge level={pt.risk} />
              </div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-3">
          <Card>
            <div className="flex border-b border-border overflow-x-auto">
              {[
                ["scan", "Riwayat Scan"],
                ["curb65", "CURB-65"],
                ["diagnosa", "Diagnosa"],
                ["rawat", "Rawat Inap"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors",
                    tab === k
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-5">
              {tab === "scan" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Tanggal
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Temuan
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        AI Score
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.scan.map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-muted/30"
                      >
                        <td className="py-3 font-mono text-muted-foreground">
                          {r.date}
                        </td>
                        <td className="py-3 text-foreground">{r.result}</td>
                        <td className="py-3 font-mono font-bold text-foreground">
                          {r.ai}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "curb65" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Tanggal
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Score
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Risiko
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Rekomendasi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.curb65.map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-muted/30"
                      >
                        <td className="py-3 font-mono text-muted-foreground">
                          {r.date}
                        </td>
                        <td className="py-3 font-mono font-bold text-foreground">
                          {r.score}
                        </td>
                        <td className="py-3">
                          <RiskBadge level={r.risk} />
                        </td>
                        <td className="py-3 text-foreground">{r.rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "diagnosa" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Tanggal
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Diagnosis
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        ICD-10
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Dokter
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.diagnosa.map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-muted/30"
                      >
                        <td className="py-3 font-mono text-muted-foreground">
                          {r.date}
                        </td>
                        <td className="py-3 text-foreground font-medium">
                          {r.dx}
                        </td>
                        <td className="py-3 font-mono text-foreground">
                          {r.icd}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {r.dokter}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {tab === "rawat" && (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Masuk
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Keluar
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Diagnosa
                      </th>
                      <th className="text-left py-2 text-muted-foreground font-semibold">
                        Kamar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.rawat.map((r, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/50 hover:bg-muted/30"
                      >
                        <td className="py-3 font-mono text-muted-foreground">
                          {r.masuk}
                        </td>
                        <td className="py-3 font-mono text-muted-foreground">
                          {r.keluar}
                        </td>
                        <td className="py-3 text-foreground">{r.diagnosa}</td>
                        <td className="py-3 text-muted-foreground">
                          {r.kamar}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Doctor: Dashboard ─────────────────────────────────────────────────────────
function DoctorDashboard() {
  return (
    <div>
      <SectionHeader
        title="Dashboard Dokter"
        sub="Ringkasan kasus dan statistik — Rabu, 25 Juni 2024"
      />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatCard title="Total Pasien" value={24} icon={Users} color="blue" />
        <StatCard
          title="Menunggu Diagnosa"
          value={7}
          sub="Perlu review"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Risiko Tinggi"
          value={4}
          sub="Prioritas"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Konsultasi Hari Ini"
          value={12}
          icon={Calendar}
          color="cyan"
        />
        <StatCard
          title="Akurasi AI"
          value="94.2%"
          sub="Bulan ini"
          icon={Brain}
          color="indigo"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Tren Pneumonia Bulanan 2024
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={MONTHLY_DATA}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}
                />
                <Line
                  key="line-kasus-doctor"
                  name="Kasus"
                  type="monotone"
                  dataKey="kasus"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground">
                Pasien Menunggu Diagnosa
              </h3>
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                7 kasus
              </span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Pasien
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Umur
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Risiko
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">
                    AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {PATIENTS.map((p, i) => (
                  <PatientRow
                    key={i}
                    p={p}
                    onSelect={() => {}}
                    selected={false}
                  />
                ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Distribusi Risiko
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={RISK_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {RISK_DATA.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {RISK_DATA.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: d.color }}
                    />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-mono font-bold text-foreground">
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Aksi Prioritas
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-red-700">
                    Budi Santoso
                  </p>
                  <p className="text-xs text-red-600">
                    CURB-65: 3 · AI: 87% · SpO₂: 89%
                  </p>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">
                    Dewi Rahayu
                  </p>
                  <p className="text-xs text-amber-600">
                    Menunggu diagnosa · AI: 62%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Doctor: Detail Pasien ─────────────────────────────────────────────────────
function DetailPasien() {
  const [tab, setTab] = useState("profil");
  const p = PATIENTS[0];
  return (
    <div>
      <SectionHeader
        title="Detail Pasien"
        sub="Informasi lengkap pasien sebelum pemeriksaan dokter"
      />
      <Card>
        <div className="p-5 border-b border-border flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-base text-foreground">{p.name}</h3>
              <RiskBadge level={p.risk} />
              <StatusBadge status={p.status} />
            </div>
            <div className="text-xs text-muted-foreground mt-1 font-mono">
              {p.id} · {p.age} th · {p.gender} · {p.address}
            </div>
          </div>
        </div>
        <div className="flex border-b border-border overflow-x-auto">
          {[
            ["profil", "Profil"],
            ["riwayat", "Riwayat Penyakit"],
            ["pemeriksaan", "Hasil Pemeriksaan"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors",
                tab === k
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "profil" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ["NIK", p.nik],
                ["BPJS", p.bpjs],
                ["Tanggal Lahir", p.dob],
                ["No. HP", p.phone],
                ["Alamat", p.address],
                ["Keluhan Utama", "Batuk, sesak, demam 5 hari"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground mb-0.5">{k}</p>
                  <p className="text-sm font-medium text-foreground">{v}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "riwayat" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                ["Diabetes", p.history.diabetes],
                ["Hipertensi", p.history.hipertensi],
                ["PPOK", p.history.ppok],
                ["Asma", p.history.asma],
                ["Penyakit Jantung", p.history.jantung],
                ["Riwayat Pneumonia", p.history.pneumonia],
              ].map(([k, v]) => (
                <div
                  key={String(k)}
                  className={cn(
                    "p-3 rounded-lg border text-xs font-medium flex justify-between",
                    v
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-muted/40 border-border text-muted-foreground",
                  )}
                >
                  <span>{String(k)}</span>
                  <span>{v ? "Ya" : "Tidak"}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "pemeriksaan" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ["Suhu", p.vital.suhu, "°C"],
                ["SpO₂", p.vital.spo2, "%"],
                ["RR", p.vital.rr, "x/mnt"],
                ["Heart Rate", p.vital.hr, "bpm"],
                ["TD", p.vital.td, "mmHg"],
                ["Berat Badan", p.vital.bb, "kg"],
                ["CURB-65", String(p.curb65), "poin"],
                ["AI Score", String(p.aiScore), "%"],
              ].map(([k, v, u]) => (
                <div
                  key={String(k)}
                  className="p-3 rounded-lg bg-muted/40 border border-border"
                >
                  <p className="text-xs text-muted-foreground mb-1">{k}</p>
                  <p className="font-mono font-bold text-lg text-foreground">
                    {v}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      {u}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ── Doctor: Review Hasil AI ───────────────────────────────────────────────────
function ReviewHasilAI() {
  const [decision, setDecision] = useState<
    null | "agree" | "correct" | "reject"
  >(null);
  const [note, setNote] = useState("");
  return (
    <div>
      <SectionHeader
        title="Review Hasil AI"
        sub="Evaluasi dan validasi hasil analisis AI sebagai alat bantu diagnosis"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Risk Score AI
              </p>
              <p className="font-mono text-3xl font-bold text-red-600 mb-2">
                87%
              </p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full"
                  style={{ width: "87%" }}
                />
              </div>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Confidence AI
              </p>
              <p className="font-mono text-3xl font-bold text-blue-600 mb-2">
                96%
              </p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "96%" }}
                />
              </div>
            </Card>
          </div>
          <Card className="p-4">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Foto X-Ray + Heatmap AI
            </h3>
            <XrayVisual heatmap />
            <div className="mt-3 p-3 bg-slate-50 border border-border rounded-lg">
              <p className="text-xs font-semibold text-foreground mb-1">
                Temuan AI:
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Terdeteksi infiltrat konsolidasi pada lobus kanan bawah dengan
                pola opasitas yang konsisten dengan pneumonia bakterial.
                Confidence 96%. Tidak ditemukan efusi pleura atau
                pneumothoraks."
              </p>
            </div>
          </Card>
          {decision && (
            <Card className="p-4">
              <h3 className="font-bold text-sm text-foreground mb-3">
                Catatan Dokter
              </h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan koreksi atau konfirmasi..."
                className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="mt-3 flex gap-2">
                <Btn variant="primary">
                  <Save className="w-3.5 h-3.5" />
                  Simpan Keputusan
                </Btn>
              </div>
            </Card>
          )}
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Klasifikasi AI
            </h3>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3 text-center">
              <RiskBadge level="high" />
              <p className="text-xs font-bold text-red-700 mt-2">
                Pneumonia Komunitas
              </p>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Model: PneumoNet v3.2</p>
              <p className="font-mono">Diproses: 25/06/2024 08:47</p>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Keputusan Dokter
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setDecision("agree")}
                className={cn(
                  "w-full flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold transition-all",
                  decision === "agree"
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-border hover:border-emerald-300 hover:bg-emerald-50/50 text-foreground",
                )}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Setuju dengan AI
              </button>
              <button
                onClick={() => setDecision("correct")}
                className={cn(
                  "w-full flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold transition-all",
                  decision === "correct"
                    ? "border-amber-400 bg-amber-50 text-amber-700"
                    : "border-border hover:border-amber-300 hover:bg-amber-50/50 text-foreground",
                )}
              >
                <Eye className="w-4 h-4 flex-shrink-0" />
                Koreksi Hasil AI
              </button>
              <button
                onClick={() => setDecision("reject")}
                className={cn(
                  "w-full flex items-center gap-2.5 p-3 rounded-lg border text-xs font-semibold transition-all",
                  decision === "reject"
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-border hover:border-red-300 hover:bg-red-50/50 text-foreground",
                )}
              >
                <X className="w-4 h-4 flex-shrink-0" />
                Tolak Hasil AI
              </button>
            </div>
            {decision && (
              <div
                className={cn(
                  "mt-3 p-2.5 rounded-lg border text-xs font-medium",
                  decision === "agree"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : decision === "correct"
                      ? "bg-amber-50 border-amber-200 text-amber-700"
                      : "bg-red-50 border-red-200 text-red-700",
                )}
              >
                {decision === "agree"
                  ? "✓ Diagnosis AI dikonfirmasi"
                  : decision === "correct"
                    ? "⚠ AI perlu dikoreksi"
                    : "✗ Hasil AI ditolak"}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Doctor: Diagnosa Dokter ───────────────────────────────────────────────────
function DiagnosaDokter() {
  const [diagUtama, setDiagUtama] = useState("Pneumonia Komunitas");
  const [diagSekunder, setDiagSekunder] = useState(
    "Diabetes Melitus, Hipertensi",
  );
  const [icd, setIcd] = useState("J18.9");
  const [severity, setSeverity] = useState("berat");
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <SectionHeader
        title="Diagnosa Dokter"
        sub="Penegakan diagnosis berdasarkan data klinis dan hasil AI"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Diagnosis Pasien: Budi Santoso
            </h3>
            <div className="space-y-4">
              <FieldInput
                label="Diagnosis Utama"
                value={diagUtama}
                onChange={setDiagUtama}
              />
              <FieldInput
                label="Diagnosis Sekunder / Komorbid"
                value={diagSekunder}
                onChange={setDiagSekunder}
              />
              <FieldInput label="Kode ICD-10" value={icd} onChange={setIcd} />
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Tingkat Keparahan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["ringan", "sedang", "berat"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeverity(s)}
                      className={cn(
                        "py-2 rounded-lg border text-xs font-semibold capitalize transition-all",
                        severity === s
                          ? s === "ringan"
                            ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                            : s === "sedang"
                              ? "bg-amber-50 border-amber-400 text-amber-700"
                              : "bg-red-50 border-red-400 text-red-700"
                          : "border-border text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {saved && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Diagnosis berhasil disimpan
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <Btn variant="primary" onClick={() => setSaved(true)}>
                <Save className="w-3.5 h-3.5" />
                Simpan Diagnosis
              </Btn>
              <Btn variant="outline">
                <Printer className="w-3.5 h-3.5" />
                Cetak
              </Btn>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Ringkasan Data Klinis
            </h3>
            <div className="space-y-2">
              {[
                ["AI Risk Score", "87%", "text-red-600"],
                ["CURB-65", "3/5", "text-red-600"],
                ["SpO₂", "89%", "text-red-600"],
                ["Suhu", "38.8°C", "text-amber-600"],
                ["RR", "28 x/mnt", "text-amber-600"],
                ["Tekanan Darah", "148/92 mmHg", "text-foreground"],
              ].map(([k, v, c]) => (
                <div
                  key={k}
                  className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className={cn("text-xs font-mono font-bold", c)}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Doctor: Resep Obat ────────────────────────────────────────────────────────
type Drug = {
  nama: string;
  dosis: string;
  frekuensi: string;
  durasi: string;
  catatan: string;
};
function ResepObat() {
  const [drugs, setDrugs] = useState<Drug[]>([
    {
      nama: "Amoxicillin-Clavulanate",
      dosis: "875/125 mg",
      frekuensi: "2× sehari",
      durasi: "7 hari",
      catatan: "Diminum setelah makan",
    },
    {
      nama: "Azithromycin",
      dosis: "500 mg",
      frekuensi: "1× sehari",
      durasi: "5 hari",
      catatan: "Atypical coverage",
    },
    {
      nama: "N-Acetylcysteine",
      dosis: "200 mg",
      frekuensi: "3× sehari",
      durasi: "10 hari",
      catatan: "Mukolitik",
    },
  ]);
  const [saved, setSaved] = useState(false);
  const add = () =>
    setDrugs((d) => [
      ...d,
      {
        nama: "",
        dosis: "",
        frekuensi: "3× sehari",
        durasi: "7 hari",
        catatan: "",
      },
    ]);
  const remove = (i: number) =>
    setDrugs((d) => d.filter((_, idx) => idx !== i));
  const update = (i: number, k: keyof Drug, v: string) =>
    setDrugs((d) =>
      d.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)),
    );

  return (
    <div>
      <SectionHeader
        title="Resep Obat"
        sub="Penulisan resep farmakologis sesuai panduan tata laksana pneumonia"
      />
      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Budi Santoso — RM-2024-0847
            </h3>
            <p className="text-xs text-muted-foreground">
              25 Juni 2024 · Dr. Hendra Wijaya, Sp.P
            </p>
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={add}>
              <Plus className="w-3.5 h-3.5" />
              Tambah Obat
            </Btn>
            <Btn variant="outline">
              <Printer className="w-3.5 h-3.5" />
              Cetak Resep
            </Btn>
          </div>
        </div>
        <div className="divide-y divide-border">
          {drugs.map((d, i) => (
            <div key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  {i + 1}
                </div>
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="col-span-2 lg:col-span-2">
                    <FieldInput
                      label="Nama Obat"
                      value={d.nama}
                      onChange={(v) => update(i, "nama", v)}
                    />
                  </div>
                  <FieldInput
                    label="Dosis"
                    value={d.dosis}
                    onChange={(v) => update(i, "dosis", v)}
                  />
                  <FieldSelect
                    label="Frekuensi"
                    value={d.frekuensi}
                    onChange={(v) => update(i, "frekuensi", v)}
                    options={[
                      { value: "1× sehari", label: "1× sehari" },
                      { value: "2× sehari", label: "2× sehari" },
                      { value: "3× sehari", label: "3× sehari" },
                      { value: "4× sehari", label: "4× sehari" },
                    ]}
                  />
                  <FieldInput
                    label="Durasi"
                    value={d.durasi}
                    onChange={(v) => update(i, "durasi", v)}
                  />
                  <div className="col-span-2 lg:col-span-4">
                    <FieldInput
                      label="Catatan"
                      value={d.catatan}
                      onChange={(v) => update(i, "catatan", v)}
                      placeholder="Instruksi tambahan..."
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => remove(i)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {saved && (
          <div className="mx-4 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Resep berhasil disimpan ke rekam medis
          </div>
        )}
        <div className="p-4 border-t border-border flex gap-3">
          <Btn variant="primary" onClick={() => setSaved(true)}>
            <Save className="w-3.5 h-3.5" />
            Simpan Resep
          </Btn>
          <Btn variant="secondary">
            <Send className="w-3.5 h-3.5" />
            Kirim ke Farmasi
          </Btn>
        </div>
      </Card>
    </div>
  );
}

// ── Doctor: Rencana Perawatan ─────────────────────────────────────────────────
function RencanaPerawatan() {
  const [rawat, setRawat] = useState<"jalan" | "inap">("inap");
  const [options, setOptions] = useState({
    oksigen: true,
    nebulizer: true,
    fisioterapi: false,
    kontrol: "7 hari",
  });
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <SectionHeader
        title="Rencana Perawatan"
        sub="Rencana tata laksana komprehensif berdasarkan diagnosis dan risiko"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Jenis Perawatan
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(["jalan", "inap"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRawat(type)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    rawat === type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-border/80",
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-bold mb-0.5",
                      rawat === type ? "text-primary" : "text-foreground",
                    )}
                  >
                    Rawat {type === "jalan" ? "Jalan" : "Inap"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {type === "jalan" ? "CURB-65 0–1" : "CURB-65 ≥ 2"}
                  </div>
                </button>
              ))}
            </div>
            <div className="space-y-2.5">
              {[
                [
                  "Terapi Oksigen",
                  "oksigen",
                  "Nasal kanul 3–4 L/menit atau masker non-rebreather",
                ],
                [
                  "Nebulizer",
                  "nebulizer",
                  "Salbutamol + ipratropium 2× sehari",
                ],
                [
                  "Fisioterapi Paru",
                  "fisioterapi",
                  "Postural drainage dan clapping 1× sehari",
                ],
              ].map(([label, key, sub]) => (
                <Checkbox
                  key={key}
                  label={String(label)}
                  checked={options[key as keyof typeof options] as boolean}
                  onChange={(v) => setOptions((o) => ({ ...o, [key]: v }))}
                  sub={String(sub)}
                />
              ))}
              <FieldSelect
                label="Jadwal Kontrol"
                value={options.kontrol}
                onChange={(v) => setOptions((o) => ({ ...o, kontrol: v }))}
                options={[
                  { value: "3 hari", label: "3 hari kemudian" },
                  { value: "5 hari", label: "5 hari kemudian" },
                  { value: "7 hari", label: "7 hari kemudian" },
                  { value: "14 hari", label: "14 hari kemudian" },
                ]}
              />
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
              Ringkasan Rencana
            </h3>
            <div className="space-y-3">
              <div
                className={cn(
                  "p-3 rounded-lg border font-medium text-sm",
                  rawat === "inap"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700",
                )}
              >
                Rawat {rawat === "inap" ? "Inap" : "Jalan"}{" "}
                {rawat === "inap" && "— Bangsal Paru / ICU"}
              </div>
              {options.oksigen && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Terapi Oksigen
                </div>
              )}
              {options.nebulizer && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Nebulizer
                </div>
              )}
              {options.fisioterapi && (
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Fisioterapi Paru
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Kontrol ulang {options.kontrol}
              </div>
            </div>
          </Card>
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Rencana perawatan berhasil disimpan
            </div>
          )}
          <Btn
            variant="primary"
            className="w-full justify-center"
            onClick={() => setSaved(true)}
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Rencana Perawatan
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Doctor: Konsultasi & Edukasi ──────────────────────────────────────────────
function KonsultasiEdukasi() {
  const [sent, setSent] = useState(false);
  const templates = [
    {
      title: "Edukasi Pneumonia",
      content:
        "Pneumonia adalah infeksi paru-paru yang dapat disebabkan oleh bakteri, virus, atau jamur. Penting untuk menyelesaikan seluruh pengobatan antibiotik sesuai resep.",
    },
    {
      title: "Cara Minum Obat",
      content:
        "Antibiotik harus diminum sesuai jadwal dan dosis. Jangan menghentikan pengobatan meskipun sudah merasa lebih baik. Konsumsi obat setelah makan untuk mengurangi efek samping.",
    },
    {
      title: "Pencegahan Penularan",
      content:
        "Tutup mulut dan hidung saat batuk atau bersin. Cuci tangan rutin dengan sabun. Hindari kontak dekat dengan orang yang rentan. Pakai masker bila diperlukan.",
    },
  ];
  const [selected, setSelected] = useState([0, 1]);

  return (
    <div>
      <SectionHeader
        title="Konsultasi & Edukasi Pasien"
        sub="Kirim materi edukasi dan instruksi perawatan kepada pasien"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Template Edukasi
          </h3>
          <div className="space-y-3">
            {templates.map((t, i) => (
              <div
                key={i}
                onClick={() =>
                  setSelected((s) =>
                    s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
                  )
                }
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all",
                  selected.includes(i)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40",
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                      selected.includes(i)
                        ? "bg-primary border-primary"
                        : "border-border",
                    )}
                  >
                    {selected.includes(i) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {t.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  {t.content}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Jadwal Kontrol
            </h3>
            <FieldSelect
              label="Jadwal Kontrol Berikutnya"
              value="7 hari"
              onChange={() => {}}
              options={[
                { value: "3 hari", label: "3 hari (28 Juni 2024)" },
                { value: "7 hari", label: "7 hari (2 Juli 2024)" },
                { value: "14 hari", label: "14 hari (9 Juli 2024)" },
              ]}
            />
            <div className="mt-3">
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Pesan Tambahan untuk Pasien
              </label>
              <textarea
                rows={4}
                defaultValue="Silakan segera ke IGD bila sesak napas semakin berat atau saturasi oksigen di bawah 90%."
                className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </Card>
          {sent ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Materi edukasi berhasil dikirim ke pasien
            </div>
          ) : (
            <Btn
              variant="primary"
              className="w-full justify-center"
              onClick={() => setSent(true)}
            >
              <Send className="w-3.5 h-3.5" />
              Kirim ke Pasien
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Doctor: Monitoring Pasien ─────────────────────────────────────────────────
function MonitoringPasien() {
  const progress = "memburuk";
  return (
    <div>
      <SectionHeader
        title="Monitoring Pasien"
        sub="Pemantauan tanda vital dan perkembangan kondisi pasien"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {[
          ["SpO₂ Terakhir", "89%", "text-red-600", "↓ Menurun"],
          ["Suhu Terakhir", "38.8°C", "text-amber-600", "↑ Meningkat"],
          ["RR Terakhir", "28 /mnt", "text-red-600", "↑ Takipnea"],
        ].map(([k, v, c, note]) => (
          <Card key={String(k)} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{k}</p>
            <p className={cn("font-mono text-3xl font-bold", c)}>{v}</p>
            <p className={cn("text-xs mt-1 font-medium", c)}>{note}</p>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Tren SpO₂ & Suhu
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONITOR_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
              <Line
                key="line-spo2"
                type="monotone"
                dataKey="spo2"
                stroke="#3B82F6"
                strokeWidth={2}
                name="SpO₂ (%)"
                dot={{ r: 3 }}
              />
              <Line
                key="line-suhu"
                type="monotone"
                dataKey="suhu"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Suhu (°C)"
                dot={{ r: 3 }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Tren Respiratory Rate
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONITOR_DATA}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 11,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                }}
              />
              <Line
                key="line-rr"
                type="monotone"
                dataKey="rr"
                stroke="#EF4444"
                strokeWidth={2}
                name="RR (x/mnt)"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-foreground">Status Kondisi</h3>
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs font-bold text-red-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Memburuk
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["Membaik", "Stabil", "Memburuk"] as const).map((s) => (
            <div
              key={s}
              className={cn(
                "p-3 rounded-xl border text-center text-xs font-semibold",
                progress === s.toLowerCase()
                  ? s === "Memburuk"
                    ? "bg-red-50 border-red-300 text-red-700"
                    : s === "Stabil"
                      ? "bg-amber-50 border-amber-300 text-amber-700"
                      : "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "border-border text-muted-foreground",
              )}
            >
              {s}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Doctor: Riwayat Diagnosa ──────────────────────────────────────────────────
function RiwayatDiagnosa() {
  const rows = [
    {
      tgl: "25 Jun 2024",
      dx: "Pneumonia Komunitas",
      dokter: "Dr. Hendra Wijaya",
      terapi: "Amox-Clav, Azithromycin",
      status: "ongoing",
    },
    {
      tgl: "10 Jan 2024",
      dx: "ISPA Atas",
      dokter: "Dr. Sari Indah",
      terapi: "Amoxicillin, Paracetamol",
      status: "done",
    },
    {
      tgl: "15 Mar 2023",
      dx: "Bronkitis Akut",
      dokter: "Dr. Hendra Wijaya",
      terapi: "Doxycycline, Salbutamol",
      status: "done",
    },
  ];
  return (
    <div>
      <SectionHeader
        title="Riwayat Diagnosa"
        sub="Catatan historis diagnosis dan tata laksana pasien"
      />
      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">
            Budi Santoso — RM-2024-0847
          </h3>
          <div className="flex gap-2">
            <Btn variant="outline">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </Btn>
            <Btn variant="ghost">
              <Download className="w-3.5 h-3.5" />
              Ekspor
            </Btn>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Tanggal
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Diagnosa
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Dokter
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Terapi
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3 text-xs font-mono text-muted-foreground">
                  {r.tgl}
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-foreground">
                  {r.dx}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {r.dokter}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {r.terapi}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Doctor: Approval Final ────────────────────────────────────────────────────
function ApprovalFinal() {
  const [validated, setValidated] = useState(false);
  const [approved, setApproved] = useState(false);
  const [closed, setClosed] = useState(false);

  return (
    <div>
      <SectionHeader
        title="Approval Final"
        sub="Validasi dan persetujuan akhir sebelum tata laksana dilaksanakan"
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Ringkasan Kasus Lengkap
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Pasien", "Budi Santoso / RM-2024-0847"],
                ["Diagnosis", "Pneumonia Komunitas (J18.9)"],
                ["Tingkat Keparahan", "Berat — CURB-65: 3"],
                ["AI Risk Score", "87% (Confidence: 96%)"],
                ["Rencana Perawatan", "Rawat Inap + O₂ Terapi"],
                ["Antibiotik", "Amox-Clav + Azithromycin"],
                ["Jadwal Kontrol", "7 hari setelah pulang"],
                ["Dokter", "Dr. Hendra Wijaya, Sp.P"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="p-3 rounded-lg bg-muted/30 border border-border"
                >
                  <p className="text-xs text-muted-foreground mb-0.5">{k}</p>
                  <p className="text-xs font-semibold text-foreground">{v}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Checklist Approval
            </h3>
            <div className="space-y-2">
              {[
                ["Diagnosis telah dikonfirmasi", true],
                ["Resep obat telah ditandatangani", true],
                ["Rencana perawatan telah dibuat", true],
                ["Edukasi pasien telah dikirim", true],
                ["Informed consent telah ditandatangani", false],
              ].map(([label, done]) => (
                <div
                  key={String(label)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    done
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50",
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      done ? "text-emerald-700" : "text-amber-700",
                    )}
                  >
                    {String(label)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-4">
              Tindakan Final
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setValidated(true)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all",
                  validated
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    validated ? "bg-primary" : "bg-muted",
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      "w-4 h-4",
                      validated ? "text-white" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      validated ? "text-primary" : "text-foreground",
                    )}
                  >
                    Validasi Diagnosa
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Konfirmasi kebenaran diagnosis
                  </p>
                </div>
              </button>
              <button
                onClick={() => setApproved(true)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all",
                  approved
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-border hover:border-emerald-300",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    approved ? "bg-emerald-500" : "bg-muted",
                  )}
                >
                  <ClipboardList
                    className={cn(
                      "w-4 h-4",
                      approved ? "text-white" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      approved ? "text-emerald-700" : "text-foreground",
                    )}
                  >
                    Setujui Rencana Perawatan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Terapkan rencana tata laksana
                  </p>
                </div>
              </button>
              <button
                onClick={() => setClosed(true)}
                disabled={!validated || !approved}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all",
                  closed
                    ? "border-slate-400 bg-slate-50"
                    : !validated || !approved
                      ? "border-border opacity-50 cursor-not-allowed"
                      : "border-border hover:border-slate-400",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    closed ? "bg-slate-500" : "bg-muted",
                  )}
                >
                  <X
                    className={cn(
                      "w-4 h-4",
                      closed ? "text-white" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      closed ? "text-slate-700" : "text-foreground",
                    )}
                  >
                    Tutup Kasus
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Selesaikan proses kasus
                  </p>
                </div>
              </button>
            </div>
          </Card>
          {closed && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-700">
                Kasus Selesai
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Tata laksana telah disetujui dan diarsipkan
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Login Page ────────────────────────────────────────────────────────────────
function LoginPage({
  onLogin,
}: {
  onLogin: (role: LoginRole, name: string) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<LoginRole>("nurse");
  const [email, setEmail] = useState(CREDENTIALS.nurse.email);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles: {
    id: LoginRole;
    label: string;
    sub: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }[] = [
    {
      id: "nurse",
      label: "Perawat",
      sub: "Tenaga Keperawatan",
      icon: HeartPulse,
      color: "text-cyan-700",
      bg: "bg-cyan-50",
      border: "border-cyan-300",
    },
    {
      id: "doctor",
      label: "Dokter",
      sub: "Tenaga Medis",
      icon: Stethoscope,
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-300",
    },
    {
      id: "patient",
      label: "Pasien",
      sub: "Portal Pasien",
      icon: User,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-300",
    },
  ];

  const selectRole = (r: LoginRole) => {
    setSelectedRole(r);
    setEmail(CREDENTIALS[r].email);
    setPassword("");
    setError("");
  };

  const handleSubmit = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const cred = CREDENTIALS[selectedRole];
      if (email === cred.email && password === cred.password) {
        onLogin(selectedRole, cred.name);
      } else {
        setError("Email atau kata sandi salah. Silakan coba lagi.");
      }
      setLoading(false);
    }, 800);
  };

  const roleInfo = roles.find((r) => r.id === selectedRole)!;

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] bg-[#0D1F3C] flex-col relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-32 left-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-40 right-10 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">
                PneumoAI
              </div>
              <div className="text-white/40 text-[11px] font-mono">
                RSUD Dr. Hasan Sadikin, Bandung
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Sistem Deteksi
              <br />
              Pneumonia Berbasis
              <br />
              <span className="text-blue-400">Kecerdasan Buatan</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Platform terintegrasi untuk diagnosis pneumonia dengan analisis
              X-ray AI, pemantauan tanda vital real-time, dan koordinasi tim
              medis.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              ["94.2%", "Akurasi AI"],
              ["1,240+", "Kasus Ditangani"],
              ["0.8 dtk", "Waktu Analisis"],
            ].map(([val, label]) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-white/5 border border-white/8"
              >
                <div className="font-mono text-xl font-bold text-white mb-1">
                  {val}
                </div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>

          {/* X-ray mini preview */}
          <div className="flex-1 flex items-end">
            <div className="w-full rounded-2xl overflow-hidden border border-white/10 opacity-70">
              <div className="bg-black/60 px-4 py-2 border-b border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400/70" />
                <div className="w-2 h-2 rounded-full bg-amber-400/70" />
                <div className="w-2 h-2 rounded-full bg-emerald-400/70" />
                <span className="text-white/30 text-[10px] font-mono ml-2">
                  AI Analysis — RM-2024-0847
                </span>
              </div>
              <div className="relative bg-black h-36 flex items-center justify-center gap-6 px-8">
                <XrayVisual heatmap small />
                <div className="space-y-2 flex-shrink-0">
                  {[
                    ["Risk Score", "87%", "text-red-400"],
                    ["Confidence", "96%", "text-blue-400"],
                    ["Status", "Positif", "text-amber-400"],
                  ].map(([k, v, c]) => (
                    <div key={k} className="flex items-center gap-3">
                      <span className="text-white/30 text-[10px] w-20">
                        {k}
                      </span>
                      <span className={cn("font-mono text-xs font-bold", c)}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-foreground">PneumoAI</div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1.5">
              Selamat Datang
            </h2>
            <p className="text-sm text-muted-foreground">
              Pilih jenis akun dan masuk ke sistem
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => selectRole(r.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  selectedRole === r.id
                    ? cn(r.bg, r.border)
                    : "border-border bg-white hover:bg-muted/40",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center",
                    selectedRole === r.id ? cn(r.bg) : "bg-muted",
                  )}
                >
                  <r.icon
                    className={cn(
                      "w-4 h-4",
                      selectedRole === r.id ? r.color : "text-muted-foreground",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-bold",
                    selectedRole === r.id ? r.color : "text-foreground",
                  )}
                >
                  {r.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight",
                    selectedRole === r.id
                      ? r.color + "/70"
                      : "text-muted-foreground",
                  )}
                >
                  {r.sub}
                </span>
              </button>
            ))}
          </div>

          {/* Demo hint */}
          <div
            className={cn(
              "flex items-start gap-2.5 p-3 rounded-xl border mb-5 text-xs",
              roleInfo.bg,
              roleInfo.border,
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white mt-0.5",
                selectedRole === "nurse"
                  ? "bg-cyan-600"
                  : selectedRole === "doctor"
                    ? "bg-indigo-600"
                    : "bg-emerald-600",
              )}
            >
              {CREDENTIALS[selectedRole].avatar}
            </div>
            <div>
              <p className={cn("font-bold mb-0.5", roleInfo.color)}>
                {CREDENTIALS[selectedRole].name}
              </p>
              <p className={cn("font-mono opacity-70", roleInfo.color)}>
                {CREDENTIALS[selectedRole].email} ·{" "}
                {CREDENTIALS[selectedRole].password}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="Masukkan kata sandi..."
                  className="w-full px-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors pr-10"
                />
                <button
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className={cn(
                "w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                "bg-primary text-white hover:bg-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  {selectedRole === "nurse"
                    ? "Masuk sebagai Perawat"
                    : selectedRole === "doctor"
                      ? "Masuk sebagai Dokter"
                      : "Masuk ke Portal Pasien"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2024 PneumoAI · RSUD Dr. Hasan Sadikin Bandung
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Patient Portal ────────────────────────────────────────────────────────────
function PatientPortal({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<PatientView>("dashboard");
  const p = PATIENTS[0];

  const navItems: {
    id: PatientView;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "dashboard", label: "Beranda", icon: LayoutDashboard },
    { id: "hasil", label: "Hasil Pemeriksaan", icon: Brain },
    { id: "terapi", label: "Diagnosa & Terapi", icon: Pill },
    { id: "jadwal", label: "Jadwal Kontrol", icon: Calendar },
    { id: "riwayat", label: "Riwayat", icon: History },
  ];

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <PatientHome />;
      case "hasil":
        return <PatientHasil />;
      case "terapi":
        return <PatientTerapi />;
      case "jadwal":
        return <PatientJadwal />;
      case "riwayat":
        return <PatientRiwayat />;
    }
  };

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#0D1F3C] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">PneumoAI</div>
              <div className="text-white/40 text-[10px] font-mono">
                Portal Pasien
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            BS
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">
              Budi Santoso
            </div>
            <div className="text-white/40 text-[10px] font-mono truncate">
              RM-2024-0847
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                view === item.id
                  ? "bg-emerald-600 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90",
              )}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-white border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Pasien</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {navItems.find((n) => n.id === view)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
            </button>
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white">
              BS
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{renderView()}</main>
      </div>
    </div>
  );
}

function PatientHome() {
  const p = PATIENTS[0];
  return (
    <div>
      <SectionHeader
        title="Selamat Datang, Budi Santoso"
        sub="Informasi pemeriksaan dan kondisi kesehatan Anda"
      />
      {/* Alert */}
      <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-700 mb-0.5">
            Perhatian Penting
          </p>
          <p className="text-xs text-red-600 leading-relaxed">
            Hasil pemeriksaan Anda menunjukkan risiko pneumonia tinggi. Segera
            hubungi dokter atau kunjungi IGD jika sesak napas semakin berat atau
            SpO₂ di bawah 90%.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Status Pemeriksaan"
          value="Aktif"
          sub="Menunggu tindak lanjut"
          icon={Activity}
          color="amber"
        />
        <StatCard
          title="Risiko AI"
          value="87%"
          sub="Terdeteksi pneumonia"
          icon={Brain}
          color="red"
        />
        <StatCard
          title="CURB-65"
          value="3/5"
          sub="Rawat inap dianjurkan"
          icon={Calculator}
          color="red"
        />
        <StatCard
          title="SpO₂ Terakhir"
          value="89%"
          sub="Di bawah normal"
          icon={Droplets}
          color="red"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">Data Diri</h3>
          <div className="space-y-3">
            {[
              ["Nama", p.name],
              ["No. Rekam Medis", p.id],
              ["Tanggal Lahir", p.dob],
              ["BPJS", p.bpjs],
              ["No. HP", p.phone],
              ["Alamat", p.address],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-start gap-4 py-2 border-b border-border/40 last:border-0"
              >
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {k}
                </span>
                <span className="text-xs font-semibold text-foreground text-right">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Tanda Vital Terkini
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Suhu", p.vital.suhu, "°C", parseFloat(p.vital.suhu) > 38.5],
              ["SpO₂", p.vital.spo2, "%", parseFloat(p.vital.spo2) < 95],
              ["Laju Napas", p.vital.rr, "x/mnt", parseInt(p.vital.rr) >= 25],
              ["Detak Jantung", p.vital.hr, "bpm", false],
              ["Tekanan Darah", p.vital.td, "mmHg", false],
              ["Berat Badan", p.vital.bb, "kg", false],
            ].map(([k, v, u, alert]) => (
              <div
                key={String(k)}
                className={cn(
                  "p-3 rounded-xl border",
                  alert
                    ? "bg-red-50 border-red-200"
                    : "bg-muted/30 border-border",
                )}
              >
                <p className="text-xs text-muted-foreground mb-1">{k}</p>
                <p
                  className={cn(
                    "font-mono text-lg font-bold",
                    alert ? "text-red-600" : "text-foreground",
                  )}
                >
                  {v}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    {u}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Diukur: 25 Jun 2024, 09:15
          </div>
        </Card>
      </div>
    </div>
  );
}

function PatientHasil() {
  return (
    <div>
      <SectionHeader
        title="Hasil Pemeriksaan X-Ray"
        sub="Hasil analisis rontgen dada dan pemrosesan AI"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-3">
            Citra Rontgen Dada
          </h3>
          <XrayVisual heatmap />
          <div className="mt-3 flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-red-500/80" />
              Area yang dicurigai AI
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Hasil Analisis AI
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Skor Risiko Pneumonia
                  </span>
                  <span className="font-mono text-sm font-bold text-red-600">
                    87%
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full"
                    style={{ width: "87%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">
                    Tingkat Kepercayaan AI
                  </span>
                  <span className="font-mono text-sm font-bold text-blue-600">
                    96%
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "96%" }}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Keterangan AI
            </h3>
            <div className="p-3 bg-muted/40 rounded-xl border border-border">
              <p className="text-xs text-foreground leading-relaxed">
                "Sistem AI mendeteksi adanya bayangan infiltrat pada bagian
                bawah paru kanan yang konsisten dengan tanda-tanda pneumonia.
                Dokter akan melakukan konfirmasi dan penegakan diagnosis secara
                langsung."
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-red-600">
                Risiko Tinggi — Konsultasi dokter diperlukan
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PatientTerapi() {
  return (
    <div>
      <SectionHeader
        title="Diagnosa & Terapi"
        sub="Diagnosis dokter dan rencana pengobatan yang diberikan"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Diagnosis Dokter
            </h3>
            <div className="space-y-3">
              {[
                ["Diagnosis Utama", "Pneumonia Komunitas"],
                ["Diagnosis Sekunder", "Diabetes Melitus, Hipertensi"],
                ["Kode ICD-10", "J18.9"],
                ["Tingkat Keparahan", "Berat"],
                ["Ditegakkan oleh", "Dr. Hendra Wijaya, Sp.P"],
                ["Tanggal", "25 Juni 2024"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 py-2 border-b border-border/40 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{k}</span>
                  <span className="text-xs font-semibold text-foreground text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-3">
              Rencana Perawatan
            </h3>
            <div className="space-y-2">
              {[
                "Rawat Inap — Bangsal Paru",
                "Terapi Oksigen (nasal kanul 3–4 L/mnt)",
                "Nebulizer 2× sehari",
                "Kontrol ulang 7 hari setelah pulang",
              ].map((v) => (
                <div
                  key={v}
                  className="flex items-center gap-2 text-xs text-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  {v}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">Resep Obat</h3>
          <div className="space-y-3">
            {[
              {
                no: 1,
                nama: "Amoxicillin-Clavulanate",
                dosis: "875/125 mg",
                freq: "2× sehari",
                durasi: "7 hari",
                ket: "Setelah makan",
              },
              {
                no: 2,
                nama: "Azithromycin",
                dosis: "500 mg",
                freq: "1× sehari",
                durasi: "5 hari",
                ket: "Setelah makan",
              },
              {
                no: 3,
                nama: "N-Acetylcysteine",
                dosis: "200 mg",
                freq: "3× sehari",
                durasi: "10 hari",
                ket: "Mukolitik",
              },
              {
                no: 4,
                nama: "Paracetamol",
                dosis: "500 mg",
                freq: "3× sehari (jika demam)",
                durasi: "Sesuai kebutuhan",
                ket: "Setelah makan",
              },
            ].map((d) => (
              <div
                key={d.no}
                className="p-3 rounded-xl bg-muted/30 border border-border"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {d.no}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {d.nama}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {d.dosis} · {d.freq} · {d.durasi}
                    </p>
                    <p className="text-xs text-primary mt-0.5">{d.ket}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PatientJadwal() {
  return (
    <div>
      <SectionHeader
        title="Jadwal Kontrol"
        sub="Jadwal kunjungan dan konsultasi dokter berikutnya"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Jadwal Berikutnya
            </h3>
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-base text-foreground">
                    Rabu, 2 Juli 2024
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pukul 10:00 WIB
                  </p>
                  <p className="text-xs text-primary font-medium mt-1">
                    Dr. Hendra Wijaya, Sp.P · Poli Paru A
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ["Status", "Terjadwal"],
                ["Jenis Kunjungan", "Kontrol Pasca Rawat"],
                ["Persiapan", "Bawa kartu BPJS dan rekam medis"],
                ["Lokasi", "RSUD Dr. Hasan Sadikin, Lt. 2"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between text-xs py-1.5 border-b border-border/30 last:border-0"
                >
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-foreground">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card className="p-5">
          <h3 className="font-bold text-sm text-foreground mb-4">
            Riwayat Kunjungan
          </h3>
          <div className="space-y-3">
            {[
              {
                tgl: "25 Jun 2024",
                ket: "Pemeriksaan awal & scan X-ray",
                dr: "Dr. Hendra Wijaya",
                status: "done",
              },
              {
                tgl: "10 Jan 2024",
                ket: "Kontrol ISPA",
                dr: "Dr. Sari Indah",
                status: "done",
              },
              {
                tgl: "15 Mar 2023",
                ket: "Kontrol bronkitis",
                dr: "Dr. Hendra Wijaya",
                status: "done",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border"
              >
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">
                      {r.tgl}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs font-medium text-foreground">{r.ket}</p>
                  <p className="text-xs text-muted-foreground">{r.dr}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PatientRiwayat() {
  return (
    <div>
      <SectionHeader
        title="Riwayat Pemeriksaan"
        sub="Catatan lengkap pemeriksaan dan diagnosis sebelumnya"
      />
      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Tanggal
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Diagnosis
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Dokter
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                AI Score
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                tgl: "25 Jun 2024",
                dx: "Pneumonia Komunitas",
                dr: "Dr. Hendra Wijaya",
                ai: "87%",
                status: "ongoing",
              },
              {
                tgl: "10 Jan 2024",
                dx: "ISPA",
                dr: "Dr. Sari Indah",
                ai: "12%",
                status: "done",
              },
              {
                tgl: "15 Mar 2023",
                dx: "Bronkitis Akut",
                dr: "Dr. Hendra Wijaya",
                ai: "31%",
                status: "done",
              },
              {
                tgl: "02 Aug 2022",
                dx: "Pneumonia",
                dr: "Dr. Bambang S.",
                ai: "79%",
                status: "done",
              },
            ].map((r, i) => (
              <tr
                key={i}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="px-5 py-3 text-xs font-mono text-muted-foreground">
                  {r.tgl}
                </td>
                <td className="px-5 py-3 text-sm font-semibold text-foreground">
                  {r.dx}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {r.dr}
                </td>
                <td className="px-5 py-3 font-mono text-xs font-bold text-foreground">
                  {r.ai}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Nav Config ────────────────────────────────────────────────────────────────
const NURSE_NAV: { id: NurseView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "verifikasi", label: "Verifikasi Pasien", icon: UserCheck },
  { id: "xray", label: "X-Ray Scanner", icon: ScanLine },
  { id: "ai-hasil", label: "Hasil Analisis AI", icon: Brain },
  { id: "vital", label: "Tanda Vital", icon: HeartPulse },
  { id: "curb65", label: "CURB-65", icon: Calculator },
  { id: "laporan", label: "Laporan Awal", icon: FileText },
  { id: "jadwal", label: "Jadwal Konsultasi", icon: Calendar },
  { id: "riwayat", label: "Riwayat Pasien", icon: History },
];
const DOCTOR_NAV: { id: DoctorView; label: string; icon: React.ElementType }[] =
  [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "detail", label: "Detail Pasien", icon: User },
    { id: "review-ai", label: "Review Hasil AI", icon: Brain },
    { id: "diagnosa", label: "Diagnosa Dokter", icon: Stethoscope },
    { id: "resep", label: "Resep Obat", icon: Pill },
    { id: "rencana", label: "Rencana Perawatan", icon: ClipboardList },
    { id: "edukasi", label: "Konsultasi & Edukasi", icon: BookOpen },
    { id: "monitoring", label: "Monitoring Pasien", icon: Activity },
    { id: "riwayat-dx", label: "Riwayat Diagnosa", icon: History },
    { id: "approval", label: "Approval Final", icon: CheckCircle2 },
  ];

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [session, setSession] = useState<{
    role: LoginRole;
    name: string;
  } | null>(null);
  const [role, setRole] = useState<Role>("nurse");
  const [nurseView, setNurseView] = useState<NurseView>("dashboard");
  const [doctorView, setDoctorView] = useState<DoctorView>("dashboard");

  const [patients, setPatients] = useState(PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState(
    PATIENTS[0]?.id ?? "",
  );

  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];

  if (!session)
    return (
      <LoginPage
        onLogin={(r, name) => {
          setSession({ role: r, name });
          if (r === "nurse" || r === "doctor") setRole(r);
        }}
      />
    );
  if (session.role === "patient")
    return <PatientPortal onLogout={() => setSession(null)} />;

  const nav = role === "nurse" ? NURSE_NAV : DOCTOR_NAV;
  const activeView = role === "nurse" ? nurseView : doctorView;

  const switchRole = (r: Role) => {
    setRole(r);
    if (r === "nurse") setNurseView("dashboard");
    else setDoctorView("dashboard");
  };

  const setView = (v: string) => {
    if (role === "nurse") setNurseView(v as NurseView);
    else setDoctorView(v as DoctorView);
  };

  const renderNurse = () => {
    switch (nurseView) {
      case "dashboard":
        return <NurseDashboard />;
      case "verifikasi":
        return (
          <VerifikasiPasien
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
          />
        );
      case "xray":
        return <XRayScanner />;
      case "ai-hasil":
        return <HasilAnalisisAI />;
      case "vital":
        return (
          <InputTandaVital
            selectedPatient={selectedPatient}
            onUpdatePatientVital={(patientId, vital) => {
              setPatients((prev) =>
                prev.map((patient) =>
                  patient.id === patientId
                    ? {
                        ...patient,
                        vital,
                      }
                    : patient,
                ),
              );
            }}
          />
        );
      case "curb65":
        return <CURB65 />;
      case "laporan":
        return <LaporanAwal />;
      case "jadwal":
        return <JadwalKonsultasi />;
      case "riwayat":
        return <RiwayatPasien />;
    }
  };

  const renderDoctor = () => {
    switch (doctorView) {
      case "dashboard":
        return <DoctorDashboard />;
      case "detail":
        return <DetailPasien />;
      case "review-ai":
        return <ReviewHasilAI />;
      case "diagnosa":
        return <DiagnosaDokter />;
      case "resep":
        return <ResepObat />;
      case "rencana":
        return <RencanaPerawatan />;
      case "edukasi":
        return <KonsultasiEdukasi />;
      case "monitoring":
        return <MonitoringPasien />;
      case "riwayat-dx":
        return <RiwayatDiagnosa />;
      case "approval":
        return <ApprovalFinal />;
    }
  };

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[#0D1F3C] flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">
                PneumoAI
              </div>
              <div className="text-white/40 text-[10px] font-mono">
                v3.2 · RSUD Bandung
              </div>
            </div>
          </div>
        </div>

        {/* Role switcher */}
        <div className="px-3 py-3 border-b border-white/10">
          <div className="flex rounded-lg bg-white/5 p-0.5">
            {(["nurse", "doctor"] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={cn(
                  "flex-1 py-1.5 rounded-md text-xs font-semibold transition-all",
                  role === r
                    ? "bg-primary text-white shadow-sm"
                    : "text-white/50 hover:text-white/80",
                )}
              >
                {r === "nurse" ? "Perawat" : "Dokter"}
              </button>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0",
              session.role === "nurse" ? "bg-cyan-600" : "bg-indigo-600",
            )}
          >
            {CREDENTIALS[session.role]?.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">
              {session.name}
            </div>
            <div className="text-white/40 text-[10px] truncate">
              {CREDENTIALS[session.role]?.sub}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5 scrollbar-hide">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left",
                activeView === item.id
                  ? "bg-primary text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90",
              )}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-white/10">
          <button
            onClick={() => setSession(null)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex-shrink-0 bg-white border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {role === "nurse" ? "Perawat" : "Dokter"}
            </span>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {nav.find((n) => n.id === activeView)?.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Cari pasien, RM..."
                className="text-xs bg-muted/50 border border-border rounded-lg pl-8 pr-3 py-1.5 w-44 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white",
                role === "nurse" ? "bg-cyan-600" : "bg-indigo-600",
              )}
            >
              {role === "nurse" ? "SR" : "HW"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {role === "nurse" ? renderNurse() : renderDoctor()}
        </main>
      </div>
    </div>
  );
}
