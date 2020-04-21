import * as React from "react";

import { Fieldsets } from "../fieldset/Fieldsets";
import { Input } from "../input/Input";
import { IInputArgs } from "../input/IInputArgs";
import Class from "../util/Class";
import { IFormMeta } from "./IFormMeta";
import { IFormProps } from "./IFormProps";
import { IInputProps } from "../input/IInputProps";
import { IKeyedValue } from "../util/IKeyedValue";
import { arrayMove } from "../util/ArrayUtil";

function renderInput<T>(
  input: IInputArgs<any, any> & { property: string; },
  meta: IFormMeta,
  value: T,
  onChange: (value: T) => void,
  key: React.Key,
  useTemplate: boolean
): React.ReactNode {
  let content = null;
  const inputMeta = typeof input.meta === 'function' ? input.meta(value) : input.meta || {};

  if (inputMeta.hidden) {
    return null;
  }

  if (input.array) {
    content = React.createElement(
      ArrayWrapper,
      {
        value: (value as unknown) as T[],
        onChange: (onChange as unknown) as (value: T[]) => void,
        input,
        meta
      }
    );
  }

  if (!content && typeof input.clazz === 'function') {
    content = renderForm(input.clazz, meta, onChange, value);
  }

  if (!content && typeof input.component === 'function') {
    content = React.createElement(
      input.component,
      {
        ...input.inputProps,
        ...inputMeta,
        onChange,
        value
      }
    );
  }

  if (!content) {
    return null;
  }

  if (!useTemplate) {
    return content;
  }

  return React.createElement(meta.inputTemplate, {...inputMeta, key}, content);
}

/**
 * render all form components for all decorated fields
 * @param clazz decorated data class
 * @param meta template components, etc
 * @param onChange
 * @param value
 */
function renderForm<T extends object>(clazz: Class<T>, meta: IFormMeta, onChange: (value: T) => void, value: T) {
  const instance = new clazz();
  const inputs = Input.getInputs(instance);
  const fieldsets = Fieldsets.getFieldsets(instance);

  if (!inputs.length) {
    return null;
  }

  const rendered = [];
  const retval = [];

  const safeValue = (value || {}) as any;

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    if (rendered.indexOf(input.property) > -1) {
      continue;
    }

    if (input.fieldset && fieldsets.length) {
      const fieldset = fieldsets.find(fs => fs.key === input.fieldset);
      if (fieldset) {
        const fieldsetInputs = [];
        for (let i1 = i; i1 < inputs.length; i1++) {
          const input1 = inputs[i1];
          const e = renderInput(input1, meta, safeValue[input1.property], (v) => onChange({...safeValue, [input1.property]: v}), input.property, true);
          if (e) {
            fieldsetInputs.push(e);
          }
          rendered.push(input1.property);
        }
        retval.push(React.createElement(meta.fieldsetTemplate, fieldset, fieldsetInputs));
        continue;
      }
    }

    const el = renderInput(input, meta, safeValue[input.property], (v) => onChange({...safeValue, [input.property]: v}), input.property, true);
    if (el) {
      retval.push(el);
    }
    rendered.push(input.property);
  }

  return retval;
}


interface IArrayWrapperProps<T> extends IInputProps<T[]> {
  input: IInputArgs<T, any> & {property: string;};
  meta: IFormMeta;
}

interface IArrayWrapperState<T> {
  keyed: (IKeyedValue<T>)[];
}

class ArrayWrapper<T> extends React.Component<IArrayWrapperProps<T>, IArrayWrapperState<T>> {

  private static _key = 0;

  public constructor(props: IArrayWrapperProps<T>) {
    super(props);
    this.state = {
      keyed: this.toKeyedValues(props.value || [])
    };
  }

  public render() {
    const { input: { array, ...rest }, meta, value } = this.props;

    const retval = [];

    this.state.keyed.forEach((kv, i, arr) => {

      const canSortUp = array.sort && i > 0;
      const canSortDown = array.sort && i < arr.length - 1;

      retval.push(React.createElement(
        meta.arrayItemTemplate,
        {
          canSortUp,
          canSortDown,
          canRemove: array.remove,
          remove: this.getRemoveHandler(kv.key),
          sortUp: this.getSortHandler(i, canSortUp ? i - 1 : 0),
          sortDown: this.getSortHandler(i, canSortDown ? i + 1 : arr.length - 1),
          key: kv.key
        },
        renderInput(
          rest,
          meta,
          value,
          this.getChangeHandler(kv.key),
          kv.key,
          false // no Input Template for each array item
        )
      ));
    });

    if (typeof array.addComponent === 'function') {
      retval.push(React.createElement(
        array.addComponent,
        {
          key: '__add__',
          value: this.state.keyed.map(kv => kv.value),
          onChange: this.onAdd
        }
      ));
    }

    return retval;
  }

  private onAdd = (newValues: T[]) => {
    if (Array.isArray(newValues) && newValues.length > 0) {
      this.handleChange([...this.state.keyed, ...newValues.map((value) => ({key: ArrayWrapper.newKey(), value}))]);
    }
  }

  private getSortHandler = (index: number, newIndex: number) => () => {
    this.handleChange(arrayMove([...this.state.keyed], index, newIndex));
  }

  private getRemoveHandler = (key: React.Key) => () => {
    this.handleChange(this.state.keyed.filter(kv => kv.key !== key));
  }

  private getChangeHandler = (key: React.Key) => (value: any) => {
    this.handleChange(this.state.keyed.map(kv => kv.key === key ? {key, value} : kv));
  }

  private handleChange = (keyed: (IKeyedValue<T>)[]) => {
    this.setState({keyed}, () => {
      this.props.onChange(this.state.keyed.map(kv => kv.value))
    });
  }

  private toKeyedValues(values: T[]) {
    return values.map(value => ({key: ArrayWrapper.newKey(), value}));
  }

  private static newKey() { return this._key++; }
}

export function Form<T extends object>(props: IFormProps<T>): React.ReactElement {
  return React.createElement(React.Fragment, {}, renderForm(props.clazz, props.meta, props.onChange, props.value));
}
