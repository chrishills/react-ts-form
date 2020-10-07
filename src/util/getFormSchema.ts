import IFieldset from "../fieldset/IFieldset";
import IInputArgs from "../input/IInputArgs";
import { ContextualResolver } from "../input/Input";
import Class from "./Class";
import { META_KEY } from "./Constants";

export default function getFormSchema(clazz: Class<any>) {
    return ((clazz as any)[META_KEY] || {}) as {
        fieldsets?: IFieldset[];
        inputs: Map<Class<any>, Array<{
            property: string;
            args: IInputArgs<any, any> | ContextualResolver<any, IInputArgs<any, any>>;
        }>>;
    };
}
