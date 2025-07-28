/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleZodError = (err: any): TGenericErrorResponse => {
    const errorSources: any = []
    err.issues.forEach((issue: any) => {
        errorSources.push({
            //path : "nickname iside lastname inside name"
            // path: issue.path.length > 1 && issue.path.reverse().join(" inside "),

            path: issue.path[issue.path.length - 1],
            message: issue.message
        })
    })
   return {
    message:"Zod Error",
    errorSources,
    statusCode:400
   }
}