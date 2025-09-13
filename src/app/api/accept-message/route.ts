import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user :User = session?.user as User;
    // console.log("user123",user)


    if (!session ||!session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized User" }, { status: 401 });
    }

    const userId = user._id;
    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, { isAcceptingMessages: acceptMessages }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({success: false, message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({  success: true, message: "Message acceptance status updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Error updating user" }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user :User = session?.user as User;



    if (!session ||!session.user) {
        return NextResponse.json({ success: false, message: "Unauthorized User" }, { status: 401 });
    }

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
    
        if (!foundUser) {
            return NextResponse.json({success: false, message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({
           success: true,
           isAcceptingMessages: foundUser.isAcceptingMessage
        }, { status: 200 });
    } catch (error) {
        console.error("Error getting message acceptance status:", error);
        return NextResponse.json({ success: false, message: "Error getting message acceptance status" }, { status: 500 });
    }
}