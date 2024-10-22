import Image from "next/image";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

interface DateProps {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const CustomInput = forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement>
>(({ onClick }, ref) => (
  <button className="ml-3" onClick={onClick} ref={ref}>
    <Image
      src="/icons/icon-calendar.svg"
      width={24}
      height={24}
      alt="캘린더 아이콘"
    />
  </button>
));

CustomInput.displayName = "CustomInput";

export default function TaskDate({ selectedDate, setSelectedDate }: DateProps) {
  const formattedDate =
    selectedDate instanceof Date &&
    moment(selectedDate).format("MM월 DD일 (ddd)");

  return (
    <div className="flex items-center">
      <h2 className="mr-3 text-text-lg font-medium text-text-primary">
        {formattedDate}
      </h2>
      <Image
        src="/icons/icon-leftArrow.svg"
        width={16}
        height={16}
        alt="왼쪽 버튼 아이콘"
      />
      <Image
        className="ml-1"
        src="/icons/icon-rightArrow.svg"
        width={16}
        height={16}
        alt="오른쪽 버튼 아이콘"
      />
      <div className="custom-datepicker-wrapper">
        <DatePicker
          onChange={setSelectedDate}
          selected={selectedDate}
          shouldCloseOnSelect
          customInput={<CustomInput />}
          popperPlacement="right"
        />
      </div>
    </div>
  );
}
