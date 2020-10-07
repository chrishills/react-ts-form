import IInputArgs from "./IInputArgs";
import { META_KEY } from "../util/Constants";
import IInputProps from "./IInputProps";

export type ContextualResolver<T, U> = (value: T, ctx: { context: any; parent: any; root: any}) => U;

export function Input<P extends IInputProps<T>, T = P["value"]>(args: IInputArgs<P, T> | ContextualResolver<T, IInputArgs<P, T>>) {
  return (clazz: any, property: string) => {

    /**
     * proto[META_KEY]: {
     *  fieldsets: IFieldset[];
     *  inputs: Map<Class, (IInputArgs | ContextualResolver)[]>;
     * }
     */
    let meta = clazz[META_KEY];
    if (!meta) {
      meta = {};
      clazz[META_KEY] = meta;
    }

    let map = meta.inputs;
    if (!map) {
      map = new Map();
      meta.inputs = map;
    }

    let arr = map.get(clazz);
    if (!arr) {
      arr = [];
      map.set(clazz, arr);
    }

    arr.push({args, property});
  }
}
