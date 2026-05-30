import { PublicLayout } from "../../components/public-layout";
import styles from "./blog.module.css";

export default function BlogPage() {
    return (
        <PublicLayout>
            <div className={styles.page}>
                <section className={styles.hero}>
                    <h1 className={styles.title}>Blog</h1>
                    <p className={styles.subtitle}>
                        Kiến thức thực chiến về vận hành nhà hàng, công nghệ QR và xu hướng
                        F&amp;B từ đội ngũ Mavix.
                    </p>
                </section>

                <div className={styles.comingSoon}>
                    <div className={styles.comingSoonBadge}>SẮP RA MẮT</div>
                    <h2 className={styles.comingSoonTitle}>Chưa có bài viết nào</h2>
                    <p className={styles.comingSoonDesc}>
                        Chúng tôi đang chuẩn bị nội dung. Hãy theo dõi{" "}
                        <a
                            href="https://www.facebook.com/thanh.manh2005"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Facebook
                        </a>{" "}
                        để không bỏ lỡ các bài viết đầu tiên.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
