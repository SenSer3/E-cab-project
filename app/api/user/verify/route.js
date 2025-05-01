import { connect } from '@/dbConfig/dbConn'
import User from '@/model/userData'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(req){
    try {
        const reqbody = await req.json()
        const {token} = reqbody

        const user = await User.findOne({verifyToken:token,verifyTokenExpiry :{$gt:Date.now()}})

        if (!user){
            return NextResponse.json({error:"invalid token",},{status:400})
        }
        console.log(user)

        user.isVerfied = true
        user.verifyToken= undefined
        user.verifyTokenExpiry=undefined

        await user.save()

        return NextResponse.json({message:"Email verified"},{success:true},{status:200})

    } catch (error) {
        return NextResponse.json({error:error.message,},{status:500})
    }
}