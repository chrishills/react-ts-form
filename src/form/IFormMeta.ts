import IInputMeta from "../input/IInputMeta";
import IFieldset from "../fieldset/IFieldset";

// tslint:disable-next-line:no-empty-interface
export interface IInputTemplateProps extends IInputMeta {
  children?: React.ReactChild
  labelFor?: string;
}

export interface IArrayItemTemplateProps {
  canSortUp: boolean;
  canSortDown: boolean;
  canRemove: boolean;
  sortUp: () => void;
  sortDown: () => void;
  remove: () => void;
  children?: React.ReactNode
}

export type IFieldsetTemplate = React.PropsWithChildren<IFieldset>;

export interface IFormMeta {
  InputTemplate: React.ComponentType<IInputTemplateProps>;
  ArrayItemTemplate: React.ComponentType<IArrayItemTemplateProps>;
  FieldsetTemplate: React.ComponentType<IFieldsetTemplate>;
}
