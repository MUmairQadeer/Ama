import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function DELETE(
    req: Request) {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split("/");
    const messageId = pathnameParts[pathnameParts.length - 1]; // last part of path
    // console.log("messageid", messageId);
    // console.log("url", url)
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;



    if (!session || !session.user) {
        return NextResponse.json
            ({ success: false, message: "Unauthorized User" },
                { status: 401 });
    }

    try {
        const updateResult = await UserModel.updateOne({ _id: user._id },
            { $pull: { messages: { _id: messageId } } });
        
        if (updateResult.modifiedCount === 0) {

            return NextResponse.json
                ({ success: false, message: "Message not found" }
                    , { status: 200 });
        }

        return NextResponse.json
            ({ success: true, message: "Message deleted successfully" }
                , { status: 200 });

    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json
            ({ message: "Error deleting message" }, { status: 500 });
    }

}