"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Music,
  Wand2,
  Calendar,
  Flower2,
  Send,
  Copy,
  Stars,
  Gift,
  MapPin,
  Coffee,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// ==========================
// Helper utilities
// ==========================
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const titleCase = (s = "") =>
  s.replace(
    /\w\S*/g,
    (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  );

const vibes = [
  { key: "sincere", label: "Sincere", hint: "hangat, jujur, tulus" },
  { key: "playful", label: "Playful", hint: "ringan, bercanda sopan" },
  { key: "poetic", label: "Poetic", hint: "puitis, estetik" },
];

const budgets = ["<50K", "50–100K", "100–200K", "200K+", "Surprise me"];

const interestBank = [
  "kopi",
  "buku",
  "film",
  "musik",
  "fotografi",
  "kuliner",
  "jalan sore",
  "pantai",
  "tanaman",
  "kucing",
  "anjing",
  "drama korea",
  "olahraga",
  "museum",
  "pameran",
  "board game",
  "thrift",
  "pasar kaget",
];

const poeticOpeners = [
  "Langit sore hari ini seindah senyummu.",
  "Kalau kata kompas, semua arah membawaku ke kamu.",
  "Hening bukan berarti kosong; kadang hanya ingin mendengar degupmu.",
  "Seandainya kata punya aroma, ucapanku ke kamu pasti wangi melati.",
];

const sincereOpeners = [
  "Aku suka caramu memperhatikan hal-hal kecil.",
  "Kamu bikin hari-hari terasa lebih ringan.",
  "Ngobrol sama kamu itu rasanya kayak pulang.",
  "Aku nyaman jadi diri sendiri di dekatmu.",
];

const playfulOpeners = [
  "Fun fact: kamu bikin algoritma senyumku overfit.",
  "Curiga kamu bukan orang biasa; kamu buff mood +200%.",
  "Boleh nggak aku jadi alasan notif kamu berbunyi?",
  "Warning: ketemu kamu bikin lupa nugas.",
];

const dateIdeas = {
  cheap: [
    {
      title: "Sunset Walk",
      desc: "Jalan sore di taman kota, bawa minuman favorit, foto langit bareng.",
      icon: Sun,
    },
    {
      title: "Coffee Quest",
      desc: "Coba warung kopi kecil yang cozy, main 'tebak catatan rasa'.",
      icon: Coffee,
    },
    {
      title: "Book Swap",
      desc: "Tukar buku favorit seminggu, kasih sticky notes komentar lucu.",
      icon: Gift,
    },
  ],
  medium: [
    {
      title: "Gallery Hop",
      desc: "Kunjungi pameran/museum lokal; pilih karya yang 'kamu banget'.",
      icon: Sparkles,
    },
    {
      title: "Picnic Polaroid",
      desc: "Picnic sederhana + foto polaroid; tulis caption singkat bergantian.",
      icon: Flower2,
    },
    {
      title: "Live Music",
      desc: "Acoustic night; playlist bareng di perjalanan pulang.",
      icon: Music,
    },
  ],
  premium: [
    {
      title: "Hidden Bistro",
      desc: "Dinner kecil di bistro sepi; bawa kartu 'Q&A lucu'.",
      icon: Stars,
    },
    {
      title: "City Stroll",
      desc: "Naik transport umum, turun spontan, cari spot 'kota lama'.",
      icon: MapPin,
    },
    {
      title: "Workshop Bareng",
      desc: "Ikut kelas pottery/painting berdua; simpan karyanya.",
      icon: Wand2,
    },
  ],
};

function generateCompliment({ name, vibe, interests = [], intensity = 50 }) {
  const its = interests.length ? interests : [pick(interestBank)];
  const openers =
    vibe === "poetic"
      ? poeticOpeners
      : vibe === "playful"
      ? playfulOpeners
      : sincereOpeners;
  const opener = pick(openers);

  const lines = [
    opener,
    `Aku pengin kenal kamu lebih dekat—apalagi tentang ${its
      .slice(0, 2)
      .join(" & ")}.`,
    intensity > 70
      ? `Kalau boleh jujur, hatiku makin yakin tiap kali baca pesanmu, ${
          name || ""
        }.`
      : `Mungkin terdengar sederhana, tapi aku suka ritme ngobrol kita, ${
          name || ""
        }.`,
  ].filter(Boolean);

  return lines.join(" \n");
}

function polishMessage(text, vibe, brevity = 70) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .replace(/(banget|bgt|terlalu|pls|plis)/gi, "")
    .trim();
  const tonePrefix =
    vibe === "poetic"
      ? "Nada puitis, lembut:"
      : vibe === "playful"
      ? "Nada santai & ramah:"
      : "Nada tulus & hangat:";
  const shorter =
    cleaned.length > brevity ? cleaned.slice(0, brevity).trim() + "…" : cleaned;
  return `${tonePrefix} ${shorter}`;
}

function pickDateByBudget(budget) {
  if (budget === "<50K" || budget === "50–100K") return pick(dateIdeas.cheap);
  if (budget === "100–200K") return pick(dateIdeas.medium);
  if (budget === "200K+") return pick(dateIdeas.premium);
  // Surprise me
  return pick([...dateIdeas.cheap, ...dateIdeas.medium, ...dateIdeas.premium]);
}

// ==========================
// Main Component
// ==========================
export default function RomancePDKTApp() {
  const [herName, setHerName] = useState("");
  const [myName, setMyName] = useState("");
  const [vibe, setVibe] = useState("sincere");
  const [budget, setBudget] = useState("Surprise me");
  const [interests, setInterests] = useState(["kopi", "musik"]);
  const [intensity, setIntensity] = useState([50]);
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(false);

  const compliment = useMemo(
    () =>
      generateCompliment({
        name: titleCase(herName || ""),
        vibe,
        interests,
        intensity: intensity[0],
      }),
    [herName, vibe, interests, intensity]
  );

  const datePick = useMemo(() => pickDateByBudget(budget), [budget]);
  const polished = useMemo(
    () => polishMessage(message || compliment, vibe, 160),
    [message, compliment, vibe]
  );

  const toggleInterest = (it) => {
    setInterests((prev) =>
      prev.includes(it) ? prev.filter((x) => x !== it) : [...prev, it]
    );
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Tersalin! Kirimkan ke dia dengan senyuman 😊");
    } catch (e) {
      toast.error("Gagal menyalin. Coba lagi ya.");
    }
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
      {/* Decorative gradient header */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-0"
        >
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
        </motion.div>

        <header className="max-w-5xl mx-auto px-6 pt-16 pb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white/70 backdrop-blur shadow-sm border border-white/60">
                <Heart
                  className={
                    "w-6 h-6 " + (dark ? "text-rose-300" : "text-rose-500")
                  }
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Romance PDKT
                </h1>
                <p className="text-sm opacity-80">
                  elegant & sweet toolkit for thoughtful moves
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 opacity-70" />
                <Switch checked={dark} onCheckedChange={setDark} />
                <Moon className="w-4 h-4 opacity-70" />
              </div>
              <Badge variant="secondary" className="rounded-full">
                beta
              </Badge>
            </div>
          </div>

          <div className="mt-8">
            <Card className="border-rose-100/60 bg-white/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  Mulai yang manis, bukan yang lebay
                </CardTitle>
                <CardDescription>
                  Isikan preferensi kecil, biar setiap saran terasa personal &
                  sopan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Namanya</Label>
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
                <div>
                  <Label>Budget Kencan</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {budgets.map((b) => (
                      <Button
                        key={b}
                        type="button"
                        variant={b === budget ? "default" : "secondary"}
                        className={
                          "rounded-full " +
                          (b === budget ? "bg-rose-500 hover:bg-rose-600" : "")
                        }
                        onClick={() => setBudget(b)}
                      >
                        {b}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <Label>Vibe</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vibes.map((v) => (
                      <Button
                        key={v.key}
                        variant={v.key === vibe ? "default" : "outline"}
                        className={
                          "rounded-full " +
                          (v.key === vibe
                            ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500"
                            : "")
                        }
                        onClick={() => setVibe(v.key)}
                      >
                        {v.label}
                        <span className="ml-2 text-xs opacity-70">
                          ({v.hint})
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-3">
                  <Label>Minat dia (klik untuk pilih)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interestBank.map((it) => (
                      <Button
                        key={it}
                        type="button"
                        variant={
                          interests.includes(it) ? "default" : "secondary"
                        }
                        className={
                          "rounded-full " +
                          (interests.includes(it)
                            ? "bg-rose-500 hover:bg-rose-600"
                            : "")
                        }
                        onClick={() => toggleInterest(it)}
                      >
                        {titleCase(it)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between flex-wrap gap-4">
                <div className="w-full md:w-auto">
                  <Label className="mb-2 block">Intensitas ekspresi</Label>
                  <div className="flex items-center gap-4 max-w-md">
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      min={10}
                      max={100}
                      step={10}
                      className="w-56"
                    />
                    <Badge className="rounded-full" variant="outline">
                      {intensity[0]}%
                    </Badge>
                  </div>
                </div>
                <div className="text-sm opacity-80">
                  *Saran otomatis akan menahan kalimat terlalu intens bila
                  &gt;80%
                </div>
              </CardFooter>
            </Card>
          </div>
        </header>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 pb-24">
        <Tabs defaultValue="compliment" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-white/60 backdrop-blur rounded-xl">
            <TabsTrigger
              value="compliment"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg"
            >
              Compliment Studio
            </TabsTrigger>
            <TabsTrigger
              value="date"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg"
            >
              DateCraft
            </TabsTrigger>
            <TabsTrigger
              value="petal"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg"
            >
              Petal Notes
            </TabsTrigger>
            <TabsTrigger
              value="polish"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white rounded-lg"
            >
              Message Polisher
            </TabsTrigger>
          </TabsList>

          {/* Compliment Studio */}
          <TabsContent value="compliment" className="mt-6">
            <Card className="bg-white/80 backdrop-blur border-rose-100/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Kalimat Pembuka yang Tulus
                </CardTitle>
                <CardDescription>
                  Spesifik, hangat, dan sopan. Hindari hyperbole berlebihan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Kamu bisa edit kalau mau</Label>
                  <Textarea
                    rows={6}
                    value={message || compliment}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2"
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      onClick={() =>
                        copyText(
                          (message || compliment) + "\n— " + (myName || "")
                        )
                      }
                      className="rounded-full"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Salin
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setMessage(compliment)}
                      className="rounded-full"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Preview</Label>
                  <Card className="mt-2 border-rose-100/60">
                    <CardContent className="pt-4">
                      <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
                        {message || compliment}
                      </div>
                      <Separator className="my-4" />
                      <div className="flex items-center gap-2 text-sm opacity-80">
                        <Badge variant="outline" className="rounded-full">
                          {titleCase(vibe)}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full">
                          Interests:{" "}
                          {interests.slice(0, 3).map(titleCase).join(", ")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm opacity-70">
                  Tip: sebutkan 1–2 hal spesifik tentang dia; hindari menilai
                  fisik sensitif.
                </div>
                <Button
                  onClick={() =>
                    copyText(
                      `Hai ${titleCase(herName || "")},\n\n${
                        message || compliment
                      }\n\n— ${myName || ""}`
                    )
                  }
                  className="rounded-full bg-rose-500 hover:bg-rose-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Copy Ajakan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* DateCraft */}
          <TabsContent value="date" className="mt-6">
            <Card className="bg-white/80 backdrop-blur border-rose-100/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-500" />
                  Ide Kencan Manis
                </CardTitle>
                <CardDescription>Disesuaikan budget & vibe.</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="p-4 rounded-2xl border bg-gradient-to-br from-rose-50 to-white">
                    <div className="flex items-center gap-3">
                      <datePick.icon className="w-6 h-6 text-rose-500" />
                      <h3 className="text-lg font-semibold">
                        {datePick.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm opacity-80">{datePick.desc}</p>
                    <Separator className="my-4" />
                    <div className="text-sm">
                      <p className="font-medium">Ajakan siap kirim:</p>
                      <p className="mt-2 rounded-xl border p-3 bg-white/70">
                        Hai {titleCase(herName || "")},{" "}
                        {vibe === "playful"
                          ? "gimana kalau"
                          : vibe === "poetic"
                          ? "bagaimana kalau"
                          : "kalau kamu berkenan"}{" "}
                        kita {datePick.title.toLowerCase()} akhir pekan ini? Aku
                        pikir ini cocok sama {interests[0] || "kamu"}. 💐
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Catatan untukmu</Label>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>• Pastikan waktunya nyaman untuk dia.</li>
                    <li>• Punya rencana cadangan (cuaca/rame).</li>
                    <li>• Simpan obrolan yang bikin dia nyaman.</li>
                  </ul>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      className="rounded-full"
                      onClick={() =>
                        copyText(`Ide: ${datePick.title} — ${datePick.desc}`)
                      }
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Salin Ide
                    </Button>
                    <Button
                      className="rounded-full bg-rose-500 hover:bg-rose-600"
                      onClick={() =>
                        copyText(
                          `Hai ${titleCase(
                            herName || ""
                          )}, kita ${datePick.title.toLowerCase()} bareng? ${
                            datePick.desc
                          } \n\n— ${myName || ""}`
                        )
                      }
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Copy Ajakan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Petal Notes */}
          <TabsContent value="petal" className="mt-6">
            <Card className="bg-white/80 backdrop-blur border-rose-100/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flower2 className="w-5 h-5 text-rose-500" />
                  Petal Notes
                </CardTitle>
                <CardDescription>
                  Pesan mini yang kebuka bertahap (3 kelopak).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <Petal key={i} index={i} vibe={vibe} name={herName} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm opacity-70">
                  Kirim satu per satu sepanjang hari untuk efek sweet yang
                  halus.
                </div>
                <Button
                  className="rounded-full"
                  variant="secondary"
                  onClick={() =>
                    copyText(
                      "Petal Notes: \n1) " +
                        petalText(vibe, herName, 0) +
                        "\n2) " +
                        petalText(vibe, herName, 1) +
                        "\n3) " +
                        petalText(vibe, herName, 2)
                    )
                  }
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Salin Semua
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Message Polisher */}
          <TabsContent value="polish" className="mt-6">
            <Card className="bg-white/80 backdrop-blur border-rose-100/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-rose-500" />
                  Perhalus Pesan
                </CardTitle>
                <CardDescription>
                  Rapikan kalimatmu dengan vibe pilihan.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Teks awal</Label>
                  <Textarea
                    rows={6}
                    placeholder="Tulis draf pesanmu di sini"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-2"
                  />
                  <div className="mt-4">
                    <Label>Ringkas (0–200)</Label>
                    <Slider
                      min={20}
                      max={200}
                      step={10}
                      value={[
                        Math.min(200, Math.max(20, message?.length || 80)),
                      ]}
                      onValueChange={() => {}}
                    />
                    <p className="text-xs opacity-70 mt-2">
                      *Slider pasif agar sesuai aturan: panjang preview
                      mengikuti draf saat ini.
                    </p>
                  </div>
                </div>
                <div>
                  <Label>Preview terpolish</Label>
                  <Card className="mt-2">
                    <CardContent className="pt-4">
                      <p className="font-serif leading-relaxed">{polished}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          className="rounded-full"
                          onClick={() => copyText(polished)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Salin Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Romance PDKT — dibuat untuk mendekat
            pelan, sopan, dan tulus.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              No spam
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              Consent-first
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================
// Petal Notes subcomponent
// ==========================
function petalText(vibe, name, index) {
  const who = titleCase(name || "kamu");
  const base = {
    sincere: [
      `Pagi, ${who}. Semoga harimu ringan.`,
      `Barusan kepikiran kamu pas lihat langit cerah.`,
      `Kalau luang, aku pengin ajak kamu ngobrol sore ini.`,
    ],
    playful: [
      `${who}, update penting: kamu masih juara bikin aku senyum.`,
      `Ada misi kecil: kirim foto hal yang bikin kamu happy hari ini.`,
      `Rewardnya: aku traktir es kopi favoritmu. Deal?`,
    ],
    poetic: [
      `${who}, pagi ini seperti kertas kosong; mau kutulis tentangmu.`,
      `Angin siang bawa kabar: rindu bertemu tatapmu.`,
      `Malam nanti, izinkan aku jadi jeda yang menenangkan.`,
    ],
  };
  return base[vibe]?.[index] || base.sincere[index];
}

function Petal({ index, vibe, name }) {
  const [open, setOpen] = useState(false);
  const text = petalText(vibe, name, index);
  return (
    <motion.button
      onClick={() => setOpen((v) => !v)}
      className={`relative w-full rounded-3xl border p-5 text-left transition ${
        open ? "bg-rose-50 border-rose-200" : "bg-white hover:bg-rose-50"
      }`}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
    >
      <div className="flex items-center gap-3">
        <Heart className="w-5 h-5 text-rose-500" />
        <div className="font-medium">Kelopak {index + 1}</div>
        <Badge variant="outline" className="ml-auto rounded-full">
          {open ? "terbuka" : "tertutup"}
        </Badge>
      </div>
      <p className={`mt-3 ${open ? "opacity-100" : "opacity-60"}`}>{text}</p>
    </motion.button>
  );
}
