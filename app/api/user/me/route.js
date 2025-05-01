import { connect } from '@/dbConfig/dbConn'
import User from '@/model/userData'
import { NextRequest, NextResponse } from 'next/server'
import { getTokenData } from '@/helper/getTokenData'

connect()

export async function POST(req) {
    const userId = await getTokenData(req)
    const user = await User.findOne({_id:userId}).select("-password")

    return NextResponse.json({message:"User Found"},{data:user})

}