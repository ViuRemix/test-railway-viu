document.addEventListener("DOMContentLoaded", function () {
    // 🎯 Xử lý tăng/giảm số lượng sản phẩm
    window.updateQuantity = function (change) {
        const quantityInput = document.getElementById("quantity");
        if (!quantityInput) return; // Null check
        let currentQuantity = parseInt(quantityInput.value);
        let maxStock = parseInt(quantityInput.max);

        let newQuantity = currentQuantity + change;

        // Đảm bảo số lượng không nhỏ hơn 1 hoặc vượt quá tồn kho
        if (newQuantity >= 1 && newQuantity <= maxStock) {
            quantityInput.value = newQuantity;
        }
    };

    // 🎯 Xử lý khi bấm nút thêm vào giỏ hàng
    const addToCartBtn = document.getElementById("addToCartBtn");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function () {
            const productSlug = this.getAttribute("data-product-slug");
            const quantity = getQuantity(); // Get the selected quantity
            const size = getSelectedSize(); // Get the selected size
            fetch(`/cart/add/${productSlug}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({ quantity: quantity, size: size }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Không thể thêm vào giỏ hàng.");
                    }
                    return response.json();
                })
                .then((data) => {
                    showToast(data.success ? "Sản phẩm đã được thêm vào giỏ hàng!" : data.message, data.success ? "success" : "error");
                })
                .catch((error) => showToast("Đã xảy ra lỗi: " + error.message, "error"));
        });
    }

    // 🎯 Xử lý khi bấm nút mua ngay
    const buyNowBtn = document.querySelector(".add-to-cart[data-product-slug]");
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function () {
            const productSlug = this.getAttribute("data-product-slug");
            fetch(`/cart/add/${productSlug}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({ quantity: getQuantity() }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to add to cart.");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        window.location.href = "/checkout/";
                    } else {
                        showToast(data.message);
                    }
                })
                .catch((error) => showToast("An error occurred: " + error.message, "error"));
        });
    }

    // 🎯 Xử lý khi bấm nút thêm vào danh sách yêu thích
    const addToFavoritesBtn = document.getElementById("addToFavoritesBtn");
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener("click", function () {
            const productSlug = this.getAttribute("data-product-slug");
            fetch(`/favorites/add/${productSlug}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to add to favorites.");
                    }
                    return response.json();
                })
                .then((data) => {
                    showToast(data.message, data.success ? "success" : "error");
                })
                .catch((error) => showToast("An error occurred: " + error.message, "error"));
        });
    }

    // 📌 Hàm lấy CSRF Token để gửi request POST trong Django
    function getCSRFToken() {
        const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]");
        return csrfToken ? csrfToken.value : "";
    }

    // 📌 Hàm lấy số lượng sản phẩm từ input
    function getQuantity() {
        const quantityInput = document.getElementById("quantity");
        return quantityInput ? parseInt(quantityInput.value, 10) : 1;
    }

    // 📌 Hàm lấy kích thước được chọn
    function getSelectedSize() {
        const activeSizeButton = document.querySelector(".size-btn.active");
        return activeSizeButton ? activeSizeButton.getAttribute("data-size") : "M"; // Default to "M"
    }

    // 📌 Hiển thị thông báo khi thao tác thành công/thất bại
    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.textContent = message;
            toast.className = `toast-message ${type}`; // Add type-specific class
            toast.classList.remove("hidden");
            setTimeout(() => {
                toast.classList.add("hidden");
                toast.className = "toast-message hidden"; // Reset class
            }, 3000);
        }
    }

    // 🎯 Set default size to "M"
    const defaultSizeButton = document.querySelector('.size-btn[data-size="M"]');
    if (defaultSizeButton) {
        defaultSizeButton.classList.add("active");
    }

    // 🎯 Handle size selection
    const sizeButtons = document.querySelectorAll(".size-btn");
    sizeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            sizeButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
});
