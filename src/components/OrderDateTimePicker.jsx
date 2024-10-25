import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, setMinutes, setSeconds, format, isBefore, isAfter } from "date-fns";

const OrderDateTimePicker = ({ setDeliveryDateTime }) => {
  const roundToNext15 = date => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    return setMinutes(setSeconds(date, 0), roundedMinutes);
  };

  const getMinDeliveryTime = () => {
    const now = new Date();
    return roundToNext15(addMinutes(now, 30));
  };

  const getToday = () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  };

  const [selectedTime, setSelectedTime] = useState(getMinDeliveryTime());

  const formatDateForCheckout = date => {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  };

  const handleTimeChange = time => {
    const today = new Date();
    today.setHours(time.getHours(), time.getMinutes(), 0);
    setSelectedTime(today);
    setDeliveryDateTime(formatDateForCheckout(today));
  };

  const filterAvailableTimes = time => {
    const minTime = getMinDeliveryTime();
    const maxTime = new Date().setHours(22, 30);
    return isAfter(time, minTime) && isBefore(time, maxTime) && time.getMinutes() % 15 === 0;
  };

  return (
    <div className="my-3">
      <strong>Select delivery time</strong>
      <DatePicker
        selected={selectedTime}
        onChange={handleTimeChange}
        showTimeSelect
        showTimeSelectOnly
        dateFormat="HH:mm"
        minDate={getToday()}
        minTime={getMinDeliveryTime()}
        maxTime={new Date().setHours(22, 30)}
        timeIntervals={15}
        timeFormat="HH:mm"
        filterTime={filterAvailableTimes}
        placeholderText="Select an available time"
        disabledKeyboardNavigation
      />
    </div>
  );
};

export default OrderDateTimePicker;
