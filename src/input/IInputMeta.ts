
/**
 * display metadata for input templates and components
 */
export default interface IInputMeta {

  /**
   * field name
   */
  title?: React.ReactNode;

  /**
   * field help text/description
   */
  description?: React.ReactNode;

  /**
   * indicate to input template that this field is required
   */
  required?: boolean;

  /**
   * indicate to form component that interaction should be disabled.
   */
  disabled?: boolean;

  /**
   * indicate to templates and input components what intent style to use.
   */
  intent?: 'primary' | 'info' | 'success' | 'warning' | 'danger';

  /**
   * feedback to render in input template
   */
  feedback?: React.ReactNode;

}
