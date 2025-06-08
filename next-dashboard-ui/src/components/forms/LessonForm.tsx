"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const lessonSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  subjectId: z.string().min(1, { message: "Subject is required!" }),
  teacherId: z.string().min(1, { message: "Teacher is required!" }),
  startTime: z.string().min(1, { message: "Start Time is required!" }),
  endTime: z.string().min(1, { message: "End Time is required!" }),
  room: z.string().min(1, { message: "Room is required!" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

type LessonInputs = z.infer<typeof lessonSchema>;

const LessonForm = ({
  type,
  data,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  relatedData: { subjects: any[]; teachers: any[] };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonInputs>({
    resolver: zodResolver(lessonSchema),
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Lesson" : "Update Lesson"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Lesson Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjectId}
          >
            <option value="" disabled>
              Select Subject
            </option>
            {relatedData.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">{errors.subjectId.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
          >
            <option value="" disabled>
              Select Teacher
            </option>
            {relatedData.teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">{errors.teacherId.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Start Time"
          name="startTime"
          type="time"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="time"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
        />
        <InputField
          label="Room"
          name="room"
          defaultValue={data?.room}
          register={register}
          error={errors?.room}
        />
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
        <label
          className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
          htmlFor="img"
        >
          <Image src="/upload.png" alt="" width={28} height={28} />
          <span>Upload Image</span>
        </label>
        <input type="file" id="img" {...register("img")} className="hidden" />
        {errors.img?.message && (
          <p className="text-xs text-red-400">{errors.img.message}</p>
        )}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
