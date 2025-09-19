// JoyJerr/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function JoyJerrIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automatiquement vers /JoyJerr/community
    router.replace("/JoyJerr/community");
  }, []);

  return null; // Pas besoin de rendu, on redirige directement
}
