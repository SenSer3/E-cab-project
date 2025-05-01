import { connect } from '@/dbConfig/dbConn'
import User from '@/model/userData'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helper/mailer'

connect()

export async function POST(req) {
  try {
    const reqBody = await req.json()
    const { username, email, password } = reqBody

    console.log(reqBody)

    const user = await User.findOne({ email })

    if (user) {
      return NextResponse.json({ error: 'User already exists', status: 400 })
    }

    const salt = await bcryptjs.genSalt(10)
    const hashpass = await bcryptjs.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashpass,
    })

    const savedUser = await newUser.save()
    console.log(savedUser)

    await sendEmail({ email, emailType: 'Verify', userId: savedUser.id })

    return NextResponse.json({
      message: 'user created',
      success: true,
      savedUser,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
