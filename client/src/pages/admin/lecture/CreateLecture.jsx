import React, { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message);
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error]);

  console.log(lectureData);

  return (
    <div>
      <div className="flex-1 mx-10">
        <div className="mb-4">
          <h1 className="font-bold text-xl">
            Let's add lectures, add some basic details for your new lecture
          </h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse,
            aliquam.
          </p>
        </div>
        <div>
          <div className="space-y-4">
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Your Course Name"
            />
          </div>

          <div className="flex items-center gap-2 p-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/course/${courseId}`)}
            >
              Back
            </Button>
            <Button disabled={isLoading} onClick={createLectureHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Create "
              )}
            </Button>
          </div>
          <div>
            {lectureLoading ? (
              <p>Loading Lecture...</p>
            ) : lectureError ? (
              <p>Failed to load lectures.</p>
            ) : lectureData.lectures.length === 0 ? (
              <p>No lecture available</p>
            ) : (
              lectureData.lectures.map((lecture, index) => (
                <Lecture
                  key={lecture._id}
                  lecture={lecture}
                  courseId={courseId}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
