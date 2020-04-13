import { IInputMeta } from "../input/IInputMeta";

// tslint:disable-next-line:no-empty-interface
export interface IInputTemplateProps extends IInputMeta {

}

export interface IArrayItemTemplateProps {
  canSortUp: boolean;
  canSortDown: boolean;
  canRemove: boolean;
  sortUp: () => void;
  sortDown: () => void;
  remove: () => void;
}

export interface IFieldsetTemplate {
  title: React.ReactNode;
  children?: React.ReactNode;
}

export interface IFormMeta {
  inputTemplate: React.ComponentType<IInputTemplateProps>;
  arrayItemTemplate: React.ComponentType<IArrayItemTemplateProps>;
  fieldsetTemplate: React.ComponentType<IFieldsetTemplate>;
}
