// Quản lý chức năng admin
const AdminManager = {
    // Mật khẩu admin (có thể thay đổi)
    ADMIN_PASSWORD: "admin123",
    
    // Khởi tạo admin
    init() {
        this.bindEvents();
        // Hiển thị khu vực admin
        document.getElementById('admin-section').style.display = 'block';
    },

    // Gắn sự kiện cho các nút admin
    bindEvents() {
        document.getElementById('login-admin').addEventListener('click', () => this.login());
        document.getElementById('logout-admin').addEventListener('click', () => this.logout());
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('reset-data').addEventListener('click', () => this.resetData());
        
        // Cho phép đăng nhập bằng phím Enter
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.login();
            }
        });
    },

    // Đăng nhập admin
    login() {
        const password = document.getElementById('admin-password').value;
        
        if (password === this.ADMIN_PASSWORD) {
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-content').style.display = 'block';
            App.showNotification('Đăng nhập thành công!', 'success');
            this.updateStats();
        } else {
            App.showNotification('Mật khẩu không đúng!', 'error');
        }
    },

    // Đăng xuất admin
    logout() {
        document.getElementById('admin-login').style.display = 'flex';
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('admin-password').value = '';
        App.showNotification('Đã đăng xuất!', 'success');
    },

    // Xuất dữ liệu
    exportData() {
        const dataStr = StorageManager.exportData();
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'survey-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        App.showNotification('Dữ liệu đã được xuất thành công!', 'success');
    },

    // Xóa dữ liệu
    resetData() {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
            StorageManager.clearSurveyData();
            this.updateStats();
            App.showNotification('Tất cả dữ liệu đã được xóa!', 'success');
        }
    },

    // Cập nhật thống kê
    updateStats() {
        const surveyData = StorageManager.getSurveyData();
        
        // Tổng số người tham gia
        document.getElementById('total-participants').textContent = surveyData.length;
        
        // Cập nhật các biểu đồ
        this.updateAgeDistribution(surveyData);
        this.updateFavLiterature(surveyData);
        this.updateFavCharacter(surveyData);
        this.updateReadingFormat(surveyData);
        this.updateImportantFactor(surveyData);
        this.updateVietnamLiterature(surveyData);
    },

    // Cập nhật phân bố độ tuổi
    updateAgeDistribution(surveyData) {
        const ageGroups = {
            'under18': 'Dưới 18',
            '18-25': '18-25',
            '26-35': '26-35',
            '36-50': '36-50',
            'over50': 'Trên 50'
        };
        
        const counts = {};
        Object.keys(ageGroups).forEach(key => counts[key] = 0);
        
        surveyData.forEach(response => {
            if (response.age && counts.hasOwnProperty(response.age)) {
                counts[response.age]++;
            }
        });
        
        let html = '';
        Object.entries(counts).forEach(([key, count]) => {
            const percentage = surveyData.length > 0 ? (count / surveyData.length * 100).toFixed(1) : 0;
            html += `
                <div>
                    <div>${ageGroups[key]}: ${count} (${percentage}%)</div>
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        document.getElementById('age-distribution').innerHTML = html;
    },

    // Cập nhật tác phẩm yêu thích
    updateFavLiterature(surveyData) {
        const works = {
            'truyen-kieu': 'Truyện Kiều',
            'chi-pheo': 'Chí Phèo',
            'vo-nhat': 'Vợ nhặt',
            'vo-chong-a-phu': 'Vợ chồng A Phủ'
        };
        
        const counts = {};
        Object.keys(works).forEach(key => counts[key] = 0);
        
        surveyData.forEach(response => {
            if (response.q1 && counts.hasOwnProperty(response.q1)) {
                counts[response.q1]++;
            }
        });
        
        let html = '';
        Object.entries(counts).forEach(([key, count]) => {
            const percentage = surveyData.length > 0 ? (count / surveyData.length * 100).toFixed(1) : 0;
            html += `
                <div>
                    <div>${works[key]}: ${count} (${percentage}%)</div>
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        document.getElementById('fav-literature').innerHTML = html;
    },

    // Cập nhật nhân vật ấn tượng
    updateFavCharacter(surveyData) {
        const characters = {
            'thuy-kieu': 'Thúy Kiều',
            'chi-pheo': 'Chí Phèo',
            'thi-no': 'Thị Nở',
            'a-phu': 'A Phủ'
        };
        
        const counts = {};
        Object.keys(characters).forEach(key => counts[key] = 0);
        
        surveyData.forEach(response => {
            if (response.q2 && counts.hasOwnProperty(response.q2)) {
                counts[response.q2]++;
            }
        });
        
        let html = '';
        Object.entries(counts).forEach(([key, count]) => {
            const percentage = surveyData.length > 0 ? (count / surveyData.length * 100).toFixed(1) : 0;
            html += `
                <div>
                    <div>${characters[key]}: ${count} (${percentage}%)</div>
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        document.getElementById('fav-character').innerHTML = html;
    },

    // Cập nhật định dạng đọc sách
    updateReadingFormat(surveyData) {
        const formats = {
            'sach-giay': 'Sách giấy',
            'ebook': 'Ebook',
            'audio': 'Sách nói',
            'online': 'Đọc online'
        };
        
        const counts = {};
        Object.keys(formats).forEach(key => counts[key] = 0);
        
        surveyData.forEach(response => {
            if (response.q3) {
                response.q3.forEach(format => {
                    if (counts.hasOwnProperty(format)) {
                        counts[format]++;
                    }
                });
            }
        });
        
        let html = '';
        Object.entries(counts).forEach(([key, count]) => {
            const percentage = surveyData.length > 0 ? (count / surveyData.length * 100).toFixed(1) : 0;
            html += `
                <div>
                    <div>${formats[key]}: ${count} (${percentage}%)</div>
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        document.getElementById('reading-format').innerHTML = html;
    },

    // Cập nhật yếu tố quan trọng
    updateImportantFactor(surveyData) {
        const factors = {
            'cau-truc': 'Cấu trúc và kỹ thuật',
            'nhan-vat': 'Nhân vật và tính cách',
            'chu-de': 'Chủ đề và thông điệp',
            'ngon-ngu': 'Ngôn ngữ và hình ảnh'
        };
        
        const counts = {};
        Object.keys(factors).forEach(key => counts[key] = 0);
        
        surveyData.forEach(response => {
            if (response.q4 && counts.hasOwnProperty(response.q4)) {
                counts[response.q4]++;
            }
        });
        
        let html = '';
        Object.entries(counts).forEach(([key, count]) => {
            const percentage = surveyData.length > 0 ? (count / surveyData.length * 100).toFixed(1) : 0;
            html += `
                <div>
                    <div>${factors[key]}: ${count} (${percentage}%)</div>
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        document.getElementById('important-factor').innerHTML = html;
    },

    // Cập nhật đánh giá văn học Việt Nam
    updateVietnamLiterature(surveyData) {
        const ratings = {
            'rat-tot': 'Rất phát triển',
            'tot': 'Phát triển tốt',
            'binh-thuong': 'Bình thường',
            'can-cai-thien': 'Cần cải thiện'
        };
        
        const counts = {};
        Object.keys(ratings).forEach(key => counts[key] = 0);
        
        surveyData.forEach(response => {
            if (response.q5 && counts.hasOwnProperty(response.q5)) {
                counts[response.q5]++;
            }
        });
        
        let html = '';
        Object.entries(counts).forEach(([key, count]) => {
            const percentage = surveyData.length > 0 ? (count / surveyData.length * 100).toFixed(1) : 0;
            html += `
                <div>
                    <div>${ratings[key]}: ${count} (${percentage}%)</div>
                    <div class="bar" style="width: ${percentage}%"></div>
                </div>
            `;
        });
        
        document.getElementById('vietnam-literature').innerHTML = html;
    }
};