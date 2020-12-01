
export interface IAddComponentProps<T> {
  readonly values: T[];
  onAdd: (newValues: T[]) => void;
}

export default interface IInputArrayMeta<T> {
  sort?: boolean;
  remove?: boolean;
  addComponent?: React.ComponentType<IAddComponentProps<T>>;
}
