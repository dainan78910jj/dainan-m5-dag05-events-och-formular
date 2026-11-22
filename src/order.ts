// Dag 5 (fördjupning): Beställningen som data. En order är en array: [{ id: 1, antal: 2 }, ...]
import type { OrderRad } from "./typer";
// Alla funktioner ska returnera NYA arrayer och aldrig ändra order de får in.

// Lägg till en rätt. Finns id redan i ordern: öka antal med 1. Annars lägg till { id, antal: 1 }.
export function laggTillIOrder(order: OrderRad[], id: number): OrderRad[] {
  // deep copy
  const copiedOrder = order.map((rad) => ({ ...rad }));

  for (const c of copiedOrder) {
    if (c.id === id) {
      c.antal++;
      return copiedOrder;
    }
  }
  copiedOrder.push({ id, antal: 1 });
  return copiedOrder;
}

// En tom order.
export function rensaOrder(): OrderRad[] {
  return [];
}

// Totala antalet varor i ordern (summan av alla antal).
export function antalIOrder(order: OrderRad[]): number {
  let sum: number = 0;

  for (const o of order) {
    sum += o.antal;
  }
  return sum;
}
