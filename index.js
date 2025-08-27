class DailyTimeline {
    constructor() {
        this.dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
        this.isEditing = false;
        this.editingId = null;
        this.currentFilter = 'all';
        this.currentImageData = null;
        
        this.initializeEventListeners();
        this.renderTimeline();
        this.createImageModal();
    }

    initializeEventListeners() {
        const form = document.getElementById('daily-form');
        const cancelBtn = document.getElementById('cancel-btn');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const imageInput = document.getElementById('task-image');

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        cancelBtn.addEventListener('click', () => this.cancelEdit());
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
        
        // Handle image upload and preview
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        this.currentFilter = filter;
        this.renderTimeline();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            date: document.getElementById('task-date').value,
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            category: document.getElementById('task-category').value,
            duration: parseFloat(document.getElementById('task-duration').value),
            status: document.getElementById('task-status').value,
            image: this.currentImageData || null
        };

        if (this.isEditing) {
            this.updateTask(this.editingId, formData);
        } else {
            this.addTask(formData);
        }

        this.resetForm();
        this.renderTimeline();
    }

    addTask(taskData) {
        const task = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString()
        };
        
        this.dailyTasks.push(task);
        this.saveToLocalStorage();
        this.showNotification('Aktivitas berhasil ditambahkan!', 'success');
        this.currentImageData = null;
        this.clearImagePreview();
    }

    updateTask(id, taskData) {
        const index = this.dailyTasks.findIndex(t => t.id === id);
        if (index !== -1) {
            this.dailyTasks[index] = {
                ...this.dailyTasks[index],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            this.saveToLocalStorage();
            this.showNotification('Aktivitas berhasil diupdate!', 'success');
        }
    }

    deleteTask(id) {
        if (confirm('Apakah Anda yakin ingin menghapus aktivitas ini?')) {
            this.dailyTasks = this.dailyTasks.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.renderTimeline();
            this.showNotification('Aktivitas berhasil dihapus!', 'success');
        }
    }

    editTask(id) {
        const task = this.dailyTasks.find(t => t.id === id);
        if (task) {
            this.isEditing = true;
            this.editingId = id;
            
            document.getElementById('task-date').value = task.date;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description;
            document.getElementById('task-category').value = task.category;
            document.getElementById('task-duration').value = task.duration;
            document.getElementById('task-status').value = task.status;
            
            // Handle image if exists
            if (task.image) {
                this.currentImageData = task.image;
                this.showImagePreview(task.image.data);
            } else {
                this.currentImageData = null;
                this.clearImagePreview();
            }
            
            document.getElementById('form-title').textContent = 'Edit Aktivitas';
            document.getElementById('submit-btn').textContent = 'Update Aktivitas';
            document.getElementById('cancel-btn').style.display = 'inline-block';
        }
    }

    cancelEdit() {
        this.isEditing = false;
        this.editingId = null;
        this.resetForm();
        
        document.getElementById('form-title').textContent = 'Tambah Aktivitas Hari Ini';
        document.getElementById('submit-btn').textContent = 'Tambah Aktivitas';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                this.showNotification('Ukuran gambar terlalu besar. Maksimal 5MB.', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                this.currentImageData = {
                    name: file.name,
                    data: event.target.result,
                    type: file.type
                };
                this.showImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    showImagePreview(imageData) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${imageData}" alt="Preview">`;
        preview.classList.add('show');
    }

    clearImagePreview() {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = '';
        preview.classList.remove('show');
        document.getElementById('task-image').value = '';
    }

    createImageModal() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <span class="close-modal">&times;</span>
            <div class="modal-content">
                <img id="modal-image" src="" alt="Full size image">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking close button or outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'close-modal') {
                modal.classList.remove('show');
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                modal.classList.remove('show');
            }
        });
    }

    showImageModal(imageSrc) {
        const modal = document.querySelector('.image-modal');
        const modalImage = document.getElementById('modal-image');
        modalImage.src = imageSrc;
        modal.classList.add('show');
    }

    resetForm() {
        document.getElementById('daily-form').reset();
        document.getElementById('edit-id').value = '';
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('task-date').value = today;
        
        // Clear image
        this.currentImageData = null;
        this.clearImagePreview();
    }

    renderTimeline() {
        const timeline = document.getElementById('timeline');
        
        // Filter tasks based on current filter
        let filteredTasks = this.dailyTasks;
        if (this.currentFilter !== 'all') {
            filteredTasks = this.dailyTasks.filter(task => task.category === this.currentFilter);
        }
        
        if (filteredTasks.length === 0) {
            if (this.dailyTasks.length === 0) {
                timeline.innerHTML = `
                    <div class="empty-state">
                        <h3>Belum ada aktivitas</h3>
                        <p>Mulai dengan menambahkan aktivitas magang pertama Anda!</p>
                    </div>
                `;
            } else {
                timeline.innerHTML = `
                    <div class="empty-state">
                        <h3>Tidak ada aktivitas untuk kategori ini</h3>
                        <p>Coba pilih kategori lain atau tambah aktivitas baru.</p>
                    </div>
                `;
            }
            return;
        }

        // Sort tasks by date (newest first)
        const sortedTasks = [...filteredTasks].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        timeline.innerHTML = sortedTasks.map((task, index) => {
            const categoryClass = this.getCategoryClass(task.category);
            const statusClass = this.getStatusClass(task.status);
            const taskDate = new Date(task.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <div class="timeline-title">${task.title}</div>
                            <div class="timeline-category ${categoryClass}">${task.category}</div>
                        </div>
                        <div class="timeline-date">${taskDate}</div>
                        <div class="timeline-description">${task.description}</div>
                        ${task.image ? `
                            <div class="timeline-image">
                                <img src="${task.image.data}" alt="Aktivitas image" onclick="timeline.showImageModal('${task.image.data}')">
                            </div>
                        ` : ''}
                        <div class="timeline-meta">
                            <div class="timeline-duration">⏱️ ${task.duration} jam</div>
                            <div class="timeline-status ${statusClass}">${task.status}</div>
                        </div>
                        <div class="timeline-actions">
                            <button class="btn-edit" onclick="timeline.editTask(${task.id})">
                                Edit
                            </button>
                            <button class="btn-delete" onclick="timeline.deleteTask(${task.id})">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getCategoryClass(category) {
        const categoryMap = {
            'Belajar': 'category-belajar',
            'Praktik': 'category-praktik',
            'Meeting': 'category-meeting',
            'Review': 'category-review',
            'Debugging': 'category-debugging',
            'Testing': 'category-testing',
            'Dokumentasi': 'category-dokumentasi',
            'Lainnya': 'category-lainnya'
        };
        return categoryMap[category] || 'category-lainnya';
    }

    getStatusClass(status) {
        const statusMap = {
            'Selesai': 'status-selesai',
            'Sedang Berjalan': 'status-sedang-berjalan',
            'Belum Selesai': 'status-belum-selesai',
            'Ditunda': 'status-ditunda'
        };
        return statusMap[status] || 'status-belum-selesai';
    }

    saveToLocalStorage() {
        localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks));
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#00b894' : '#667eea'};
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.timeline = new DailyTimeline();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('task-date').value = today;
});
