import styles from "../support.module.css";

export default function TermsPage() {
    return (
        <div>
            <h1 className={styles.docTitle}>Điều khoản dịch vụ</h1>
            <p className={styles.docMeta}>Cập nhật lần cuối: Tháng 5, 2026</p>

            <div className={styles.docSection}>
                <h2>1. Chấp nhận điều khoản</h2>
                <p>
                    Bằng cách đăng ký và sử dụng Mavix, bạn đồng ý với các Điều khoản
                    Dịch vụ này. Nếu bạn không đồng ý, vui lòng không sử dụng nền tảng.
                </p>
                <p>
                    Chúng tôi có quyền cập nhật điều khoản này bất kỳ lúc nào. Thông báo
                    sẽ được gửi đến email đăng ký trước 30 ngày khi có thay đổi quan trọng.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>2. Tài khoản người dùng</h2>
                <ul>
                    <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập tài khoản.</li>
                    <li>
                        Mỗi tài khoản chỉ được sử dụng cho một đơn vị kinh doanh nhà hàng.
                    </li>
                    <li>
                        Không được chia sẻ tài khoản với bên thứ ba ngoài nhân viên trong tổ
                        chức của bạn.
                    </li>
                    <li>
                        Mavix có quyền đình chỉ tài khoản nếu phát hiện hành vi vi phạm.
                    </li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>3. Thanh toán và hoàn tiền</h2>
                <p>
                    Các gói dịch vụ trả phí được tính theo tháng hoặc năm. Phí đã thanh
                    toán sẽ không được hoàn lại trừ trường hợp lỗi kỹ thuật từ phía Mavix.
                </p>
                <p>
                    Gói miễn phí không yêu cầu thông tin thanh toán và có thể sử dụng vô
                    thời hạn với giới hạn tính năng như mô tả.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>4. Giới hạn trách nhiệm</h2>
                <p>
                    Mavix cung cấp nền tảng "như hiện tại" và không chịu trách nhiệm về
                    tổn thất kinh doanh phát sinh từ sự cố kỹ thuật ngoài tầm kiểm soát
                    (mất điện, thiên tai, sự cố nhà cung cấp cloud...).
                </p>
                <p>
                    Chúng tôi cam kết duy trì uptime 99.9% và sẽ thông báo bảo trì định
                    kỳ ít nhất 24 giờ trước.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>5. Chấm dứt dịch vụ</h2>
                <p>
                    Bạn có thể huỷ tài khoản bất kỳ lúc nào từ phần cài đặt. Dữ liệu sẽ
                    được lưu trữ thêm 30 ngày trước khi xoá hoàn toàn, cho phép bạn xuất
                    dữ liệu nếu cần.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>6. Liên hệ</h2>
                <p>
                    Mọi thắc mắc về điều khoản, vui lòng liên hệ:{" "}
                    <a href="mailto:ntmanh@ntmah.io.vn">ntmanh@ntmah.io.vn</a>
                </p>
            </div>
        </div>
    );
}
