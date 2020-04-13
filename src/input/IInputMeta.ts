
export interface IInputMeta {
  title?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  intent?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  feedback?: React.ReactNode;
}
