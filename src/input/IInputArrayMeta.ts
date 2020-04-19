
interface IAddComponentProps<T> {
  readonly values: T[];
  onAdd: (newValues: T[]) => void;
}

export interface IInputArrayMeta<T> {
  sort?: boolean;
  remove?: boolean;
  addComponent?: React.Component<IAddComponentProps<T>>;
}
