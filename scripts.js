// Quản lý lưu trữ dữ liệu
const StorageManager = {
    // Lấy dữ liệu khảo sát từ localStorage
    getSurveyData() {
        return JSON.parse(localStorage.getItem('surveyData')) || [];
    },

    // Lưu dữ liệu khảo sát vào localStorage
    saveSurveyData(data) {
        localStorage.setItem('surveyData', JSON.stringify(data));
    },

    // Thêm một phản hồi mới
    addSurveyResponse(response) {
        const data = this.getSurveyData();
        data.push(response);
        this.saveSurveyData(data);
        return data;
    },

    // Xóa tất cả dữ liệu
    clearSurveyData() {
        localStorage.removeItem('surveyData');
        return [];
    },

    // Xuất dữ liệu dưới dạng JSON
    exportData() {
        return JSON.stringify(this.getSurveyData(), null, 2);
    },

    // Kiểm tra xem có dữ liệu không
    hasData() {
        return this.getSurveyData().length > 0;
    }
};