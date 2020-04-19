import { IInputArgs } from "./IInputArgs";
import { META_KEY } from "../util/Constants";
import { IInputProps } from "./IInputProps";

export function Input<T, P extends IInputProps<T>>(args: IInputArgs<T, P>) {
  return (clazz: any, property: string) => {
    if (!clazz[META_KEY] || typeof clazz[META_KEY] !== 'object') {
      clazz[META_KEY] = {};
    }
    if (!Array.isArray(clazz[META_KEY].inputs)) {
      // ensure that this is an array
      clazz[META_KEY].inputs = [];
    }
    clazz[META_KEY].inputs.push({...args, property});
  }
}

Input.getInputs = (o: any): (IInputArgs<any, any> & {property: string;})[] => o[META_KEY] && o[META_KEY].inputs || [];
