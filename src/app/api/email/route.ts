import  EmailPage  from "@/app/emails/page";
import { resend } from "@/lib/email/index";
import { emailSchema } from "@/lib/email/utils";
import { NextResponse } from "next/server";
import {Button,Html} from "@react-email/components";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email } = emailSchema.parse(body);
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Hello world!",
      react: EmailPage({ firstName: name }),
      text: "Email powered by Resend.",
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
