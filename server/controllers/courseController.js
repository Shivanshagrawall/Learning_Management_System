import { clerkClient  } from "@clerk/express";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";

// Get all Courses
export const getAllCourse=async(req,res)=>{
    try {
        const courses=await Course.find({isPublished:true}).select(['-courseContent','-enrolledStudents']).populate({path:'educator'});

        res.json({ success:true,courses});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

// Get Course by Id
export const getCourseId=async(req,res)=>{
    const {id}=req.params;
    try {
        const courseData=await Course.findById(id).populate({path:'educator'});
        
        // Remove lecture URL if isPreview is false
        courseData.courseContent.forEach(chapter=>{
            chapter.chapterContent.forEach(lecture=>{
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl="";
                }
            })
        })

        res.json({success:true,courseData});
    } catch (error) {
        req.json({success:false,message:error.message});
    }
}

