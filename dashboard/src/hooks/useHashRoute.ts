import { useEffect, useState } from "react";

// Petit routeur par hash (#section) — évite la configuration serveur
export function useHashRoute(valid: string[]): string {
  const read = () => {
    const h = window.location.hash.replace("#", "");
    return valid.includes(h) ? h : "overview";
  };
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    if (!window.location.hash) window.location.hash = "#overview";
    return () => window.removeEventListener("hashchange", onChange);
  }, [valid]);

  return route;
}
