import { useCallback, useState, useEffect } from "react";

function CountDown (){
    // lưu giá trị với useState
    const [value, setValue] = useState(10)
    // xử lý -1 giá trị mỗi giây với useCallback thông qua biến prev để biết giá trị trước
    const handleCountDown = useCallback(() => {
        setValue(prev => prev - 1)
    }, [])
    //dùng useEffect để gọi lại hàm mỗi khi giá trị thay đổi vì nếu không có debt của useEffect thì setInterval sẽ không gọi lại hàm mỗi khi thực thi
    useEffect(() => {
        const id = setInterval(() => {
            handleCountDown()
        }, 1000)
        return () => clearInterval(id)
    }, [handleCountDown]) // <----- MẤU CHỐT GỌI LẠI HÀM KHI COMPONENT ĐƯỢC MOUNT

    return(
        //giao diện
        <div className="flex  mt-[50px] justify-center align-center">
            <h1 className="text-[50px] font-bold">Count is {value}</h1>
        </div>
    );
}
export default CountDown;