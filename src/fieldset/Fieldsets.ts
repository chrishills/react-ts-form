import { META_KEY } from "../util/Constants";
import IFieldset from "./IFieldset";

export default function Fieldsets(fieldsets: IFieldset[]) {
  return (clazz: any) => {
    if (!clazz[META_KEY]) {
      clazz[META_KEY] = {};
    }
    clazz[META_KEY].fieldsets = fieldsets;
  }
}
