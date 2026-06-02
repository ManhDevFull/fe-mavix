import styles from "./support.module.css";

export default function SupportPage() {
    return (
        <div>
            <h1 className={styles.docTitle}>Trung tâm hỗ trợ</h1>
            <p className={styles.docMeta}>Cập nhật lần cuối: Tháng 5, 2026</p>

            <div className={styles.docSection}>
                <h2>Chào mừng đến với Mavix Support</h2>
                <p>
                    Tại đây bạn có thể tìm thấy tài liệu, hướng dẫn và các câu trả lời
                    cho những câu hỏi thường gặp về nền tảng Mavix.
                </p>
                <p>
                    Sử dụng thanh điều hướng bên trái để chuyển đến phần bạn cần. Nếu
                    không tìm thấy câu trả lời, đừng ngại liên hệ trực tiếp với đội ngũ
                    hỗ trợ của chúng tôi.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>Liên hệ nhanh</h2>
                <ul>
                    <li>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:ntmanh@ntmanh.io.vn">ntmanh@ntmanh.io.vn</a>
                    </li>
                    <li>
                        <strong>SĐT / Zalo:</strong>{" "}
                        <a href="tel:0799021393">0799 021 393</a>
                    </li>
                    <li>
                        <strong>Giờ hỗ trợ:</strong> 8:00 – 22:00 hàng ngày
                    </li>
                    <li>
                        <strong>Thời gian phản hồi:</strong> Trong vòng 4 giờ làm việc
                    </li>
                </ul>
            </div>
        </div>
    );
}
