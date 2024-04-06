class ApiError extends Error {
    constructor(
        statusCode,
        messag= "Something went wrong",
        error = [],
        stack = ""
    ){
        super(messag)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success  = false;
        this.error =  error

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export { ApiError }