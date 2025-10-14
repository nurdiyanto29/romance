"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Heart,
  BookOpenText,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Flower2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

/* ==========================
 * Helper utilities
 * ========================== */
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function titleCase(s: string = "") {
  return s.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );
}

type Slide = {
  title: string;
  text: string;
  emoji?: string;
};

// Tipe aman untuk framer-motion v12
type MotionControls = ReturnType<typeof useAnimation>;

/* ==========================
 * Page
 * ========================== */
export default function ConfessionStorybook() {
  const [dark, setDark] = useState(false);

  // Default nama sesuai permintaan
  const [herName, setHerName] = useState("Tri Eka Wahyuni");
  const [myName, setMyName] = useState("Muhamad Renald Adrian Putra");

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const slides: Slide[] = useMemo(() => {
    const name = titleCase(herName || "Kamu");
    const me = myName || "Aku";
    return [
      {
        title: "Prolog",
        text:
          `Setiap cerita punya halaman pertama. Halamanku dimulai ketika aku bertemu dengan ` +
          name +
          `. Sejak itu, hal-hal kecil terasa lebih hangat.`,
        emoji: "📖",
      },
      {
        title: "Halaman 2",
        text:
          `Aku suka cara ` +
          name +
          ` melihat dunia. Cara tertawa, cara bertanya, dan cara memberi waktu untuk hal-hal sederhana.`,
        emoji: "✨",
      },
      {
        title: "Halaman 3",
        text:
          `Di tengah hari yang bising, percakapan dengan ` +
          name +
          ` rasanya seperti tempat pulang. Aku menjadi ` +
          me +
          ` yang jujur dan utuh.`,
        emoji: "🏠",
      },
      {
        title: "Halaman 4",
        text:
          `Aku ingin menjaga ritme yang baik: pelan, sopan, saling jaga. Jika ` +
          name +
          ` berkenan, maukah kita melanjutkan cerita ini... bersama?`,
        emoji: "💌",
      },
      {
        title: "Bab Penentu",
        text:
          `Ini halaman penting. Jika ` +
          name +
          ` siap, tekan Terima untuk menulis bab berikutnya berdua. Jika belum, tidak apa. Aku akan tetap menghormati perasaanmu.`,
        emoji: "🌹",
      },
    ];
  }, [herName, myName]);

  const atEnd = idx === slides.length - 1;
  const canPrev = idx > 0;
  const canNext = idx < slides.length - 1;

  // Swipe (mobile)
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart: React.TouchEventHandler = (e) => {
    const t = e.changedTouches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    if (Math.abs(dx) > 60) {
      if (dx < 0 && canNext) setIdx((i) => i + 1);
      if (dx > 0 && canPrev) setIdx((i) => i - 1);
    }
    touch.current = null;
  };

  // Tombol Tolak yang lari
  const rejectCtrls = useAnimation();
  const rejectAreaRef = useRef<HTMLDivElement | null>(null);
  const [rejectPos, setRejectPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const moveReject = async () => {
    const box = rejectAreaRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const pad = 12;
    const bw = 140;
    const bh = 44;
    const maxX = Math.max(0, r.width - bw - pad);
    const maxY = Math.max(0, r.height - bh - pad);
    const nx = Math.floor(Math.random() * (maxX + 1));
    const ny = Math.floor(Math.random() * (maxY + 1));
    setRejectPos({ x: nx, y: ny });
    await rejectCtrls.start({
      x: nx,
      y: ny,
      transition: { type: "spring", stiffness: 520, damping: 32 },
    });
  };

  const onAreaMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const radius = 120;
    const btn = e.currentTarget.querySelector(
      "#reject-btn"
    ) as HTMLButtonElement | null;
    if (!btn) return;
    const br = btn.getBoundingClientRect();
    const dx = e.clientX - (br.left + br.width / 2);
    const dy = e.clientY - (br.top + br.height / 2);
    if (Math.hypot(dx, dy) < radius) void moveReject();
  };

  return (
    <div
      className={
        "min-h-screen w-full " +
        (dark
          ? "bg-neutral-950 text-neutral-100"
          : "bg-rose-50 text-neutral-800")
      }
    >
      {/* gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -left-20 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{
            background: "radial-gradient(closest-side, #fecdd3, transparent)",
          }}
        />
        <div
          className="absolute -bottom-24 -right-20 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-40"
          style={{
            background: "radial-gradient(closest-side, #fda4af, transparent)",
          }}
        />
      </div>

      <header className="relative max-w-5xl mx-auto px-6 pt-16 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-white/60">
              <Heart
                className={
                  dark ? "w-6 h-6 text-rose-300" : "w-6 h-6 text-rose-500"
                }
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Confession Storybook
              </h1>
              <p className="text-sm opacity-80">
                Buku cerita romantis—dibaca dari halaman pertama sampai penentu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span>Light</span>
              <Switch checked={dark} onCheckedChange={setDark} />
              <span>Dark</span>
            </div>
            <Badge variant="secondary" className="rounded-full">
              beta
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 pb-20">
        {!started ? (
          <Card className="bg-white/80 backdrop-blur border-rose-100/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenText className="w-5 h-5 text-rose-500" />
                Siapkan Cover Cerita
              </CardTitle>
              <CardDescription>
                Isi nama tokoh utama lalu mulai membaca dari halaman pertama.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Nama dia</Label>
                  <Input
                    placeholder="mis. Dinda"
                    value={herName}
                    onChange={(e) => setHerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Namamu</Label>
                  <Input
                    placeholder="mis. Reno"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                  />
                </div>
                <p className="text-xs opacity-70">
                  Nama akan otomatis dipakai di dalam cerita agar terasa
                  personal.
                </p>
              </div>
              <div className="rounded-2xl border bg-gradient-to-br from-rose-50 to-white p-4">
                <p className="text-sm opacity-70 mb-2">Preview Sampul</p>
                <h3 className="text-xl font-semibold">Cerita Kita</h3>
                <p className="opacity-80 mt-2">
                  Diperankan oleh {titleCase(herName || "Kamu")} dan{" "}
                  {titleCase(myName || "Aku")}.
                </p>
                <Separator className="my-4" />
                <p className="text-sm opacity-80">
                  Ketuk Mulai untuk membuka halaman pertama.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                className="rounded-full bg-rose-500 hover:bg-rose-600"
                onClick={() => {
                  setStarted(true);
                  setIdx(0);
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" /> Mulai Cerita
              </Button>
            </CardFooter>
          </Card>
        ) : !accepted ? (
          <StorySlides
            slides={slides}
            idx={idx}
            setIdx={setIdx}
            canPrev={canPrev}
            canNext={canNext}
            atEnd={atEnd}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            endSlot={
              <EndChapter
                onAccept={() => {
                  setAccepted(true);
                  toast.success("Dia menekan Terima. Bab baru dimulai. ❤️");
                }}
                rejectAreaRef={rejectAreaRef}
                onAreaMove={onAreaMove}
                rejectCtrls={rejectCtrls}
                rejectPos={rejectPos}
                moveReject={moveReject}
              />
            }
          />
        ) : (
          <AcceptedView herName={herName} myName={myName} />
        )}
      </main>
    </div>
  );
}

/* =================== Story Slides =================== */
function StorySlides({
  slides,
  idx,
  setIdx,
  canPrev,
  canNext,
  atEnd,
  onTouchStart,
  onTouchEnd,
  endSlot,
}: {
  slides: Slide[];
  idx: number;
  setIdx: (i: number) => void;
  canPrev: boolean;
  canNext: boolean;
  atEnd: boolean;
  onTouchStart: React.TouchEventHandler;
  onTouchEnd: React.TouchEventHandler;
  endSlot: React.ReactNode;
}) {
  const slide = slides[idx];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  };

  return (
    <Card className="bg-white/80 backdrop-blur border-rose-100/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          {slide.title}
        </CardTitle>
        <CardDescription>
          Halaman {idx + 1} dari {slides.length}
        </CardDescription>
      </CardHeader>
      <CardContent onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="relative rounded-2xl border bg-gradient-to-br from-rose-50 to-white p-6 min-h-[240px] flex items-center">
          <div className="absolute top-3 right-4 text-3xl select-none">
            {slide.emoji}
          </div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28 }}
              className="w-full"
            >
              <p className="leading-relaxed text-lg font-serif whitespace-pre-wrap">
                {slide.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Halaman ${i + 1}`}
              onClick={() => go(i)}
              className={
                "h-2 rounded-full transition-all " +
                (i === idx ? "w-6 bg-rose-500" : "w-2 bg-rose-200")
              }
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2 flex-wrap">
        <Button
          variant="secondary"
          className="rounded-full"
          disabled={!canPrev}
          onClick={() => go(idx - 1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Sebelumnya
        </Button>

        {!atEnd ? (
          <Button
            className="rounded-full bg-rose-500 hover:bg-rose-600"
            disabled={!canNext}
            onClick={() => go(idx + 1)}
          >
            Selanjutnya <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          endSlot
        )}
      </CardFooter>
    </Card>
  );
}

/* =================== End Chapter (Accept / Runaway Reject) =================== */
function EndChapter({
  onAccept,
  rejectAreaRef,
  onAreaMove,
  rejectCtrls,
  rejectPos,
  moveReject,
}: {
  onAccept: () => void;
  rejectAreaRef:
    | React.RefObject<HTMLDivElement | null>
    | React.MutableRefObject<HTMLDivElement | null>;
  onAreaMove: React.MouseEventHandler<HTMLDivElement>;
  rejectCtrls: MotionControls;
  rejectPos: { x: number; y: number };
  moveReject: () => Promise<void>;
}) {
  return (
    <div
      ref={rejectAreaRef as React.RefObject<HTMLDivElement>}
      onMouseMove={onAreaMove}
      className="relative w-full flex items-center justify-center gap-3 py-2"
      style={{ minHeight: 90 }}
    >
      <Button
        className="rounded-full bg-rose-500 hover:bg-rose-600 px-6"
        onClick={onAccept}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" /> Terima
      </Button>

      <motion.button
        id="reject-btn"
        type="button"
        onMouseEnter={moveReject}
        onFocus={moveReject}
        onClick={moveReject}
        animate={rejectCtrls}
        className="absolute left-4 top-4 select-none rounded-full border px-5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 shadow-sm"
        style={{ transform: `translate(${rejectPos.x}px, ${rejectPos.y}px)` }}
      >
        <XCircle className="inline-block w-4 h-4 mr-1" />
        Tolak
      </motion.button>
    </div>
  );
}

/* =================== Accepted View — Romantic Flower Show =================== */
function AcceptedView({
  herName,
  myName,
}: {
  herName: string;
  myName: string;
}) {
  // Kelopak jatuh (ramai tapi elegan)
  const petals = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const left = Math.random() * 100; // %
        const delay = Math.random() * 1.4;
        const duration = 6 + Math.random() * 5;
        const scale = 0.7 + Math.random() * 1.1;
        const rotate =
          (Math.random() > 0.5 ? 1 : -1) * (25 + Math.random() * 45);
        return { id: i, left, delay, duration, scale, rotate };
      }),
    []
  );

  // Bunga bermekaran (blossoms)
  const blossomColors = [
    "linear-gradient(135deg,#fecaca,#fda4af)",
    "linear-gradient(135deg,#fde68a,#fca5a5)",
    "linear-gradient(135deg,#c7d2fe,#fbcfe8)",
    "linear-gradient(135deg,#bbf7d0,#fbcfe8)",
  ] as const;

  const blossoms = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => {
        const x = -140 + i * 28 + (Math.random() * 18 - 9);
        const y = -10 - Math.random() * 12;
        const delay = 0.15 * i + Math.random() * 0.2;
        const size = pick([18, 20, 22, 24]);
        const bg = pick([...blossomColors]);
        return { id: i, x, y, delay, size, bg };
      }),
    []
  );

  // heart burst kecil-kecil
  const hearts = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        x: (i - 3) * 24,
        delay: 0.18 * i,
      })),
    []
  );

  return (
    <Card className="bg-white/80 backdrop-blur border-rose-100/60 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Bab Baru Dimulai
        </CardTitle>
        <CardDescription>
          Selamat. {titleCase(herName || "Dia")} menekan Terima.{" "}
          {titleCase(myName || "Kamu")} & {titleCase(herName || "Dia")} resmi
          membuka bab yang lebih manis.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        {/* romantic gradient halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute -inset-6 -z-10"
        >
          <div
            className="w-full h-full blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(1200px 600px at 50% 0%, #fecdd3 0%, transparent 60%), radial-gradient(900px 500px at 90% 60%, #fda4af 0%, transparent 55%)",
            }}
          />
        </motion.div>

        {/* Heart core */}
        <div className="flex items-center justify-center py-8">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.1, 1], opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-xl"
              style={{
                clipPath:
                  'path("M24 4 C 18 -4, 4 -4, 4 12 C 4 24, 24 32, 24 36 C 24 32, 44 24, 44 12 C 44 -4, 30 -4, 24 4 Z")',
              }}
            />

            {/* Blossom pop-around */}
            {blossoms.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.2, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.2, 1, 1, 0.8],
                  x: b.x,
                  y: b.y,
                  rotate: 360,
                }}
                transition={{
                  duration: 1.8,
                  delay: 0.25 + b.delay,
                  ease: "easeOut",
                }}
                className="absolute left-1/2 top-1/2"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <div
                  style={{
                    width: b.size,
                    height: b.size,
                    background: b.bg,
                    borderRadius: "60% 40% 60% 40% / 60% 40% 60% 40%",
                    boxShadow: "0 3px 10px rgba(253, 164, 175, 0.35)",
                  }}
                />
              </motion.div>
            ))}

            {/* Small hearts rising */}
            {hearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 8, x: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-10, -55, -100],
                  x: [0, h.x, h.x],
                }}
                transition={{
                  duration: 1.6,
                  delay: 0.3 + h.delay,
                  ease: "easeOut",
                }}
                className="absolute left-1/2 top-1/2"
                style={{ transform: "translate(-50%, -50%)" }}
              >
                <Heart className="w-5 h-5 text-rose-500" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* pesan manis */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl border bg-gradient-to-br from-rose-50 to-white p-4"
        >
          <p className="leading-relaxed">
            Bab berikutnya ditulis bersama. Jaga ritme yang baik, saling
            menghormati, dan tetap jadi diri sendiri.
          </p>
          <Separator className="my-4" />
          <p className="text-sm opacity-80">
            — {myName || "Kamu yang berani jujur"}
          </p>
        </motion.div>

        {/* kelopak melayang meriah */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {petals.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -40, rotate: 0, opacity: 0, scale: p.scale }}
              animate={{
                y: ["-8%", "110%"],
                rotate: [0, p.rotate, p.rotate * -0.6, p.rotate * 0.4],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: 0.2 + p.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute"
              style={{ left: `${p.left}%` }}
            >
              <div
                className="w-4 h-4"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #fecdd3 0%, #fda4af 60%, #fb7185 100%)",
                  filter: "blur(0.2px)",
                  borderRadius: "60% 40% 60% 40% / 60% 40% 60% 40%",
                  boxShadow: "0 2px 6px rgba(251,113,133,0.35)",
                }}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button
          className="rounded-full"
          onClick={() => toast.success("Selamat, semoga langgeng!")}
        >
          Simpan Kenangan
        </Button>
      </CardFooter>
    </Card>
  );
}
