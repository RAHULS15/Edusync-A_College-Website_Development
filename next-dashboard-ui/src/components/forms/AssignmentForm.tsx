"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const assignmentSchema = z.object({
  title: z.string().min(1, { message: "Title is required!" }),
  startDate: z.string().min(1, { message: "Start Date is required!" }),
  dueDate: z.string().min(1, { message: "Due Date is required!" }),
  lessonId: z.string().min(1, { message: "Lesson is required!" }),
});

type AssignmentInputs = z.infer<typeof assignmentSchema>;

const AssignmentForm = ({
  type,
  data,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  relatedData: { lessons: any[] };
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentInputs>({
    resolver: zodResolver(assignmentSchema),
  });

  const onSubmit = handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create Assignment" : "Update Assignment"}
      </h1>
      <InputField
        label="Title"
        name="title"
        defaultValue={data?.title}
        register={register}
        error={errors.title}
      />
      <InputField
        label="Start Date"
        name="startDate"
        type="date"
        defaultValue={data?.startDate}
        register={register}
        error={errors.startDate}
      />
      <InputField
        label="Due Date"
        name="dueDate"
        type="date"
        defaultValue={data?.dueDate}
        register={register}
        error={errors.dueDate}
      />
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-500">Lesson</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("lessonId")}
          defaultValue={data?.lessonId}
        >
          <option value="" disabled>
            Select Lesson
          </option>
          {relatedData.lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
        {errors.lessonId?.message && (
          <p className="text-xs text-red-400">{errors.lessonId.message}</p>
        )}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default AssignmentForm;
