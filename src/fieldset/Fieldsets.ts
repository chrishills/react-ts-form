import { META_KEY } from "../util/Constants";

/**
 * custom display names for field sets
 */
export default function Fieldsets(fieldsets: { [name: string]: React.ReactNode; }) {
  return (clazz: any) => {
    let meta = clazz[META_KEY];
    if (!meta) {
      meta = {};
      clazz[META_KEY] = meta;
    }
    meta.fieldsets = {...meta.fieldsets || {}, ...fieldsets};
  }
}
