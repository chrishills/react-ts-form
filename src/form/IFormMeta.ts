import IInputMeta from "../input/IInputMeta";
import IFieldset from "../fieldset/IFieldset";

// tslint:disable-next-line:no-empty-interface
export interface IInputTemplateProps extends IInputMeta {
  children?: React.ReactChild
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
  inputTemplate: React.ComponentType<IInputTemplateProps>;
  arrayItemTemplate: React.ComponentType<IArrayItemTemplateProps>;
  fieldsetTemplate: React.ComponentType<IFieldsetTemplate>;
}
