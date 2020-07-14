import * as React from "react";

import Class from "./util/Class";
import IInput from "./input/IInput";
import { IControlledProps } from "./input/IControlledProps";
import { IFormMeta } from "./form/IFormMeta";
import IFieldset from "./fieldset/IFieldset";
import { Input } from "./input/Input";
import Fieldsets from "./fieldset/Fieldsets";
import IInputArgs from "./input/IInputArgs";
import ArrayWrapper from "./ArrayWrapper";
import { META_KEY } from "./util/Constants";

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

function renderInput<T, C>(
    meta: IFormMeta,
    context: C,
    rootValue: T, // root value
    value: any,
    onChange: (value: any) => void,
    args: IInputArgs<any>,
    id?: string
) {
    
    let element = null;

    // input component
    if (args.component) {
        element = React.createElement(args.component, {...args.meta || {}, ...args.inputProps || {}, id, onChange, value});
    }

    // nested object form
    if (!element) {
        element = renderInputs(meta, context, rootValue, value, onChange, args.inputs, args.clazz, id);
    }

    return element;
}

function renderInputs<T, C>(
    meta: IFormMeta, // templates
    context: C, // context value
    root: T, // root form value
    value: any, // object value
    onChange: (value: any) => void,
    inputs?: (IInput<any>)[],
    clazz?: Class<any>,
    idPrefix?: string
) {

    // todo support with non-decorator format
    let fieldsets: IFieldset[];

    if (!inputs && clazz) {
        const instance = new clazz();
        inputs = instance[META_KEY] && instance[META_KEY].inputs || [];
        fieldsets = instance[META_KEY] && instance[META_KEY].fieldsets || [];
    }

    if (!inputs || !inputs.length) {
        return null;
    }

    const rendered: string[] = [];
    const elements: ({ fieldset?: IFieldset; elements: React.ReactNodeArray })[] = [];
    const safeValue = value || {};

    for (let i = 0; i < inputs.length; i++) {

        const input = inputs[i];
        
        // skip if already rendered
        const property = input.property;
        if (rendered.indexOf(property) > -1) {
            continue;
        }

        // compute input args
        const args = typeof input.args === 'function' ? input.args(safeValue[property], { context, parent: safeValue, root }) : input.args;

        const handleChange = (next: any) => onChange({...safeValue, [property]: next});

        const id = idPrefix ? `${idPrefix}_${property}` : undefined;

        let element = null;
        
        if (args.array) {
            element = (
                <ArrayWrapper 
                    array={args.array} 
                    arrayItemTemplate={meta.arrayItemTemplate}
                    value={safeValue[property]}
                    onChange={handleChange}
                    renderInput={(itemValue, itemOnChange, index) => renderInput(meta, context, root, itemValue, itemOnChange, args, id ? `${id}_${index}` : undefined)}
                />
            );
        } else {
            element = renderInput(meta, context, root, safeValue[property], handleChange, args, id);
        }

        rendered.push(property);

        if (!element) {
            continue;
        }

        // wrap with input template
        element = React.createElement(meta.inputTemplate, {...args.meta || {}, labelFor: !args.array ? id : undefined, key: property}, element);

        if (args.fieldset) {
            let fieldsetWrapper = elements.find(e => e.fieldset && e.fieldset.name === args.fieldset);
            if (!fieldsetWrapper) {
                const fs = fieldsets.find(s => s.name === args.fieldset);
                elements.push(fieldsetWrapper = { fieldset: fs || { name: args.fieldset, title: args.fieldset }, elements: [] });
            }
            fieldsetWrapper.elements.push(element);
            continue;
        }

        elements.push({ elements: [element] });
    }

    return elements.reduce((a, c) => {
        if (c.fieldset) {
            a.push(React.createElement(meta.fieldsetTemplate, {...c.fieldset, key: `fieldset.${c.fieldset.name}`}, c.elements));
            return a;
        }
        return a.concat(c.elements);
    }, []);
}

export default function Form<T = any, C = any>(props: IFormProps<T, C>) {

    const { clazz, context = {}, idPrefix, inputs, meta, onChange, value } = props;

    return (
        <React.Fragment>
            {renderInputs(meta, context, value, value, onChange, inputs, clazz, idPrefix)}
        </React.Fragment>
    );
}
