import IInputProps from "./IInputProps";
import IInputArgs from "./IInputArgs";
import IInputContext from "./IInputContext";

export default interface IInput<P extends IInputProps<T>, T = P["value"]> {

    /**
     * property key in object to edit
     */
    property: string;

    /**
     * literal input args or resolver function
     */
    args: IInputArgs<P, T> | ((value: T, context: IInputContext) => IInputArgs<P, T>);

}
