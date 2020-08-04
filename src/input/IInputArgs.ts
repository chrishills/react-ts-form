import IInputProps from "./IInputProps";
import Class from "../util/Class";
import IInputMeta from "./IInputMeta";
import IInputArrayMeta from "./IInputArrayMeta";
import IInput from "./IInput";
import { ExcludeKeys } from "../util/ExcludeKeys";
import { ContextualResolver } from "./Input";

/**
 * args for Input decorator. converted to {@link IInput} format 
 * internally in {@link Form}.
 */
export default interface IInputArgs<P extends IInputProps<T>, T = P["value"]> {

  clazz?: Class<T>;

  inputs?: (IInput<any>)[];

  component?: React.ComponentType<P>;

  inputProps?: ExcludeKeys<P, keyof IInputProps<T>>;

  meta?: IInputMeta;

  array?: IInputArrayMeta<T>;
  
  fieldset?: string;

  exclude?: ContextualResolver<T, boolean>;

}
