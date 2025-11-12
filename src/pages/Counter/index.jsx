import React, { useState, useCallback } from 'react';
    // em bọc CouterA bằng memo để tránh bị render linh tinh
    // React.memo() sẽ so sánh props cũ và mới, chỉ re-render khi props thay đổi
    const CounterA = React.memo(({ count, onIncrease})=>{
        console.log("A re-render");
        
        return (
        <div className='mb-[20px] justify-center flex column'>
        <h2 className='m-[20px] font-bold  w-[150px]'>Count A is {count}</h2>
        
        <button className='cursor-pointer p-[20px] font-bold flex flex-col justify-center bg-[blue] text-[aliceblue] rounded-[20px] [box-shadow:2px_11px_24px_0px_rgba(0,0,0,0.75)] '
        onClick={onIncrease}
        >
        Increase Count A
        </button>
        </div>
        )
      
    })
    const CounterB = React.memo(({ count, onIncrease})=>{
        console.log("B re-render");
        return (
        <div className='mb-[20px] justify-center flex column '>
        <h2 className='m-[20px] font-bold w-[150px]'>Count B is {count}</h2>
      
        <button className='cursor-pointer p-[20px] font-bold flex flex-col justify-center bg-[blue] text-[aliceblue] rounded-[20px] [box-shadow:2px_11px_24px_0px_rgba(0,0,0,0.75)] '
        onClick={onIncrease}
        >
        Increase Count B
        </button>
        </div>
        )
      
    })
    function Counter(){
    //gọi useState để lưu trạng thái count
    const [countA, setCountA] = useState(0);
    const [countB, setCountB] = useState(0);
    //dưới này sẽ gọi useCallback kèm biến prev giúp giá trị không bị render thêm mỗi khi gọi hàm
    const handleIncreaseA = useCallback(()=>{
        setCountA(prev => prev +1)
    }, [])
    const handleIncreaseB = useCallback(()=>{
        setCountB(prev => prev +1)
    }, [])
    return(   <div style={{ 
      maxWidth: '600px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
{/* truyền vào trạng thái của useState với handleIncrease để xử lý mỗi khi gia tăng trạng thái */}
      <CounterA count={countA} onIncrease={handleIncreaseA} />
      
      <CounterB count={countB} onIncrease={handleIncreaseB} />
    </div>);
}

export default Counter;