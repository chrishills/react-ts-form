
interface IInputProps<T> {
    value: T;
    onChange(value: T): void;
    disabled?: boolean;
}

type InputTemplateProps<T> = React.PropsWithChildren<T & { index: number; id?: string; }>;

interface Templates<I, A, F> {
    InputTemplate: React.ComponentType<InputTemplateProps<I>>;
    ArrayItemTemplate: React.ComponentType<A>;
    FieldSetTemplate: React.ComponentType<F>;
}


