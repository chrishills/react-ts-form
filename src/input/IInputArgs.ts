import { IInputProps } from "./IInputProps";
import Class from "../util/Class";
import { IInputMeta } from "./IInputMeta";
import { IInputArrayMeta } from "./IInputArrayMeta";
import { ExcludeKeys } from "../util/ExcludeKeys";

export interface IInputArgs<T, P extends IInputProps<T>> {
  component?: React.ComponentType<P>;
  clazz?: Class<T>;
  meta?: IInputMeta | ((value: T) => IInputMeta);
  array?: IInputArrayMeta<T>;
  fieldset?: string;
  order?: number;
  inputProps?: ExcludeKeys<P, IInputProps<T>>;
}
