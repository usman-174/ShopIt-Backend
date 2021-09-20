export class errorHandler extends Error {
    constructor(readonly  message: string,readonly statusCode:number = 500){
        super(message)
        this.statusCode = statusCode
    Error.captureStackTrace(this,this.constructor)
    }
}