import * as React from "react";

import Class from "./util/Class";
import IInput from "./input/IInput";
import { IControlledProps } from "./input/IControlledProps";
import { IFormMeta } from "./form/IFormMeta";
import IInputArgs from "./input/IInputArgs";
import ArrayWrapper from "./ArrayWrapper";
import getFormSchema from "./util/getFormSchema";

interface IFormProps<T = any, C = any> extends IControlledProps<T> {

    /**
     * context object passed to each input args resolver function.
     */
    context?: C;
    
    /**
     * generate input list from decorated class
     */
    clazz?: Class<T>;

    /**
     * specify list of 
     */
    inputs?: (IInput<any>)[];

    /**
     * template components
     */
    meta: IFormMeta;

    /**
     * html id prefix for auto-generated component input ids.
     */
    idPrefix?: string;

}

interface InputRenderArgs<T, C> {
    meta: IFormMeta;
    context: C;
    rootValue: T;
    value: any;
    onChange(value: any): void;
    args: IInputArgs<any>;
    id?: string;
    path: string;
}

function renderInput<T, C>({ meta, context, rootValue, value, onChange, args, id, path }: InputRenderArgs<T, C>) {
    
    let element = null;

    // input component
    if (args.component) {
        element = React.createElement(args.component, {...args.meta || {}, ...args.inputProps || {}, id, onChange, value, path});
    }

    // nested object form
    if (!element) {
        element = renderInputs({ meta, context, root: rootValue, value, onChange, inputs: args.inputs, clazz: args.clazz, idPrefix: id, path});
    }

    return element;
}

interface InputsRenderArgs<T, C> {
    meta: IFormMeta; // templates
    context: C; // context value
    root: T; // root form value
    value: any; // object value
    onChange: (value: any) => void;
    inputs?: (IInput<any>)[];
    clazz?: Class<any>;
    idPrefix?: string;
    path?: string;
}

function renderInputs<T, C>({ meta, context, root, value, onChange, inputs, clazz, idPrefix, path }: InputsRenderArgs<T, C>) {

    // todo support with non-decorator format
    let fieldsets: { [name: string]: React.ReactNode; };

    if (!inputs && clazz) {
        const instance = new clazz();
        const schema = getFormSchema(instance);
        fieldsets = schema.fieldsets;
        inputs = [];
        if (schema.inputs) {
            let ctor = instance.constructor;
            while (ctor) {
                const arr = schema.inputs.get(ctor.prototype);
                if (arr?.length) {
                    inputs = [...arr, ...inputs];
                }
                ctor = Object.getPrototypeOf(ctor);
            }
        }
    }

    if (!inputs || !inputs.length) {
        return null;
    }

    if (!fieldsets) {
        fieldsets = {};
    }

    const rendered: string[] = [];
    const elements: ({ fieldset?: string; elements: React.ReactNodeArray })[] = [];
    const safeValue = value || {};
    const ctx = { context, parent: safeValue, root };

    for (let i = 0; i < inputs.length; i++) {

        const input = inputs[i];
        
        // skip if already rendered
        const property = input.property;
        if (rendered.indexOf(property) > -1) {
            continue;
        }

        // compute input args
        const args = typeof input.args === 'function' ? input.args(safeValue[property], ctx) : input.args;

        // if args function returned a falsey value, skip this input
        if (!args || (typeof args.exclude === 'function' && args.exclude(safeValue[property], ctx))) {
            continue;
        }

        const handleChange = (next: any) => onChange({...safeValue, [property]: next});

        const id = idPrefix ? `${idPrefix}_${property}` : undefined;

        let element = null;

        const subpath = path ? path + "." + property : property;
        
        if (args.array) {
            element = (
                <ArrayWrapper 
                    array={args.array} 
                    arrayItemTemplate={meta.ArrayItemTemplate}
                    value={safeValue[property]}
                    onChange={handleChange}
                    renderInput={(itemValue, itemOnChange, index) => {
                        return renderInput({
                            meta, 
                            context, 
                            rootValue: root, 
                            value: itemValue, 
                            onChange: itemOnChange, 
                            args, 
                            id: id ? `${id}_${index}` : undefined,
                            path: subpath + "[" + index + "]",
                        });
                    }}
                />
            );
        } else {
            element = renderInput({ 
                meta, 
                context, 
                rootValue: 
                root, 
                value: safeValue[property], 
                onChange: handleChange, 
                args, 
                id,
                path: subpath,
            });
        }

        rendered.push(property);

        if (!element) {
            continue;
        }

        // wrap with input template
        element = React.createElement(meta.InputTemplate, {...args.meta || {}, labelFor: !args.array ? id : undefined, key: property, path: subpath}, element);

        if (args.fieldset) {
            let fieldsetWrapper = elements.find(e => e.fieldset === args.fieldset);
            if (!fieldsetWrapper) {
                elements.push(fieldsetWrapper = { fieldset: args.fieldset, elements: [] });
            }
            fieldsetWrapper.elements.push(element);
            continue;
        }

        elements.push({ elements: [element] });
    }

    return elements.reduce((a, c) => {
        if (c.fieldset) {
            a.push(React.createElement(meta.FieldsetTemplate, {name: c.fieldset, title: fieldsets[c.fieldset] || c.fieldset, key: `fieldset.${c.fieldset}`}, c.elements));
            return a;
        }
        return a.concat(c.elements);
    }, []);
}

export default function Form<T = any, C = any>(props: IFormProps<T, C>) {

    const { clazz, context = {}, idPrefix, inputs, meta, onChange, value } = props;

    return (
        <React.Fragment>
            {renderInputs({ meta, context, root: value, value, onChange, inputs, clazz, idPrefix })}
        </React.Fragment>
    );
}
