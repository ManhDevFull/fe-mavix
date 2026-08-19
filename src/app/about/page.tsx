import { PublicLayout } from "../../components/public-layout";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Xây dựng để phục vụ<br />những nhà hàng tuyệt vời
          </h1>
          <p className={styles.subtitle}>
            Mavix ra đời từ một câu hỏi đơn giản: <em>Tại sao việc gọi món và quản lý nhà hàng lại phải phức tạp đến vậy?</em>
          </p>
        </section>

        <section className={styles.missionSection}>
          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <h2>Sứ mệnh</h2>
              <p>
                Chúng tôi tin rằng mỗi chủ nhà hàng — dù lớn hay nhỏ — đều xứng đáng có một công cụ
                vận hành thông minh, đơn giản và hiệu quả. Mavix tập trung vào trải nghiệm đặt
                món di động, vận hành bàn, xử lý đơn hàng thời gian thực và thiết lập thanh toán đơn giản.
              </p>
            </div>
            <div className={styles.missionCard}>
              <h2>Triết lý thiết kế</h2>
              <p>
                Ít tính năng hơn nhưng hoạt động hoàn hảo hơn. Chúng tôi không xây dựng những thứ
                phức tạp mà bạn không cần. Mọi tính năng trong Mavix đều được kiểm chứng bởi
                chủ nhà hàng thực tế trước khi ra mắt.
              </p>
            </div>
            <div className={styles.missionCard}>
              <h2>Đội ngũ</h2>
              <p>
                Chúng tôi là những người đam mê công nghệ và yêu ẩm thực. Từng thành viên trong team
                đều đã từng là khách hàng của những nhà hàng mà chúng tôi phục vụ — điều đó giúp
                chúng tôi xây dựng đúng sản phẩm.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          {[
            { val: "500+", label: "Nhà hàng tin dùng" },
            { val: "2M+", label: "Đơn hàng đã xử lý" },
            { val: "40%", label: "Giảm thời gian phục vụ" },
            { val: "15ms", label: "Độ trễ đồng bộ trung bình" },
          ].map((st, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statVal}>{st.val}</span>
              <span className={styles.statLabel}>{st.label}</span>
            </div>
          ))}
        </section>

        <section className={styles.legalSection}>
          <p>
            Nền tảng MAVIX được sở hữu và vận hành chính thức bởi <strong>CÔNG TY TNHH MAVIX</strong>.
            Chúng tôi cam kết cung cấp các giải pháp công nghệ tiên tiến nhất nhằm số hóa và tối ưu quy trình vận hành cho ngành F&B tại Việt Nam.
          </p>
        </section>
      </div>
    </PublicLayout>
  );
}
