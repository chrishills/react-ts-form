
export interface IControlledProps<T> {
  value: T;
  onChange: (value: T) => void;
}
