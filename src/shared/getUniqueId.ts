import { v4 as uuid } from "uuid";

export function getUniqueId() {
  return `${Date.now()}-${uuid()}`;
}
