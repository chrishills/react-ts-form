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

}

function renderInput<T, C>(
    meta: IFormMeta,
    context: C,
    rootValue: T, // root value
    value: any,
    onChange: (value: any) => void,
    args: IInputArgs<any>
) {
    
    let element = null;

    // input component
    if (args.component) {
        element = React.createElement(args.component, {...args.meta || {}, onChange, value});
    }

    // nested object form
    if (!element) {
        element = renderInputs(meta, context, rootValue, value, onChange, args.inputs, args.clazz);
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
    clazz?: Class<any>
) {

    // todo support with non-decorator format
    let fieldsets: IFieldset[];

    if (!inputs && clazz) {
        const instance = new clazz();
        inputs = Input.getInputs(instance);
        fieldsets = Fieldsets.getFieldsets(instance);
    }

    if (!inputs || !inputs.length) {
        return null;
    }

    const rendered: string[] = [];
    const elements: React.ReactNodeArray = [];
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

        let element = null;
        
        if (args.array) {
            element = (
                <ArrayWrapper 
                    array={args.array} 
                    arrayItemTemplate={meta.arrayItemTemplate}
                    value={safeValue[property]}
                    onChange={handleChange}
                    renderInput={(itemValue, itemOnChange) => renderInput(meta, context, root, itemValue, itemOnChange, args)}
                />
            );
        } else {
            element = renderInput(meta, context, root, safeValue[property], handleChange, args);
        }

        rendered.push(property);

        if (!element) {
            continue;
        }

        // wrap with input template
        element = React.createElement(meta.inputTemplate, {...args.meta || {}, key: property}, element);

        // TODO add to fieldset here if relevant

        elements.push(element);
    }

    return elements;
}

export default function Form<T = any, C = any>(props: IFormProps<T, C>) {

    const { clazz, context = {}, inputs, meta, onChange, value } = props;

    return (
        <React.Fragment>
            {renderInputs(meta, context, value, value, onChange, inputs, clazz)}
        </React.Fragment>
    );
}
