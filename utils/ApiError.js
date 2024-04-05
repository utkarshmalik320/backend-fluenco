class ApiError extends Error {
    constructor(
        statusCode,
        messag= "Something went wrong",
        error = [],
        statck = ""
    ){
        super(messag)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success  = false;
        this.error =  error

        if(statck){
            this.statck = statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export { ApiError }