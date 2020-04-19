import { META_KEY } from "../util/Constants";

interface IFieldset {
  key: string;
  title: React.ReactNode;
}

export function Fieldsets(fieldsets: IFieldset[]) {
  return (clazz: any) => {
    if (!clazz[META_KEY]) {
      clazz[META_KEY] = {};
    }
    clazz[META_KEY].fieldsets = fieldsets;
  }
}
Fieldsets.getFieldsets = (o: any): IFieldset[] => o[META_KEY] && o[META_KEY].fieldsets || [];
