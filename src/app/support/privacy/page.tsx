import styles from "../support.module.css";

export default function PrivacyPage() {
    return (
        <div>
            <h1 className={styles.docTitle}>Chính sách bảo mật</h1>
            <p className={styles.docMeta}>Cập nhật lần cuối: Tháng 5, 2026</p>

            <div className={styles.docSection}>
                <h2>1. Thông tin chúng tôi thu thập</h2>
                <p>Mavix thu thập các loại thông tin sau khi bạn sử dụng dịch vụ:</p>
                <ul>
                    <li>
                        <strong>Thông tin tài khoản:</strong> Tên, email, số điện thoại, tên
                        nhà hàng.
                    </li>
                    <li>
                        <strong>Dữ liệu vận hành:</strong> Đơn hàng, thực đơn, bàn, báo cáo
                        doanh thu.
                    </li>
                    <li>
                        <strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, thiết bị, thời gian
                        truy cập (phục vụ bảo mật hệ thống).
                    </li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>2. Cách chúng tôi sử dụng thông tin</h2>
                <ul>
                    <li>Cung cấp và cải thiện dịch vụ Mavix.</li>
                    <li>Gửi thông báo quan trọng về tài khoản và hệ thống.</li>
                    <li>Phân tích tổng hợp (ẩn danh) để cải thiện sản phẩm.</li>
                    <li>Hỗ trợ kỹ thuật khi bạn yêu cầu.</li>
                </ul>
                <p>
                    Chúng tôi <strong>không</strong> bán hoặc chia sẻ thông tin cá nhân
                    của bạn với bên thứ ba vì mục đích thương mại.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>3. Bảo mật dữ liệu</h2>
                <p>
                    Toàn bộ dữ liệu được mã hóa trong quá trình truyền (TLS/HTTPS) và lưu
                    trữ (AES-256). Hạ tầng đám mây của chúng tôi tuân thủ các tiêu chuẩn
                    bảo mật quốc tế.
                </p>
                <p>
                    Sao lưu tự động được thực hiện hàng ngày. Dữ liệu sao lưu được lưu
                    giữ trong 30 ngày.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>4. Quyền của bạn</h2>
                <ul>
                    <li>Truy cập và xem dữ liệu cá nhân của mình.</li>
                    <li>Yêu cầu chỉnh sửa thông tin không chính xác.</li>
                    <li>Xuất toàn bộ dữ liệu vận hành (định dạng JSON/CSV).</li>
                    <li>Yêu cầu xoá tài khoản và toàn bộ dữ liệu.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>5. Cookie</h2>
                <p>
                    Mavix sử dụng cookie phiên đăng nhập (session cookies) để duy trì
                    trạng thái xác thực. Chúng tôi không sử dụng cookie theo dõi quảng
                    cáo.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>6. Liên hệ về quyền riêng tư</h2>
                <p>
                    Mọi yêu cầu liên quan đến dữ liệu cá nhân, vui lòng liên hệ:{" "}
                    <a href="mailto:ntmanh@ntmanh.io.vn">ntmanh@ntmanh.io.vn</a>
                </p>
                <p>Chúng tôi cam kết phản hồi trong vòng 5 ngày làm việc.</p>
            </div>
        </div>
    );
}
