// Dag 5: Bokningsformuläret. Kopplas på kontakt.html.
import {
  valideraNamn,
  valideraEpost,
  valideraTelefon,
  valideraDatum,
  valideraAntal,
  valideraFormular,
  dagensDatum,
} from "./validering";

import { hamta } from "./dom";

type Falt = HTMLInputElement | HTMLSelectElement;

const form = hamta<HTMLFormElement>("#bokningsform");
const bekraftelse = hamta("#bekraftelse");

// elements.namedItem ger Element | RadioNodeList | null. Vi kollar att det är ett fält vi känner igen.
function hittaFalt(namn: string): Falt {
  const falt = form.elements.namedItem(namn);
  if (falt instanceof HTMLInputElement || falt instanceof HTMLSelectElement) {
    return falt;
  }
  throw new Error(`Fältet ${namn} saknas i formuläret`);
}

// Vilken regel hör till vilket fält? Nyckeln är fältets name-attribut.
const regler: Record<string, (text: string) => string> = {
  namn: valideraNamn,
  epost: valideraEpost,
  telefon: valideraTelefon,
  datum: (text: string) => valideraDatum(text, dagensDatum()),
  antal: valideraAntal,
};

// 1. visaFel(falt, meddelande): visa ett felmeddelande under fältet.
//    - Finns det inget <p class="falt-fel" id="NAMN-fel"> efter fältet? Skapa det (insertAdjacentElement("afterend", p)).
//    - p.textContent = meddelande
//    - Är meddelandet tomt: ta bort aria-invalid och aria-describedby från fältet.
//      Annars: falt.setAttribute("aria-invalid", "true") och aria-describedby = p:ts id.
function visaFel(falt: Falt, meddelande: string): void {
  const parent = falt.parentElement;
  if (parent === null) {
    return;
  }

  const id = `${falt.name}-fel`;
  let paragraph = parent.querySelector(`p.falt-fel#${id}`);

  if (!paragraph) {
    paragraph = document.createElement("p");
    paragraph.setAttribute("class", "falt-fel");
    paragraph.setAttribute("id", id);
    falt.insertAdjacentElement("afterend", paragraph);
  }

  paragraph.textContent = meddelande;

  if (meddelande.length > 0) {
    falt.setAttribute("aria-invalid", "true");
    falt.setAttribute("aria-describedby", id);
  } else {
    falt.removeAttribute("aria-invalid");
    falt.removeAttribute("aria-describedby");
  }
}

// 2. Koppla varje fält i regler: validera när användaren LÄMNAR fältet ("blur"),
//    och validera på nytt vid "input" men bara om fältet redan är markerat som fel (aria-invalid="true").

for (const key in regler) {
  const falt = document.querySelector<Falt>(`#${key}[name=${key}]`);
  if (falt) {
    const validate = () => {
      const validateFunction = regler[falt.name];
      const meddelande = validateFunction(falt.value);
      visaFel(falt, meddelande);
    };

    falt.addEventListener("blur", validate);
    falt.addEventListener("input", () => {
      if (falt.getAttribute("aria-invalid") === "true") {
        validate();
      }
    });
  }
}

// 3. Vid "submit": preventDefault(). Validera hela formuläret med valideraFormular.
//    - Finns fel: visa dem alla med visaFel, flytta fokus till första felaktiga fältet.
//    - Annars: skriv "Tack! Vi bekräftar din bokning inom ett dygn." i #bekraftelse och töm formuläret (form.reset()).
//    Tips: new FormData(form) ger fält av typen string | File. valideraFormular vill ha Record<string, string>,
//    så loopa och ta bara värden där typeof varde === "string".
//    Använd hittaFalt(namn) för att hämta ett fält med rätt typ.

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const today = dagensDatum();
  const values: Record<string, string> = {};

  const formData = new FormData(form);
  console.log([...formData.entries()]);
  for (const data of formData) {
    // destruction
    const [name, value] = data;
    values[name] = value.toString();
  }

  console.log(values);
  const result = valideraFormular(values, today);
  const errors = Object.entries(result);

  if (errors.length > 0) {
    for (let i = 0; i < errors.length; i++) {
      const [name, errorMessage] = errors[i];

      const falt = hittaFalt(name);
      if (falt) {
        visaFel(falt, errorMessage);
      }

      if (i === 0) {
        falt.focus();
      }
    }
  } else {
    bekraftelse.textContent = "Tack! Vi bekräftar din bokning inom ett dygn.";
    form.reset();
  }
});
