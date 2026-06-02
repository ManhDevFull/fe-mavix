import { PublicLayout } from "../../components/public-layout";
import styles from "./career.module.css";

export default function CareerPage() {
    return (
        <PublicLayout>
            <div className={styles.page}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>Tuyển dụng</h1>
                    <p className={styles.subtitle}>
                        Chúng tôi đang xây dựng đội ngũ — những con người đam mê công nghệ
                        và muốn thay đổi cách vận hành ngành nhà hàng.
                    </p>
                </section>

                <div className={styles.comingSoon}>
                    <div className={styles.comingSoonBadge}>SẮP RA MẮT</div>
                    <h2 className={styles.comingSoonTitle}>Chưa có vị trí nào mở</h2>
                    <p className={styles.comingSoonDesc}>
                        Chúng tôi chưa mở vị trí tuyển dụng chính thức. Nhưng nếu bạn
                        muốn đồng hành cùng Mavix, hãy gửi CV đến{" "}
                        <a href="mailto:ntmanh@ntmanh.io.vn">ntmanh@ntmanh.io.vn</a> — chúng
                        tôi sẽ liên hệ khi có cơ hội phù hợp.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
