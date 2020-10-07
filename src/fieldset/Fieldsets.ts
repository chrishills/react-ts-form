import { META_KEY } from "../util/Constants";
import IFieldset from "./IFieldset";

export default function Fieldsets(fieldsets: IFieldset[]) {
  return (clazz: any) => {
    if (!fieldsets?.length) {
      return;
    }
    let meta = clazz[META_KEY];
    if (!meta) {
      meta = {};
      clazz[META_KEY] = meta;
    }
    let arr: IFieldset[] = meta.fieldsets;
    if (!arr) {
      arr = [];
      meta.fieldset = arr;
    }
    arr.push(...fieldsets);
  }
}
