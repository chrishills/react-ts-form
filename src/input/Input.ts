import IInputArgs from "./IInputArgs";
import { META_KEY } from "../util/Constants";
import IInputProps from "./IInputProps";

export type ContextualResolver<T, U> = (value: T, ctx: { context: any; parent: any; root: any}) => U;

export function Input<P extends IInputProps<T>, T = P["value"]>(args: IInputArgs<P, T> | ContextualResolver<T, IInputArgs<P, T>>) {
  return (clazz: any, property: string) => {

    if (!clazz[META_KEY] || typeof clazz[META_KEY] !== 'object') {
      clazz[META_KEY] = {};
    }

    if (!Array.isArray(clazz[META_KEY].inputs)) {
      clazz[META_KEY].inputs = [];
    }

    clazz[META_KEY].inputs.push({args, property});
  }
}
