import IInputProps from "./IInputProps";
import IInputArgs from "./IInputArgs";

export default interface IInput<P extends IInputProps<T>, T = P["value"]> {

    /**
     * property key in object to edit
     */
    property: string;

    /**
     * literal input args or resolver function
     */
    args: IInputArgs<P, T> | ((value: T, rootData: any, context: any) => IInputArgs<P, T>);

}
