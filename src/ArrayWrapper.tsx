import * as React from "react";

import { IControlledProps } from "./input/IControlledProps";
import { IArrayItemTemplateProps } from "./form/IFormMeta";
import { IKeyedValue } from "./util/IKeyedValue";
import { arrayMove } from "./util/ArrayUtil";
import IInputArrayMeta from "./input/IInputArrayMeta";

interface IArrayWrapperProps<T> extends IControlledProps<T[]> {
    array: IInputArrayMeta<T>;
    arrayItemTemplate: React.ComponentType<IArrayItemTemplateProps>;
    renderInput(value: T, onChange: (value: T) => void, index: number): React.ReactNode;
}

interface IArrayWrapperState<T> {
    keyed: (IKeyedValue<T>)[];
}

/**
 * wrapper for array values that creates a temp key in state.
 */
export default class ArrayWrapper<T> extends React.Component<IArrayWrapperProps<T>, IArrayWrapperState<T>> {
    
    private static _key = 0;

    public constructor(props: IArrayWrapperProps<T>) {
        super(props);
        this.state = {
            keyed: this.toKeyedValues(props.value || [])
        };
    }

    public render(){
        const { array, arrayItemTemplate, renderInput } = this.props;

        const retval = [];

        this.state.keyed.forEach(({key, value}, index, arr) => {

            const canSortUp = array.sort && index > 0;
            const canSortDown = array.sort && index < arr.length - 1;

            retval.push(React.createElement(
                arrayItemTemplate,
                {
                    canSortUp,
                    canSortDown,
                    canRemove: array.remove,
                    remove: this.getRemoveHandler(key),
                    move: this.getMoveHandler(index),
                    sortUp: this.getSortHandler(index, canSortUp ? index - 1 : 0),
                    sortDown: this.getSortHandler(index, canSortDown ? index + 1 : arr.length - 1),
                    index,
                    key
                },
                renderInput(value, this.getChangeHandler(key), index)
            ));
        });

        if (typeof array.addComponent === 'function') {
            retval.push(React.createElement(
                array.addComponent,
                {
                    key: '__add__',
                    values: this.state.keyed.map(kv => kv.value),
                    onAdd: this.onAdd
                }
            ));
        }

        return (
            <React.Fragment>
                {retval}
            </React.Fragment>
        );
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

    private getMoveHandler = (index: number) => (targetIndex: number) => {
        this.handleChange(arrayMove([...this.state.keyed], index, targetIndex));
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
