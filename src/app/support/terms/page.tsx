import styles from "../support.module.css";

export default function TermsPage() {
    return (
        <div>
            <h1 className={styles.docTitle}>ĐIỀU KHOẢN DỊCH VỤ NỀN TẢNG CÔNG NGHỆ MAVIX</h1>
            <p className={styles.docMeta}>Mã tài liệu: MAVIX-TOS-2026-V1 · Có hiệu lực áp dụng từ ngày: 11 tháng 07 năm 2026</p>

            <div className={styles.docSection}>
                <h2>1. Giới thiệu</h2>
                <p>
                    Chào mừng bạn đến với MAVIX. Điều khoản Dịch vụ này (sau đây gọi là &ldquo;Điều khoản&rdquo;) cấu thành một hợp đồng điện tử có giá trị pháp lý ràng buộc trực tiếp giữa Bạn (Cá nhân, Hộ kinh doanh hoặc Doanh nghiệp sử dụng dịch vụ) và <strong>Công ty TNHH MAVIX</strong> (sau đây gọi tắt là &ldquo;MAVIX&rdquo;). Bằng việc nhấn nút &ldquo;Đăng ký&rdquo;, &ldquo;Tôi đồng ý&rdquo; hoặc sử dụng bất kỳ tính năng nào của nền tảng, bạn khẳng định đã đọc, hiểu và đồng ý tuân thủ toàn bộ văn bản này.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>2. Định nghĩa</h2>
                <ul>
                    <li><strong>Nền tảng MAVIX:</strong> Hệ thống phần mềm quản lý nhà hàng dưới dạng dịch vụ (SaaS) vận hành trên website, ứng dụng di động và hệ thống máy chủ của MAVIX.</li>
                    <li><strong>Khách hàng (User):</strong> Các cá nhân, hộ kinh doanh, doanh nghiệp F&amp;B đăng ký tài khoản và trả phí sử dụng dịch vụ của MAVIX.</li>
                    <li><strong>Thực khách (End-User):</strong> Người tiêu dùng cuối cùng truy cập vào thực đơn QR của Khách hàng để gọi món và thanh toán.</li>
                    <li><strong>Dữ liệu số dư:</strong> Thông tin lịch sử giao dịch và biến động số dư tài khoản ngân hàng của Khách hàng được truyền tải qua bên thứ ba về hệ thống MAVIX.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>3. Phạm vi áp dụng</h2>
                <p>
                    Điều khoản này áp dụng cho toàn bộ các dịch vụ, phân hệ phần mềm (Plus, Pro, Premium, Edit), thiết bị phần cứng, API, Webhook và các công cụ hỗ trợ do MAVIX cung cấp trên phạm vi lãnh thổ Việt Nam và quốc tế.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>4. Điều kiện sử dụng dịch vụ</h2>
                <p>
                    Khách hàng đăng ký tài khoản phải có đầy đủ năng lực hành vi dân sự theo Bộ luật Dân sự Việt Nam. Nếu đại diện cho một tổ chức hoặc doanh nghiệp, người đăng ký phải có thẩm quyền đại diện hợp pháp theo quy định của pháp luật hoặc được ủy quyền hợp lệ.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>5. Đăng ký và tài khoản</h2>
                <p>
                    Khách hàng cam kết cung cấp thông tin chính xác, trung thực về số điện thoại, email, mã số thuế (nếu có). Mỗi tài khoản định danh chỉ được áp dụng cho đúng một (01) thương hiệu kinh doanh đã đăng ký. Nghiêm cấm hành vi chia sẻ, chuyển nhượng hoặc cho bên thứ ba mượn tài khoản trái phép. MAVIX có quyền khóa tài khoản vĩnh viễn nếu phát hiện thông tin giả mạo.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>6. Gói dịch vụ và thanh toán</h2>
                <ul>
                    <li><strong>Biểu phí:</strong> Các gói dịch vụ (Plus, Pro, Premium, Edit) được áp dụng theo hình thức trả trước theo chu kỳ tháng hoặc năm. Mọi khoản phí chưa bao gồm thuế giá trị gia tăng (GTGT) và phí tiện ích của ngân hàng (nếu có).</li>
                    <li><strong>Chính sách hoàn tiền:</strong> Phí dịch vụ đã thanh toán sẽ không được hoàn lại, trừ trường hợp hệ thống MAVIX gặp sự cố lỗi kỹ thuật nội bộ kéo dài liên tục trên bảy mươi hai (72) giờ mà không có biện pháp khắc phục.</li>
                    <li><strong>Đóng băng tài khoản:</strong> Tài khoản quá hạn thanh toán mười hai (12) giờ sẽ bị hệ thống tự động chuyển sang trạng thái đóng băng tính năng đồng bộ và cập nhật đơn hàng mới.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>7. Thiết bị QR và phần cứng</h2>
                <p>
                    Trong trường hợp MAVIX cung cấp thiết bị phần cứng (Máy in hóa đơn, máy POS, thẻ QR để bàn), quyền sở hữu phần cứng sẽ thuộc về Khách hàng sau khi hoàn tất thanh toán, riêng phần mềm nhúng (Firmware) bên trong thiết bị vẫn thuộc sở hữu trí tuệ độc quyền của MAVIX. Khách hàng không được tự ý can thiệp, thay đổi cấu trúc phần cứng của thiết bị.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>8. Quyền và nghĩa vụ của khách hàng</h2>
                <ul>
                    <li>Khách hàng có quyền khai thác đầy đủ các tính năng của gói dịch vụ đã mua.</li>
                    <li>Khách hàng có nghĩa vụ chủ động kiểm tra, đối soát dữ liệu doanh thu của quán với sao kê thực tế tại tài khoản ngân hàng hàng ngày.</li>
                    <li>Tự chịu trách nhiệm về nghĩa vụ thuế thu nhập, thuế kinh doanh cá thể phát sinh từ hoạt động bán hàng của quán ăn đối với Cơ quan Thuế địa phương.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>9. Quyền và nghĩa vụ của MAVIX</h2>
                <ul>
                    <li>MAVIX có nghĩa vụ duy trì tính ổn định, liên tục của phần mềm và xuất hóa đơn tài chính (e-Invoice) cho các khoản phí dịch vụ đã thu từ Khách hàng.</li>
                    <li>MAVIX có quyền đơn phương tạm ngưng dịch vụ để thực hiện nâng cấp hệ thống khẩn cấp hoặc thực hiện các biện pháp ngăn chặn hành vi tấn công mạng.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>10. Nội dung do khách hàng tạo</h2>
                <p>
                    Mọi dữ liệu về cấu trúc món ăn, hình ảnh thực đơn, bảng giá do Khách hàng tải lên hệ thống thuộc quyền sở hữu của Khách hàng. Tuy nhiên, Khách hàng cấp cho MAVIX quyền không độc quyền để lưu trữ, xử lý, định dạng lại các nội dung này nhằm phục vụ mục đích hiển thị tối ưu nhất trên giao diện người dùng.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>11. Quy định cấm</h2>
                <p>Nghiêm cấm Khách hàng sử dụng nền tảng MAVIX vào các mục đích:</p>
                <ul>
                    <li>Phát tán virus, mã độc, thực hiện tấn công từ chối dịch vụ (DDoS) vào hạ tầng của MAVIX.</li>
                    <li>Sử dụng tài khoản MAVIX để ngụy tạo giao dịch tài chính, rửa tiền, đánh bạc, lừa đảo chiếm đoạt tài sản.</li>
                    <li>Kinh doanh các mặt hàng, thực phẩm, dịch vụ bị pháp luật Việt Nam nghiêm cấm.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>12. Quyền sở hữu trí tuệ</h2>
                <p>
                    Toàn bộ mã nguồn (Source Code), giao diện đồ họa (UI/UX), thuật toán kết nối dữ liệu, thương hiệu độc quyền &ldquo;MAVIX&rdquo; là tài sản trí tuệ bất khả xâm phạm của Công ty TNHH MAVIX, được bảo hộ bởi Luật Sở hữu trí tuệ. Mọi hành vi sao chép, dịch ngược mã nguồn (Decompile) hoặc làm nhái sản phẩm đều bị coi là vi phạm pháp luật và sẽ bị xử lý hình sự/dân sự.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>13. Bảo mật và quyền riêng tư</h2>
                <p>
                    MAVIX cam kết bảo mật tuyệt đối các thông tin kinh doanh của quán và thông tin của Thực khách theo các tiêu chuẩn khắt khe quy định tại Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân. MAVIX không bán thông tin, không chia sẻ dữ liệu cho bên thứ ba ngoại trừ các cơ quan điều tra chức năng có thẩm quyền khi có văn bản yêu cầu chính thức.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>14. Giới hạn trách nhiệm</h2>
                <p>
                    Hệ thống MAVIX được cung cấp trên cơ sở kỹ thuật &ldquo;sẵn có&rdquo;. MAVIX được miễn trừ toàn bộ trách nhiệm bồi thường thiệt hại tài chính hệ quả (như tiền lời bị mất do mất đơn hàng) phát sinh từ các sự cố bất khả kháng bao gồm: đứt cáp quang quốc tế, lỗi máy chủ đám mây diện rộng (AWS, Google Cloud...), sự cố lưới điện quốc gia. Mức trần bồi thường tối đa của MAVIX trong mọi trường hợp (nếu có lỗi xác định) không vượt quá số tiền Khách hàng đã thanh toán cho gói dịch vụ trong ba (03) tháng gần nhất.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>15. Tạm ngừng hoặc chấm dứt dịch vụ</h2>
                <p>
                    Khách hàng có quyền chấm dứt sử dụng dịch vụ bất kỳ lúc nào thông qua tính năng hủy tài khoản. MAVIX có quyền chấm dứt cung cấp dịch vụ ngay lập tức mà không hoàn tiền nếu Khách hàng vi phạm các quy định cấm tại Điều 11 hoặc có hành vi bôi nhọ, gây thiệt hại nghiêm trọng đến uy tín của MAVIX.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>16. Bồi thường</h2>
                <p>
                    Khách hàng cam kết sẽ bồi thường toàn bộ thiệt hại, chi phí pháp lý, chi phí theo đuổi kiện tụng cho MAVIX nếu Khách hàng có hành vi vi phạm pháp luật hoặc vi phạm điều khoản dẫn đến việc MAVIX bị bên thứ ba hoặc cơ quan chức năng phạt hoặc khởi kiện.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>17. Thay đổi điều khoản</h2>
                <p>
                    MAVIX bảo lưu quyền điều chỉnh văn bản Điều khoản này để phù hợp với sự thay đổi của pháp luật và công nghệ. Các thay đổi mang tính cốt lõi liên quan đến quyền lợi tài chính sẽ được thông báo đến email của Khách hàng trước ít nhất ba mươi (30) ngày. Việc tiếp tục sử dụng hệ thống sau thời hạn thông báo đồng nghĩa với việc Khách hàng chấp thuận các thay đổi đó.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>18. Luật áp dụng và giải quyết tranh chấp</h2>
                <p>
                    Điều khoản này được điều chỉnh và giải thích theo luật pháp nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh trước hết sẽ được giải quyết bằng thương lượng hòa giải. Nếu không đạt được sự thống nhất trong vòng ba mươi (30) ngày, vụ việc sẽ được đưa ra giải quyết tại Tòa án nhân dân có thẩm quyền tại địa phương nơi MAVIX đặt trụ sở chính.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>19. Thông tin liên hệ</h2>
                <p>Mọi thắc mắc, khiếu nại, yêu cầu hỗ trợ pháp lý, Khách hàng vui lòng liên hệ trực tiếp:</p>
                <ul>
                    <li><strong>Đơn vị chủ quản:</strong> CÔNG TY TNHH MAVIX</li>
                    <li><strong>Kênh tiếp nhận:</strong> <a href="mailto:support@mavix.com">support@mavix.com</a></li>
                    <li><strong>Địa chỉ trụ sở:</strong> [Cập nhật địa chỉ sau khi hoàn tất Giấy phép đăng ký kinh doanh]</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>20. Điều khoản sử dụng thiết bị QR</h2>
                <p>
                    Khách hàng có trách nhiệm quản lý, bảo quản thẻ QR vật lý hoặc mã QR động hiển thị trên thiết bị. MAVIX không chịu trách nhiệm trong trường hợp kẻ gian tráo đổi thẻ QR vật lý tại bàn ăn của quán dẫn đến dòng tiền bị chuyển sai tài khoản, hoặc trường hợp nhân viên của quán tự ý thay đổi mã QR để trục lợi cá nhân.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>21. Điều khoản tích hợp ngân hàng và bên thứ ba</h2>
                <p>
                    Khách hàng thừa nhận rằng hệ thống theo dõi biến động số dư của MAVIX phụ thuộc hoàn toàn vào luồng truyền dữ liệu từ đối tác kết nối (như SePay) và cổng Internet Banking của các ngân hàng thương mại. MAVIX không chịu trách nhiệm đối với việc giao dịch thanh toán của Thực khách bị thất bại, bị chậm, bị treo lệnh do hệ thống của ngân hàng đang trong thời gian bảo trì hoặc SePay gặp sự cố đường truyền mạng nội bộ.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>22. Chính sách lưu trữ dữ liệu</h2>
                <p>Nhằm bảo vệ dữ liệu và tối ưu tài nguyên:</p>
                <ul>
                    <li><strong>Đối với tài khoản đang hoạt động trả phí:</strong> Dữ liệu giao dịch, đơn hàng được lưu trữ trọn vẹn trong suốt thời gian sử dụng.</li>
                    <li><strong>Đối với tài khoản yêu cầu chấm dứt dịch vụ:</strong> Hệ thống sẽ đóng băng và lưu giữ an toàn toàn bộ dữ liệu trong thời hạn ba mươi (30) ngày để Khách hàng thực hiện quyền xuất dữ liệu (Export). Sau ba mươi (30) ngày, toàn bộ dữ liệu sẽ bị xóa vĩnh viễn khỏi máy chủ tổng.</li>
                </ul>
            </div>

            <div className={styles.docSection}>
                <h2>23. Sao lưu và khôi phục (Backup &amp; Recovery)</h2>
                <p>
                    MAVIX thực hiện cơ chế tự động sao lưu dữ liệu hệ thống hàng ngày (Daily Backup) và lưu trữ trên các trung tâm dữ liệu độc lập. Trong trường hợp xảy ra sự cố phần cứng thảm khốc của hạ tầng mạng, MAVIX cam kết thời gian phục hồi dữ liệu tối đa về trạng thái gần nhất không quá hai mươi tư (24) giờ. MAVIX không chịu trách nhiệm khôi phục các dữ liệu do chính Khách hàng chủ động thao tác xóa nhầm trên trang quản trị của họ.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>24. Chính sách cập nhật phần mềm</h2>
                <p>
                    Để liên tục cải tiến dịch vụ, MAVIX sẽ tiến hành cập nhật phần mềm định kỳ (Vá lỗi, tối ưu hiệu năng, cập nhật tính năng mới). Việc cập nhật sẽ được thực hiện tự động trên hệ thống đám mây. MAVIX cam kết lịch cập nhật định kỳ sẽ được triển khai vào các khung giờ thấp điểm (từ 01:00 AM đến 04:00 AM) để giảm thiểu tối đa ảnh hưởng đến hoạt động kinh doanh của các quán ăn.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>25. Quy định về API và Webhook</h2>
                <p>
                    Đối với các Khách hàng sử dụng gói chuyên sâu (Premium, Edit) có nhu cầu mở cổng API hoặc Webhook kết nối với phần mềm quản lý nội bộ khác của quán: Khách hàng phải tuân thủ đúng giới hạn tần suất gửi yêu cầu (Rate Limit) do MAVIX quy định nhằm tránh gây nghẽn băng thông hệ thống. MAVIX có quyền tự động ngắt kết nối API tạm thời nếu phát hiện tài khoản gửi yêu cầu vượt quá giới hạn an toàn quy định.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>26. Điều khoản công nghệ trí tuệ nhân tạo (AI Terms)</h2>
                <p>
                    Trong trường hợp Khách hàng kích hoạt và sử dụng các phân hệ tích hợp Trí tuệ nhân tạo (AI) của MAVIX (như tự động tạo thực đơn, chatbot tự động tư vấn món ăn, AI phân tích xu hướng doanh thu): Khách hàng thừa nhận rằng các kết quả, gợi ý do AI tạo ra chỉ mang tính chất tham khảo. Khách hàng phải tự kiểm tra tính chính xác và chịu trách nhiệm hoàn toàn khi áp dụng các kết quả này vào hoạt động kinh doanh thực tế. MAVIX không chịu trách nhiệm đối với bất kỳ quyết định kinh doanh sai lệch nào dựa trên phân tích của AI.
                </p>
            </div>

            <div className={styles.docSection}>
                <h2>27. Quy định về nội dung menu do khách hàng đăng tải</h2>
                <p>
                    Khách hàng cam kết chịu trách nhiệm độc lập và toàn diện về tính hợp pháp của toàn bộ hình ảnh món ăn, giá cả hiển thị trên thực đơn điện tử của mình. Nội dung menu không được vi phạm bản quyền hình ảnh của thương hiệu khác, không chứa các hình ảnh phản cảm, đồi trụy, vi phạm thuần phong mỹ tục Việt Nam. MAVIX có quyền tự động gỡ bỏ các hình ảnh, nội dung thực đơn nếu nhận được báo cáo vi phạm bản quyền hợp pháp hoặc có yêu cầu từ cơ quan quản lý văn hóa thông tin.
                </p>
            </div>
        </div>
    );
}
