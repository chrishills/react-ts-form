import IInputMeta from "../input/IInputMeta";

// tslint:disable-next-line:no-empty-interface
export interface IInputTemplateProps extends IInputMeta {
  children?: React.ReactChild
  labelFor?: string;
  path: string;
}

export interface IArrayItemTemplateProps {
  canSortUp: boolean;
  canSortDown: boolean;
  canRemove: boolean;
  sortUp: () => void;
  sortDown: () => void;
  remove: () => void;
  move: (targetIndex: number) => void;
  index: number;
  path: string;
  children?: React.ReactNode
}

export type IFieldsetTemplate = React.PropsWithChildren<{ name: string; title: React.ReactNode; }>;

export interface IFormMeta {
  InputTemplate: React.ComponentType<IInputTemplateProps>;
  ArrayItemTemplate: React.ComponentType<IArrayItemTemplateProps>;
  FieldsetTemplate: React.ComponentType<IFieldsetTemplate>;
}
