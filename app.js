// Ứng dụng chính
const App = {
    // Khởi tạo ứng dụng
    init() {
        this.bindEvents();
        AdminManager.init();
    },

    // Gắn sự kiện
    bindEvents() {
        // Sự kiện gửi khảo sát
        document.getElementById('submit-survey').addEventListener('click', () => this.submitSurvey());
        
        // Sự kiện cho các lựa chọn
        this.bindOptionEvents();
    },

    // Gắn sự kiện cho các lựa chọn
    bindOptionEvents() {
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', function() {
                const input = this.querySelector('input');
                if (input.type === 'radio') {
                    // Bỏ chọn tất cả các radio cùng name
                    const name = input.name;
                    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
                        radio.closest('.option').classList.remove('selected');
                    });
                }
                
                // Đánh dấu lựa chọn hiện tại
                if (input.type === 'checkbox') {
                    input.checked = !input.checked;
                } else {
                    input.checked = true;
                }
                
                this.classList.toggle('selected', input.checked);
            });
        });
    },

    // Xử lý gửi khảo sát
    submitSurvey() {
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        
        // Kiểm tra câu hỏi bắt buộc
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        const q4 = document.querySelector('input[name="q4"]:checked');
        const q5 = document.querySelector('input[name="q5"]:checked');
        
        if (!q1 || !q2 || !q4 || !q5) {
            this.showNotification('Vui lòng trả lời tất cả các câu hỏi bắt buộc!', 'error');
            return;
        }
        
        // Thu thập dữ liệu từ checkbox (câu hỏi 3)
        const q3Checkboxes = document.querySelectorAll('input[name="q3"]:checked');
        const q3Values = Array.from(q3Checkboxes).map(cb => cb.value);
        
        // Tạo đối tượng dữ liệu khảo sát
        const surveyResponse = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            name: name || 'Ẩn danh',
            age: age,
            q1: q1.value,
            q2: q2.value,
            q3: q3Values,
            q4: q4.value,
            q5: q5.value
        };
        
        // Lưu dữ liệu
        StorageManager.addSurveyResponse(surveyResponse);
        
        // Hiển thị thông báo thành công
        this.showNotification('Cảm ơn bạn đã tham gia khảo sát!', 'success');
        
        // Reset form
        this.resetForm();
        
        // Cập nhật thống kê nếu admin đang đăng nhập
        if (document.getElementById('admin-content').style.display === 'block') {
            AdminManager.updateStats();
        }
    },

    // Reset form
    resetForm() {
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('.option').forEach(option => option.classList.remove('selected'));
    },

    // Hiển thị thông báo
    showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
};

// Khởi chạy ứng dụng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});