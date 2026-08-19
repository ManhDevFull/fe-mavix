import styles from "../support.module.css";

export default function PrivacyPage() {
    return (
        <div>
            <h1 className={styles.docTitle}>CHÍNH SÁCH BẢO MẬT VÀ XỬ LÝ DỮ LIỆU CÁ NHÂN MAVIX</h1>
            <p className={styles.docMeta}>Mã tài liệu: MAVIX-PP-2026-V1 · Có hiệu lực áp dụng từ ngày: 13 tháng 07 năm 2026</p>

            <div className={styles.docSection}>
                <h2>1. Giới thiệu</h2>
                <p>
                    Công ty TNHH MAVIX (sau đây gọi tắt là &ldquo;MAVIX&rdquo;) tôn trọng và cam kết bảo vệ tuyệt đối dữ liệu cá nhân của Bạn (Khách hàng và Thực khách). Chính sách Bảo mật này giải thích cách MAVIX thu thập, lưu trữ, xử lý, chia sẻ và bảo vệ dữ liệu cá nhân khi bạn truy cập website, sử dụng các gói dịch vụ (Plus, Pro, Premium, Edit) hoặc tương tác với hệ thống phần cứng do chúng tôi cung cấp. Văn bản này được xây dựng hoàn toàn dựa trên tinh thần tuân thủ Luật An toàn thông tin mạng, Luật An ninh mạng và Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>2. Phạm vi áp dụng</h2>
                <p>Chính sách này áp dụng đối với:</p>
                <ul>
                    <li><strong>Khách hàng chủ quản:</strong> Cá nhân, chủ hộ kinh doanh, người đại diện pháp luật của quán ăn/nhà hàng trực tiếp đăng ký gói dịch vụ MAVIX.</li>
                    <li><strong>Nhân viên của Khách hàng:</strong> Người được Khách hàng cấp quyền truy cập hệ thống (Thu ngân, quản lý, đầu bếp...).</li>
                    <li><strong>Thực khách (Người dùng cuối):</strong> Khách hàng của quán ăn truy cập vào trang thực đơn điện tử (QR Menu) thuộc hệ thống MAVIX để gọi món và thực hiện thanh toán.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>3. Định nghĩa dữ liệu</h2>
                <p>Theo Nghị định 13/2023/NĐ-CP, MAVIX phân tách dữ liệu xử lý thành hai nhóm:</p>
                <ul>
                    <li><strong>Dữ liệu cá nhân cơ bản:</strong> Bao gồm họ tên, số điện thoại, địa chỉ email, địa chỉ quán ăn, tên đăng nhập, địa chỉ IP.</li>
                    <li><strong>Dữ liệu cá nhân nhạy cảm:</strong> Bao gồm thông tin tài khoản ngân hàng, lịch sử giao dịch tài chính, biến động số dư, dữ liệu vị trí địa lý của thiết bị được quét tự động nhằm mục đích đối soát dòng tiền và xác thực giao dịch mua hàng.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>4. Thông tin chúng tôi thu thập</h2>
                <p>MAVIX thu thập dữ liệu thông qua các phương thức trực tiếp và tự động:</p>
                <ul>
                    <li><strong>Thông tin đăng ký:</strong> Họ tên, số điện thoại, email doanh nghiệp, mật khẩu mã hóa.</li>
                    <li><strong>Thông tin thực đơn và vận hành:</strong> Tên món ăn, giá cả, hình ảnh menu, lịch sử cuộc gọi món, doanh thu ngày/tháng của quán.</li>
                    <li><strong>Dữ liệu thanh toán &amp; Biến động số dư:</strong> Mã lệnh giao dịch (Transaction ID), số tài khoản nguồn/đích, số tiền chuyển khoản, nội dung chuyển khoản (Memo) thu thập từ cổng Webhook đối tác thanh toán.</li>
                    <li><strong>Thông tin từ Thực khách:</strong> Số bàn ngồi, thời gian tạo đơn, danh sách món ăn đã chọn, thông tin phản hồi dịch vụ.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>5. Mục đích sử dụng dữ liệu</h2>
                <p>MAVIX cam kết chỉ sử dụng dữ liệu thu thập được cho các mục đích hợp pháp sau:</p>
                <ul>
                    <li>Xác thực tài khoản, cung cấp tính năng quản lý đơn hàng và hiển thị thực đơn QR.</li>
                    <li>Đồng bộ dữ liệu biến động số dư để tự động chuyển trạng thái đơn hàng (từ "Chờ thanh toán" sang "Đã hoàn tất").</li>
                    <li>Xuất hóa đơn tài chính (e-Invoice) và xử lý các yêu cầu gia hạn, nâng cấp gói dịch vụ.</li>
                    <li>Gửi thông báo kỹ thuật, cảnh báo bảo mật, thông báo bảo trì hoặc cập nhật tính năng mới.</li>
                    <li>Điều tra, ngăn chặn các hành vi gian lận tài chính, rửa tiền thông qua mã QR hiển thị trên hệ thống.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>6. Cơ sở xử lý dữ liệu</h2>
                <p>MAVIX thực hiện xử lý dữ liệu dựa trên các cơ sở pháp lý vững chắc quy định tại Điều 17 Nghị định 13/2023/NĐ-CP:</p>
                <ul>
                    <li><strong>Sự đồng ý:</strong> Khách hàng và Thực khách chủ động chọn "Đồng ý" thông qua hộp kiểm (Checkbox) trên giao diện trước khi dữ liệu được thu thập.</li>
                    <li><strong>Thực hiện hợp đồng:</strong> Xử lý dữ liệu là bắt buộc để MAVIX cung cấp đúng tính năng của các gói dịch vụ trả phí đã ký kết theo Điều khoản Dịch vụ.</li>
                    <li><strong>Nghĩa vụ pháp lý:</strong> Xử lý dữ liệu để tuân thủ nghĩa vụ lưu trữ chứng từ kế toán, thuế và quy định về an ninh mạng của Nhà nước Việt Nam.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>7. Cách chúng tôi lưu trữ và bảo vệ dữ liệu</h2>
                <ul>
                    <li><strong>Vị trí lưu trữ:</strong> Toàn bộ dữ liệu của MAVIX được lưu trữ tại hệ thống trung tâm dữ liệu (Data Center) đám mây chuẩn Tier 3 đặt tại Việt Nam, đảm bảo tính an toàn vật lý và tính sẵn sàng cao.</li>
                    <li><strong>Biện pháp bảo mật kỹ thuật:</strong> MAVIX áp dụng tiêu chuẩn mã hóa đường truyền SSL/TLS khi truyền tải dữ liệu. Mật khẩu tài khoản được băm (Hash) một chiều chuyên sâu và áp dụng mã hóa đối với các thông tin nhạy cảm.</li>
                    <li><strong>Quản lý nội bộ:</strong> Chỉ những nhân sự được phân quyền cụ thể mới có quyền truy cập cơ sở dữ liệu và mọi lượt truy cập đều được ghi log kiểm toán (Audit log) nghiêm ngặt.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>8. Chia sẻ dữ liệu với bên thứ ba</h2>
                <p>MAVIX tuyệt đối không bán, cho thuê thông tin cá nhân của bạn cho bất kỳ tổ chức quảng cáo nào. Chúng tôi chỉ chia sẻ dữ liệu giới hạn trong các trường hợp:</p>
                <ul>
                    <li><strong>Đối tác tích hợp hạ tầng:</strong> Đối tác cổng thanh toán trung gian để thực hiện tính năng kiểm tra giao dịch biến động số dư.</li>
                    <li><strong>Nhà cung ứng hạ tầng đám mây:</strong> Các đơn vị cho thuê máy chủ lớn lưu trữ dữ liệu mã hóa của MAVIX dưới các hợp đồng cam kết bảo mật thông tin (NDA).</li>
                    <li><strong>Cơ quan nhà nước:</strong> Cung cấp thông tin theo văn bản yêu cầu chính thức từ Cơ quan chức năng theo đúng trình tự tố tụng pháp luật Việt Nam.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>9. Dữ liệu thanh toán</h2>
                <ul>
                    <li><strong>Đối với Khách hàng mua gói MAVIX:</strong> MAVIX không trực tiếp lưu trữ số thẻ tín dụng hoặc mật khẩu ngân hàng của bạn. Việc thanh toán gói dịch vụ được thực hiện qua cổng thanh toán trung gian được cấp phép.</li>
                    <li><strong>Đối với Thực khách trả tiền cho quán:</strong> Hệ thống MAVIX sinh mã QR động dựa trên số tài khoản của chủ quán. MAVIX không thu thập, không lưu trữ thông tin đăng nhập Internet Banking, không yêu cầu mã OTP của Thực khách.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>10. Dữ liệu thiết bị IoT</h2>
                <p>
                    Trong trường hợp quán ăn sử dụng các thiết bị phần cứng thông minh do MAVIX cung cấp (như thẻ QR tích hợp, máy in lệnh bếp, thiết bị IoT): Hệ thống của MAVIX sẽ thu thập các dữ liệu kỹ thuật bao gồm trạng thái kết nối, mã định danh phần cứng (MAC Address), và phiên bản phần sụn (Firmware). Dữ liệu này chỉ được dùng để giám sát kỹ thuật, quản lý thiết bị và không thu thập thông tin cá nhân.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>11. Quyền và lựa chọn của người dùng</h2>
                <p>Tuân thủ Điều 9 Nghị định 13/2023/NĐ-CP, Bạn có đầy đủ các quyền sau đây:</p>
                <ul>
                    <li><strong>Quyền được biết và Quyền truy cập:</strong> Xem rõ các dữ liệu MAVIX đang lưu trữ về bạn.</li>
                    <li><strong>Quyền chỉnh sửa:</strong> Tự do thay đổi thông tin hồ sơ, tên quán, menu trên hệ thống.</li>
                    <li><strong>Quyền rút lại sự chấp thuận:</strong> Bạn có quyền ngắt các tích hợp liên kết.</li>
                    <li><strong>Quyền xóa dữ liệu:</strong> Yêu cầu MAVIX xóa tài khoản vĩnh viễn và các dữ liệu liên quan.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>12. Cookie và công nghệ theo dõi</h2>
                <p>
                    MAVIX sử dụng công nghệ lưu trữ cục bộ (Local Storage / API Store) thay cho Cookie truyền thống để lưu trữ phiên đăng nhập và mã quyền truy cập ẩn danh (phục vụ đối soát giỏ hàng của Thực khách) nhằm tránh việc tải lại trang bị mất dữ liệu. Bạn có thể vô hiệu hóa tính năng này ở cấp trình duyệt, tuy nhiên điều đó sẽ khiến ứng dụng của chúng tôi không thể hoạt động.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>13. Bảo mật tài khoản</h2>
                <p>
                    Khách hàng có nghĩa vụ tự bảo vệ mật khẩu quản trị của mình, không đặt mật khẩu dễ đoán. MAVIX sẽ không bao giờ gọi điện hoặc gửi email yêu cầu bạn cung cấp mật khẩu. Trong trường hợp nghi ngờ tài khoản bị lộ, bạn có trách nhiệm đổi mật khẩu khẩn cấp hoặc liên hệ ngay với hotline của MAVIX để được hỗ trợ.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>14. Thời gian lưu trữ dữ liệu</h2>
                <ul>
                    <li>Dữ liệu vận hành hệ thống (Menu, cấu hình quán) được lưu trữ liên tục trong thời gian duy trì tài khoản trả phí.</li>
                    <li>Dữ liệu lịch sử giao dịch, đơn hàng của quán sẽ được lưu trữ để phục vụ mục đích đối soát tài chính, sau thời hạn theo luật định sẽ được ẩn/mã hoá vô danh hoặc xóa bỏ dựa theo quy định pháp luật.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>15. Xóa và xuất dữ liệu</h2>
                <p>Khi Khách hàng chủ động gửi yêu cầu xóa tài khoản, hệ thống MAVIX đưa tài khoản vào trạng thái chờ xóa (30 ngày):</p>
                <ul>
                    <li>Khách hàng có quyền yêu cầu xuất (Export) lịch sử báo cáo khi vẫn còn đang trong vòng đời dịch vụ.</li>
                    <li>Sau thời hạn, hệ thống sẽ thực hiện lệnh xóa vĩnh viễn (Hard Delete) đảm bảo quyền được quên theo Luật định.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>16. Dữ liệu trẻ em</h2>
                <p>
                    Nền tảng MAVIX được thiết kế dành cho các chủ cơ sở kinh doanh. MAVIX không chủ động thu thập thông tin của trẻ em dưới mười sáu (16) tuổi. Yêu cầu của người dùng tại bàn ăn cần có sự đồng thuận giám hộ ở phía phụ huynh và tuân thủ các quy định tại nhà hàng.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>17. Thay đổi chính sách</h2>
                <p>
                    MAVIX có quyền sửa đổi, bổ sung nội dung Chính sách Bảo mật này vào bất kỳ lúc nào nhằm tương thích với sự thay đổi của pháp luật. Phiên bản cập nhật sẽ được ghi rõ ngày hiệu lực.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>18. Thông tin liên hệ</h2>
                <p>Mọi yêu cầu hoặc khiếu nại về bảo mật, vui lòng liên hệ:</p>
                <ul>
                    <li><strong>Email chuyên trách:</strong> <a href="mailto:support@mavix.com">support@mavix.com</a></li>
                    <li><strong>Đơn vị chủ quản:</strong> CÔNG TY TNHH MAVIX</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>19. Dữ liệu thiết bị (Device Data)</h2>
                <p>
                    Khi truy cập vào web app MAVIX, hệ thống có thể đọc một số thông số hiển thị thiết bị để tối ưu hóa Responsive (màn hình dọc của di động hoặc màn hình rộng của Desktop). Các dữ liệu như Loại trình duyệt, Kích thước màn hình sẽ giúp hệ thống điều hướng hiển thị thiết kế phù hợp nhưng không nhằm mục đích định danh cá nhân độc hại.
                </p>
            </div>
        </div>
    );
}
