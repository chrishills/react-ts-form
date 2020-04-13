import Class from "../util/Class";
import { IControlledProps } from "../input/IControlledProps";
import { IFormMeta } from "./IFormMeta";

export interface IFormProps<T> extends IControlledProps<T> {
  clazz: Class<T>;
  meta: IFormMeta;
}
