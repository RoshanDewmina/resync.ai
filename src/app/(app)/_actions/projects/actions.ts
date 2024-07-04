"use server"
import {auth} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const {userId : clerkUserId} = auth()

export async function fetchProjects() {

    if(!clerkUserId){
            redirect("/sign-in")
    }

    try {
            const user = await db.user.findUnique({
                where: { clerkUserId },
                include: { projects: true },
            });
    
            if (user) {
                return user.projects;
            } else {
                throw new Error('User not found');
            }
            return (user?.projects)
        } catch (error: any) {
            console.error('Error fetching projects:', error);
            return  'Internal server error';
        }

}