import { IFormMeta } from "../form/IFormMeta";
import IInputProps from "./IInputProps";

export interface IInputType<P extends IInputProps<T>, T = P["value"]>  {
    Component: React.ComponentType<P>;
    InputTemplate?: IFormMeta['InputTemplate'];
    ArrayItemTemplate?: IFormMeta['ArrayItemTemplate'];
}

export function InputType<P extends IInputProps<T>, T = P["value"]>(type: IInputType<P, T>) {
    return type;
}
