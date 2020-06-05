

export default interface IInputContext<C = any, P = any, R = any> {

    /**
     * arbitrary contextual data passed to all Input decorators
     */
    context: C;

    /**
     * parent object that contains this property
     */
    parent: P;

    /**
     * root-level object provided to Form component
     */
    root: R;
    
}
