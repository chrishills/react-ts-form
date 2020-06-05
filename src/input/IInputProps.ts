import IInputMeta from "./IInputMeta";
import { IControlledProps } from "./IControlledProps";

/**
 * base props for an input component
 */
export default interface IInputProps<T> extends IInputMeta, IControlledProps<T> {

}
