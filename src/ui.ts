// Dag 4–5: Funktioner som bygger sidans innehåll. Använd createElement och textContent.
import { formateraPris } from "./pris";
import type { Ratt, OrderRad } from "./typer";

// De tre elementen som visar beställningen.
export interface OrderRef {
  lista: HTMLElement;
  summa: HTMLElement;
  tom: HTMLElement;
}
import { hittaRatt, totalPris } from "./meny";

export function skapaRattKort(ratt: Ratt): HTMLElement {
  const kort = document.createElement("article");
  kort.dataset.id = String(ratt.id);

  const bild = document.createElement("img");
  bild.src = ratt.bild ?? "";
  bild.alt = `Illustration av ${ratt.namn.toLowerCase()}`;

  const rubrik = document.createElement("h3");
  rubrik.textContent = ratt.namn;

  const text = document.createElement("p");
  text.textContent = ratt.beskrivning ?? "";

  const pris = document.createElement("p");
  pris.className = "pris";
  pris.textContent = formateraPris(ratt.pris);

  // DAG 5, TODO: skapa en knapp och lägg den sist i kortet:
  //   <button type="button" class="lagg-i-order" data-id="1" aria-label="Lägg Kardemummabulle i beställningen">Lägg i beställning</button>

  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("class", "lagg-i-order");
  button.setAttribute("data-id", String(ratt.id));
  button.setAttribute("aria-label", ratt.namn);
  button.textContent = "Lägg i beställning";

  kort.append(bild, rubrik, text, pris, button);

  return kort;
}

export function visaMeny(container: HTMLElement, ratter: Ratt[]): void {
  container.replaceChildren();
  if (ratter.length === 0) {
    const tom = document.createElement("p");
    tom.className = "tom";
    tom.textContent = "Inga rätter hittades.";
    container.append(tom);
    return;
  }
  for (const ratt of ratter) {
    container.append(skapaRattKort(ratt));
  }
}

export function uppdateraRubrik(element: HTMLElement, antal: number): void {
  const ord = antal === 1 ? "rätt" : "rätter";
  element.textContent = `Meny (${antal} ${ord})`;
}

export function markeraDagensRatt(container: HTMLElement, id: number): void {
  for (const kort of container.querySelectorAll<HTMLElement>("article")) {
    kort.classList.toggle("dagens", kort.dataset.id === String(id));
  }
}

// DAG 5 (fördjupning): visa beställningen.
// ref = { lista, summa, tom } är tre element. order är [{ id, antal }].
//   - töm ref.lista och lägg in en <li> per rad: <span>2 × Kardemummabulle</span><span>70 kr</span>
//     (priset = rättens pris gånger antal, formaterat med formateraPris; hittaRatt hittar rätten)
//   - ref.tom (texten "Du har inte lagt något...") ska ha klassen "dold" när ordern INTE är tom
//   - ref.summa.textContent = totalpriset (totalPris från meny.js), formaterat
export function visaOrder(
  ref: OrderRef,
  order: OrderRad[],
  meny: Ratt[],
): void {
  ref.lista.replaceChildren();

  if (order.length > 0) {
    order.forEach((o) => {
      const dish = hittaRatt(meny, o.id);
      if (!dish) {
        return;
      }

      const price = formateraPris(o.antal * dish.pris);

      const li = document.createElement("li");
      const dishSpan = document.createElement("span");
      dishSpan.textContent = `${o.antal} × ${dish.namn}`;
      const priceSpan = document.createElement("span");
      priceSpan.textContent = price;
      li.append(dishSpan, priceSpan);

      ref.lista.appendChild(li);
    });

    ref.tom.setAttribute("class", "dold");
  } else {
    ref.tom.removeAttribute("class");
  }

  const totalPrice = totalPris(order, meny);
  ref.summa.textContent = formateraPris(totalPrice);
}
