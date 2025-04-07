document.addEventListener('DOMContentLoaded', function () {
    // ==================== Xử lý chuyển đổi nội dung ====================
    const navLinks = document.querySelectorAll('.account-nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');

    // Xử lý sự kiện click trên các mục điều hướng
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Xóa lớp active khỏi tất cả các mục điều hướng và phần nội dung
            navLinks.forEach(link => link.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Thêm lớp active vào mục được nhấp
            this.classList.add('active');

            // Hiển thị phần nội dung tương ứng
            const target = this.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });

    // Mặc định hiển thị phần "Thông tin tài khoản" khi trang được tải
    document.querySelector('.account-nav ul li a.active').click();

    // ==================== Xử lý sản phẩm đã xem gần đây ====================
    // Hàm thêm sản phẩm vào danh sách đã xem
    function addToRecentlyViewed(product) {
        // Kiểm tra xem sản phẩm có đầy đủ thông tin không
        if (!product.id || !product.name || !product.price || !product.image) {
            console.error('Sản phẩm không hợp lệ:', product);
            return; // Không thêm sản phẩm nếu thiếu thông tin
        }

        // Lấy danh sách hiện tại từ localStorage
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

        // Kiểm tra xem sản phẩm đã tồn tại trong danh sách chưa
        const existingProductIndex = recentlyViewed.findIndex(p => p.id === product.id);
        if (existingProductIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, xóa nó khỏi vị trí hiện tại
            recentlyViewed.splice(existingProductIndex, 1);
        }

        // Thêm sản phẩm vào đầu danh sách
        recentlyViewed.unshift(product);

        // Giới hạn danh sách chỉ lưu tối đa 5 sản phẩm
        if (recentlyViewed.length > 5) {
            recentlyViewed = recentlyViewed.slice(0, 5);
        }

        // Lưu danh sách mới vào localStorage
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }

    // Hàm hiển thị danh sách sản phẩm đã xem
    function displayRecentlyViewed() {
        const recentlyViewedList = document.getElementById('recently-viewed-list');
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

        if (recentlyViewed.length === 0) {
            recentlyViewedList.innerHTML = '<p>Bạn chưa xem sản phẩm nào gần đây.</p>';
        } else {
            // Tạo HTML cho từng sản phẩm, kiểm tra dữ liệu trước khi hiển thị
            const productItems = recentlyViewed
                .filter(product => product.id && product.name && product.price && product.image) // Lọc sản phẩm hợp lệ
                .map(product => `
                    <div class="product-item">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                `)
                .join('');

            // Hiển thị danh sách sản phẩm
            recentlyViewedList.innerHTML = productItems || '<p>Không có sản phẩm hợp lệ.</p>';
        }
    }

    // Hiển thị danh sách sản phẩm đã xem khi trang được tải
    displayRecentlyViewed();

    // Thêm sự kiện click vào từng sản phẩm
    const productLinks = document.querySelectorAll('.product-link');
    productLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                image: this.getAttribute('data-image')
            };

            // Thêm sản phẩm vào danh sách đã xem
            addToRecentlyViewed(product);
        });
    });

    // ==================== Xử lý sổ địa chỉ ====================
    // Hàm hiển thị danh sách địa chỉ
    function displayAddresses() {
        const addressList = document.getElementById('address-list');
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];

        if (addresses.length === 0) {
            addressList.innerHTML = '<p>Bạn chưa có địa chỉ nào.</p>';
        } else {
            // Tạo HTML cho từng địa chỉ
            const addressItems = addresses.map(address => `
                <div class="address-item">
                    <p><strong>${address.name}</strong></p>
                    <p>${address.phone}</p>
                    <p>${address.address}</p>
                    <button class="btn btn-danger btn-sm" onclick="deleteAddress(${address.id})">Xóa</button>
                </div>
            `).join('');

            // Hiển thị danh sách địa chỉ
            addressList.innerHTML = addressItems;
        }
    }

    // Hàm xóa địa chỉ
    window.deleteAddress = function (id) {
        let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        addresses = addresses.filter(address => address.id !== id);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        displayAddresses(); // Cập nhật lại danh sách
    };

    // Hiển thị danh sách địa chỉ khi trang được tải
    displayAddresses();

    // Thêm sự kiện click vào nút "Thêm địa chỉ mới"
    document.getElementById('add-address-btn').addEventListener('click', function () {
        // Lấy thông tin địa chỉ từ người dùng (ví dụ: qua form hoặc prompt)
        const name = prompt("Nhập tên:");
        const phone = prompt("Nhập số điện thoại:");
        const address = prompt("Nhập địa chỉ:");

        if (name && phone && address) {
            const newAddress = {
                id: Date.now(), // Tạo ID duy nhất
                name,
                phone,
                address
            };

            // Lấy danh sách địa chỉ hiện tại từ localStorage
            let addresses = JSON.parse(localStorage.getItem('addresses')) || [];

            // Thêm địa chỉ mới vào danh sách
            addresses.push(newAddress);

            // Lưu danh sách mới vào localStorage
            localStorage.setItem('addresses', JSON.stringify(addresses));

            // Cập nhật lại danh sách hiển thị
            displayAddresses();
        } else {
            alert("Vui lòng nhập đầy đủ thông tin!");
        }
    });
    document.addEventListener('DOMContentLoaded', function () {
        // ==================== Xử lý chuyển đổi nội dung ====================
        const navLinks = document.querySelectorAll('.account-nav ul li a');
        const contentSections = document.querySelectorAll('.content-section');
    
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
    
                navLinks.forEach(link => link.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
    
                this.classList.add('active');
    
                const target = this.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });
    
    document.querySelector('.account-nav ul li a.active').click();
    });
    document.addEventListener('DOMContentLoaded', function () {
        // Show add address form
        document.getElementById('add-address-btn').addEventListener('click', function () {
            document.getElementById('add-address-form').style.display = 'block';
        });
    
        // Add event listener for edit address buttons
        document.querySelectorAll('.edit-address-btn').forEach(button => {
            button.addEventListener('click', function () {
                const addressId = this.getAttribute('data-id');
                const editForm = document.getElementById('edit-address-form');
                editForm.action = `/edit_address/${addressId}/`;
                editForm.style.display = 'block';
            });
        });
    });
});