import React, { useState } from 'react';
import axios from 'axios';


const UploadFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    // 控制参数
    const [controlParam, setControlParam] = useState({
        // 假设你有几个字段，这里只是示例
        sheet_index: 0,
        ignore_head_row_count: 0
    });

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setControlParam((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert('请选择需要上传的Excel文件!!');
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('file', selectedFile);

        // 将formData对象转化为JSON字符串
        const jsonString = JSON.stringify(controlParam);
        formDataToSend.append('control_param', jsonString);

        try {
            const response = await axios.post('http://localhost:8080/medicine/report/statistics/upload', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                const respData = response.data
                console.log('---------', JSON.stringify(respData.data))
                alert(JSON.stringify(respData.data));
                // Clear the selected file if needed
                setSelectedFile(null);
            } else {
                alert('Excel文件上传失败.');
            }
        } catch (error) {
            console.error('Excel文件上传发生异常:', error);
            alert('An error occurred while uploading the file.');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            <button onClick={handleFileUpload}>
                上传Excel
            </button>
            <label htmlFor="excelSheetIndex">Excel sheet位置(默认0):</label>
            <input type="text" id='excelSheetIndex' defaultValue={controlParam.sheet_index} onChange={handleInputChange}/>
            <label htmlFor="excelIgnoreHeadRowCount">ExcelExcel忽略头部行数:</label>
            <input type="text" id='excelIgnoreHeadRowCount' defaultValue={controlParam.ignore_head_row_count} onChange={handleInputChange}/>

        </div>
    );
};

export default UploadFile;