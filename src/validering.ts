// Dag 5: Validering av bokningsformuläret. Rena funktioner, lätta att testa.
// Varje valideraX-funktion tar ett värde (text) och returnerar ett felmeddelande som text,
// eller en tom text "" om värdet är giltigt. Meddelandena står i tests.js.

import { test } from "./testlib";

// Namn: obligatoriskt, minst 2 tecken efter trim().
export function valideraNamn(text: string): string {
  const textLength = text.trim().length;
  if (textLength === 0) {
    return "Fyll i ditt namn.";
  }

  if (textLength < 2) {
    return "Namnet måste vara minst 2 tecken.";
  } else {
    return "";
  }
}

// E-post: obligatorisk, måste innehålla @, och ha formen text@text.text.
export function valideraEpost(text: string): string {
  const epost = text.trim();

  if (epost.length === 0) {
    return "Fyll i din e-postadress.";
  }

  if (!/@/.test(epost)) {
    return "E-postadressen måste innehålla @.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) {
    return "Ange en giltig e-postadress, till exempel namn@exempel.se.";
  }

  return "";
}

// Telefon: VALFRI (tom text är giltigt). Annars bara siffror, mellanslag, + och -, och minst 7 siffror.
export function valideraTelefon(text: string): string {
  const telephone = text.trim();

  // Optional field
  if (telephone.length === 0) {
    return "";
  }

  // Allowed characters: digits, whitespace, +, and -
  if (!/^[0-9 +\-]+$/.test(telephone)) {
    return "Telefonnumret får bara innehålla siffror, mellanslag, plus och bindestreck.";
  }

  // Count digits only
  const numberOfDigits = (telephone.match(/[0-9]/g) ?? []).length;

  if (numberOfDigits < 7) {
    return "Telefonnumret är för kort.";
  }

  return "";
}

// Datum: obligatoriskt. text och idag är datum som "2026-10-19". Inte före idag.
export function valideraDatum(text: string, idag: string): string {
  const dateRegex: RegExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  // if (dateRegex.test(text)) {
  // } else {
  //   return "Välj ett datum.";
  // }
  console.log(text + idag);
  if (dateRegex.test(text) && dateRegex.test(idag)) {
    // compare date
    const d = new Date(text);
    const today = new Date(idag);
    if (d < today) {
      return "Datumet kan inte vara i det förflutna.";
    } else {
      return "";
    }
  } else {
    return "Välj ett datum.";
  }
}

// Antal personer: obligatoriskt (en tom text betyder att inget valts).
export function valideraAntal(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return "Välj antal personer.";
  }

  if (Number(trimmed) > 0) {
    return "";
  } else {
    return "Fel antal personer.";
  }
}

// Dagens datum som "2026-10-19" (färdig, du behöver inte ändra den).
export function dagensDatum(): string {
  return new Date().toLocaleDateString("sv-SE");
}

// Validera ett helt formulär. varden = { namn, epost, telefon, datum, antal } (texter).
// Returnera ett objekt med BARA de fält som har fel: { namn: "Fyll i ditt namn." }
// Giltigt formulär ger ett tomt objekt {}.
export function valideraFormular(
  varden: Record<string, string>,
  idag: string,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in varden) {
    const value = varden[key];

    let check = "";

    switch (key) {
      case "namn":
        check = valideraNamn(value);
        break;
      case "epost":
        check = valideraEpost(value);
        break;
      case "telefon":
        check = valideraTelefon(value);
        break;
      case "datum":
        check = valideraDatum(value, idag);
        break;
      case "antal":
        check = valideraAntal(value);
        break;

      default:
        break;
    }

    if (check !== "") {
      result[key] = check;
    }
  }
  return result;
}
