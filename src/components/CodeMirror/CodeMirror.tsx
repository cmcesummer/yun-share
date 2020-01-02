type Ifn = (...arg: any[]) => any;

export interface ICodeMirrorProps {
    actionUrl?: string;
    className?: string;
    mode?: "markdown" | "javascript";
    theme?: "material";
    onScroll?: Ifn;
    onChange?: Ifn;
    onPaste?: Ifn;
    onDrop?: Ifn;
    onSave?: Ifn;
}
