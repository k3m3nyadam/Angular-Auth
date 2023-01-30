export class Alert{
    id: string;
    type: AlertType;
    message: string;
    autoClose: boolean;
    keppAfterRootChange: boolean;
    fade: boolean;

    constructor(init: Partial<Alert>){
        Object.assign(this, init);
    }
}

export enum AlertType{
    Succes,
    Error,
    Info,
    Warning
}

export class AlertOptions{
    id?: string;
    autoClose?: boolean;
    keppAfterRootChange?: boolean;
}