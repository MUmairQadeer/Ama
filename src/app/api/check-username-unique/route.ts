
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";



const UsernameQuerySchema =z.object({
    username:usernameValidation,
})
  let message =""

export async function GET(request:Request){
    await dbConnect();

    try {
        const {searchParams} =new URL(request.url)
       const queryParams ={
        username:searchParams.get("username")
       }
        
        //vlidate with zod

        const result =UsernameQuerySchema.safeParse(queryParams)

        
         message = result?.error?.errors?.[0]?.message || "Invalid input"
        if(!result.success){
            return Response.json({
                success:false,
                message,
            },{
                status:400
            })
        }

        const existingVerifiedUser= await UserModel.findOne({
            username :result.data.username ,
             isVerified:true
        })
        if(existingVerifiedUser){
             console.log("existingVerifiedUser",existingVerifiedUser) 
            return Response.json({
                success:false,
                message:"Username already taken"
            },{
                status:400
            })
        }
          
        else{
            return Response.json({
                success:true,
                message:'Username is unique'
            } ,{status:400})
        }
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success:false,
            message,
        },{
            status:500
        })
    }
}