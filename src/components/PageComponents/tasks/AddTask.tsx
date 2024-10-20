import Input from "@/components/@shared/UI/Input";
import InputLabel from "@/components/@shared/UI/InputLabel";
import React, { useState } from "react";
import moment from "moment";
import Button from "@/components/@shared/UI/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import addTask from "@/core/api/tasks/addTask";
import { AddTaskForm } from "@/core/dtos/tasks/tasks";
import FrequencyDay from "./FrequencyDay";
import FrequencyDate from "./FrequencyDate";
import FrequencyDropdown from "./FrequencyDropdown";

interface AddTaskProps {
  onCloseAddTask: () => void;
  groupId: string;
  selectedTaskListId: number;
}

export default function AddTask({
  onCloseAddTask,
  groupId,
  selectedTaskListId,
}: AddTaskProps) {
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    startDate: new Date().toISOString(),
    frequencyType: "",
  });

  const queryClient = useQueryClient();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFrequencyChange = (value: string) => {
    setTaskData({ ...taskData, frequencyType: value });
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      setTaskData({ ...taskData, startDate: selectedDate.toISOString() });
    }
  };

  const formattedNewDate = moment(new Date()).format("yyyy년 MM월 DD일");

  const addTaskMutation = useMutation({
    mutationFn: (addTaskForm: AddTaskForm) =>
      addTask({ groupId, selectedTaskListId }, addTaskForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error adding task:", error);
    },
  });

  const isFormValid =
    taskData.name.trim() !== "" &&
    taskData.frequencyType !== "" &&
    taskData.startDate !== null &&
    taskData.description.trim() !== "";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const dataToSubmit = {
        ...taskData,
        ...(taskData.frequencyType === "MONTHLY" && {
          monthDay: 0,
        }),
        ...(taskData.frequencyType === "WEEKLY" && {
          weekDays: [],
        }),
      };
      onCloseAddTask();
      addTaskMutation.mutate(dataToSubmit);
    }
  };

  return (
    <div className="h-auto w-[24rem] px-6 py-8">
      <h2 className="text-center text-text-lg text-text-primary">
        할 일 만들기
      </h2>
      <p className="mb-6 mt-4 text-center text-text-md text-text-default">
        할 일은 실제로 행동 가능한 작업 중심으로 <br />
        작성해주시면 좋습니다.
      </p>
      <form
        className="flex flex-col items-center gap-6"
        onSubmit={handleFormSubmit}
      >
        <InputLabel className="text-md text-text-primary" label="할 일 제목">
          <Input
            name="name"
            type="text"
            value={taskData.name}
            onChange={handleInputChange}
            className="w-[21rem]"
            placeholder="할 일 제목을 입력해주세요"
          />
        </InputLabel>
        <InputLabel
          className="text-md text-text-primary"
          label="시작 날짜 및 시간"
        >
          <DatePicker
            className="h-12 w-[21rem] rounded-xl border-border-primary bg-background-secondary text-text-primary placeholder:text-text-default hover:border-interaction-hover focus:border-interaction-hover focus:outline-none focus:ring-0"
            onChange={handleDateChange}
            selected={new Date(taskData.startDate)}
            showTimeSelect
            placeholderText={`${formattedNewDate} 00:00`}
            dateFormat="yyyy년 MM월 dd일 HH:mm aa"
            timeFormat="HH:mm aa"
            timeIntervals={30}
          />
        </InputLabel>
        <InputLabel className="text-md text-text-primary" label="반복 설정">
          <FrequencyDropdown onChange={handleFrequencyChange} />
        </InputLabel>
        {taskData.frequencyType === "WEEKLY" && <FrequencyDay />}
        {taskData.frequencyType === "MONTHLY" && <FrequencyDate />}
        <InputLabel className="text-md text-text-primary" label="할 일 메모">
          <textarea
            name="description"
            onInput={handleInput}
            onChange={handleInputChange}
            value={taskData.description}
            className="h-auto w-full resize-none overflow-hidden rounded-xl border-border-primary bg-background-secondary p-4 placeholder:text-text-default hover:border-interaction-hover focus:border-interaction-hover focus:outline-none focus:ring-0"
            placeholder="메모를 입력해주세요."
          />
        </InputLabel>
        <Button
          variant="solid"
          size="large"
          onClick={handleFormSubmit}
          disabled={!isFormValid || addTaskMutation.isPending}
        >
          만들기
        </Button>
      </form>
    </div>
  );
}
