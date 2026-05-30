import styles from "../support.module.css";

export default function GuidePage() {
    return (
        <div>
            <h1 className={styles.docTitle}>Hướng dẫn bắt đầu</h1>
            <p className={styles.docMeta}>Cập nhật lần cuối: Tháng 5, 2026</p>

            <div className={styles.docSection}>
                <h2>Tổng quan</h2>
                <p>
                    Mavix được thiết kế để bạn có thể bắt đầu trong vòng 15–30 phút, không
                    cần cài đặt phần cứng đặc biệt. Chỉ cần một smartphone hoặc tablet là
                    đủ để vận hành toàn bộ quy trình gọi món và quản lý đơn hàng.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>Các bước thiết lập ban đầu</h2>
                <div className={styles.stepList}>
                    {[
                        {
                            title: "Tạo tài khoản",
                            desc: "Đăng ký tại trang chủ. Nhập thông tin nhà hàng và tạo mật khẩu quản trị.",
                        },
                        {
                            title: "Cấu hình thực đơn",
                            desc: "Vào Dashboard → Thực đơn → Thêm danh mục và món ăn. Có thể nhập ảnh, giá và mô tả.",
                        },
                        {
                            title: "Thiết lập bàn",
                            desc: "Vào Dashboard → Bàn → Tạo sơ đồ bàn phù hợp với không gian của bạn.",
                        },
                        {
                            title: "In mã QR",
                            desc: "Hệ thống tự tạo mã QR cho từng bàn. Tải về và in ra — mỗi mã dẫn đúng đến thực đơn của bàn đó.",
                        },
                        {
                            title: "Bắt đầu nhận đơn",
                            desc: "Khách quét QR → chọn món → đơn hàng xuất hiện ngay trên dashboard của bạn theo thời gian thực.",
                        },
                    ].map((step, i) => (
                        <div key={i} className={styles.step}>
                            <div className={styles.stepNum}>{i + 1}</div>
                            <div className={styles.stepText}>
                                <strong>{step.title}</strong>
                                <span>{step.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.docSection}>
                <h2>Thiết bị hỗ trợ</h2>
                <p>
                    Mavix hoạt động trên mọi thiết bị có trình duyệt web hiện đại. Không
                    cần cài ứng dụng.
                </p>
                <ul>
                    <li>Smartphone Android / iOS</li>
                    <li>Tablet (iPad, Samsung Tab...)</li>
                    <li>Máy tính bảng POS thông thường</li>
                    <li>Màn hình bếp / quầy bar (PC hoặc Smart TV)</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>Câu hỏi thường gặp</h2>
                <p>
                    <strong>Mất kết nối internet thì sao?</strong>
                    <br />
                    Mavix yêu cầu kết nối internet để đồng bộ đơn hàng thời gian thực.
                    Chúng tôi khuyến nghị dùng WiFi ổn định tại nhà hàng.
                </p>
                <p>
                    <strong>Có thể dùng thử trước không?</strong>
                    <br />
                    Có. Gói miễn phí cho phép quản lý tối đa 3 bàn và 20 món trong thực đơn.
                </p>
                <p>
                    <strong>Dữ liệu có được sao lưu không?</strong>
                    <br />
                    Có. Toàn bộ dữ liệu được mã hóa và sao lưu tự động hàng ngày trên hạ
                    tầng đám mây của chúng tôi.
                </p>
            </div>
        </div>
    );
}
