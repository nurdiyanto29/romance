"use client";

import { motion } from "framer-motion";
import { Heart, Share2, BookHeart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function ConfessionResultPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 via-white to-pink-100 text-neutral-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-white/80 backdrop-blur border border-rose-100 shadow-xl max-w-md text-center p-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <BookHeart className="text-rose-500 w-6 h-6" />
              Cerita Kita
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="leading-relaxed">
              Setiap kisah dimulai dari keberanian jujur. Hari ini, kamu sudah menulis
              satu bab yang indah — dan mungkin, awal dari segalanya.
            </p>
            <p className="italic opacity-70">"Cinta bukan soal siapa yang lebih dulu, tapi siapa yang mau bertahan lebih lama."</p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              className="bg-rose-500 hover:bg-rose-600 rounded-full"
              onClick={() => toast.success("Link disalin! 💖")}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Bagikan Cerita
            </Button>

            <Link href="/confession">
              <Button variant="secondary" className="rounded-full">
                <Heart className="w-4 h-4 mr-2 text-rose-500" />
                Mulai Lagi
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>

      <p className="text-xs mt-6 opacity-60">© 2025 Confession Storybook</p>
    </div>
  );
}
