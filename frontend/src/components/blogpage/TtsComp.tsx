"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { SERVER_ADDR } from "@/app/utils/atom";
import Cookies from "js-cookie";
import { logoutUser } from "@/app/utils/atom";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { Headphones, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function TTScomponent({ params }: { params: { id: string } }) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<"female" | "male">("female");
  const router = useRouter();

  const handleNarrate = async () => {
    if (audioSrc) {
      return;
    }

    setLoading(true);
    const token = Cookies.get("token");

    if (!token) {
      logoutUser();
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_ADDR}/api/tts`,
        { id: params.id, voice: selectedVoice },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 403) {
        logoutUser();
        router.push("/login");
      } else {
        console.error("Error fetching TTS:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Headphones size={16} />
        <span>Listen to this article instead of reading</span>
      </div>

      <div className="flex flex-col">
        <RadioGroup
          value={selectedVoice}
          onValueChange={(value: "female" | "male") => setSelectedVoice(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <label htmlFor="female" className="text-sm">Female</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <label htmlFor="male" className="text-sm">Male</label>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={handleNarrate}
        disabled={loading}
        variant={audioSrc ? "outline" : "default"}
        className="w-full transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating audio...
          </>
        ) : (
          <>{audioSrc ? "Audio Ready" : "Generate Audio Narration"}</>
        )}
      </Button>

      {audioSrc && (
        <div className="mt-4 transition-all duration-300 ease-in-out">
          <audio
            controls
            src={audioSrc}
            className="w-full rounded-md"
            controlsList="nodownload"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
