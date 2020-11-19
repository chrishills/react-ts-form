import { META_KEY } from "../util/Constants";

/**
 * custom display names for field sets
 */
export default function Fieldsets(fieldsets: { [name: string]: React.ReactNode; }) {
  return (clazz: any) => {
    let meta = clazz.prototype[META_KEY];
    if (!meta) {
      meta = {};
      clazz.prototype[META_KEY] = meta;
    }
    meta.fieldsets = {...meta.fieldsets || {}, ...fieldsets};
    return clazz;
  }
}
