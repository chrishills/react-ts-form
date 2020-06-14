import IInputArgs from "./IInputArgs";
import { META_KEY } from "../util/Constants";
import IInputProps from "./IInputProps";

export function Input<P extends IInputProps<T>, T = P["value"]>(args: IInputArgs<P, T> | ((value: T, rootData: any, context: any) => IInputArgs<P, T>)) {
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
