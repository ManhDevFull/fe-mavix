import Link from "next/link";
import styles from "./public-nav.module.css";

export function PublicNav() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        Mavix
      </Link>
      <nav className={styles.nav}>
        <Link href="/about">Giới thiệu</Link>
        <Link href="/contact">Liên hệ</Link>
        <Link href="/login">Đăng nhập</Link>
        <Link href="/register" className={styles.cta}>Đăng ký</Link>
      </nav>
    </header>
  );
}
