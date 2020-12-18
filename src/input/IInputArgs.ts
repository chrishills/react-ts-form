import IInputProps from "./IInputProps";
import Class from "../util/Class";
import IInputMeta from "./IInputMeta";
import IInputArrayMeta from "./IInputArrayMeta";
import IInputMapping from "./IInputMapping";
import { ExcludeKeys } from "../util/ExcludeKeys";
import { ContextualResolver } from "./Input";
import { IInputType } from "./InputType";
import { IFormMeta } from "../form/IFormMeta";

/**
 * args for Input decorator. converted to {@link IInput} format 
 * internally in {@link Form}.
 */
export default interface IInputArgs<P extends IInputProps<T>, T = P["value"]> {

  clazz?: Class<T>;

  inputs?: (IInputMapping<any>)[];

  component?: React.ComponentType<P>;

  use?: IInputType<P, T>;

  inputProps?: ExcludeKeys<P, keyof IInputProps<T>>;

  meta?: IInputMeta;

  array?: IInputArrayMeta<T>;
  
  fieldset?: string;

  exclude?: ContextualResolver<T, boolean>;

  InputTemplate?: IFormMeta['InputTemplate'];

  ArrayItemTemplate?: IFormMeta['ArrayItemTemplate'];

}
