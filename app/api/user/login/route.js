import { connect } from '@/dbConfig/dbConn'
import User from '@/model/userData'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helper/mailer'
import jwt from 'jsonwebtoken'

connect()

// export async function POST(req){
//     try {
        
//         const validatePass = await bcryptjs.compare(password,user.password)

//         if (!validatePass){
//             return NextResponse.json({message:"Invalid credentials"},{status:400})
//         }

//         const tokenData = await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:'1d'})

//        const response =  NextResponse.json({message:"Logged in successfully"},{success:true})

//        response.cookies.set('token',tokenData,{
//         httpOnly:true
//        })
//        return response

//     } catch (error) {
//         return NextResponse.json({error:error.message},{status:400})
//     }
// }


export async function POST(request){
    try {

        const reqBody = await request.json()
        const {email, password} = reqBody;
        console.log(reqBody);

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("user exists");
        
        
        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(user);
        
        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true, 
            
        })
        return response;

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}