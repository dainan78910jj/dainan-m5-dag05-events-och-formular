// Dag 5: Filtrering av menyn.
import type { Ratt, Filter } from "./typer";

// filter är "alla", "vegetarisk" eller en kategori ("bakverk", "dryck", "lunch").
//   "alla"        -> hela menyn
//   "vegetarisk"  -> bara vegetariska rätter
//   annat         -> rätter vars kategori är lika med filter
// Okänt filter ger en tom lista.
export function filtreraMeny(meny: Ratt[], filter: Filter): Ratt[] {
  return meny.filter((m) => {
    switch (filter) {
      case "alla":
        return true;
      case "vegetarisk":
        return m.vegetarisk;

      case "bakverk":
      case "dryck":
      case "lunch":
        return m.kategori === filter;

      default:
        return false;
    }
  });
}
