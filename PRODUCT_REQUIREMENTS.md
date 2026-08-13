# Product Requirements — Chạm Nhật Bản

## 1. Tầm nhìn

Chạm Nhật Bản là nền tảng giúp người mới bắt đầu học tiếng Nhật N5 theo lộ trình rõ ràng, có bài học ngắn, luyện tập lặp lại và theo dõi tiến độ.

## 2. Người dùng

### Guest

- Xem landing page và giới thiệu lộ trình.
- Chọn ngôn ngữ giao diện.
- Đăng ký hoặc đăng nhập.

### Learner

- Học các module N5.
- Làm flashcard và quiz.
- Xem tiến độ và streak.
- Thay đổi ngôn ngữ, múi giờ và hồ sơ cơ bản.

### Admin

- Có toàn bộ quyền Learner.
- Quản lý nội dung trong CMS.
- Tạo nội dung nháp, xem trước, xuất bản, thu hồi và lưu trữ.
- Xem audit log cơ bản.
- Không được chỉnh trực tiếp dữ liệu tiến độ người học qua CMS.

## 3. Phạm vi MVP

### Tài khoản

- Đăng ký bằng email và mật khẩu.
- Đăng nhập, đăng xuất.
- Refresh session.
- Quên và đặt lại mật khẩu.
- Xác minh email có thể triển khai sau beta nội bộ nhưng trước public launch.
- Google Login không thuộc MVP đầu tiên.

### Học tập

- Hiragana.
- Katakana.
- Từ vựng N5.
- Ngữ pháp N5.
- Kanji N5.
- Flashcard.
- Quiz.
- Tiến độ học.
- Streak.

### CMS

- CRUD nội dung.
- Trạng thái `DRAFT`, `PUBLISHED`, `ARCHIVED`.
- Sắp xếp module, lesson và item.
- Preview trước khi publish.
- Validate đủ nội dung đa ngôn ngữ.
- Import/export JSON.
- Audit log cho thao tác publish và archive.

### Đa ngôn ngữ

- UI locale: `vi`, `en`, `ja`.
- Không hard-code chuỗi hiển thị trong component.
- Nội dung học hỗ trợ bản dịch theo locale.
- Japanese source text luôn được lưu riêng, không coi là bản dịch UI.

## 4. Ngoài phạm vi MVP

- AI chatbot hoặc AI giải thích.
- Chấm phát âm.
- Thanh toán hoặc subscription.
- Giáo viên, lớp học trực tiếp.
- Community, chat, leaderboard.
- Offline mobile.
- Google Login.
- Push notification.
- Audio production pipeline.
- JLPT N4 trở lên.

## 5. Luồng chính

### Luồng học

1. Learner đăng nhập.
2. Chọn module hoặc tiếp tục bài gần nhất.
3. Đọc nội dung bài học.
4. Hoàn thành practice/quiz.
5. Hệ thống ghi tiến độ và hoạt động trong ngày.
6. Dashboard cập nhật streak và bài tiếp theo.
7. Flashcard đến hạn được đưa vào phiên ôn tập.

### Luồng CMS

1. Admin tạo item hoặc lesson ở trạng thái nháp.
2. CMS validate dữ liệu bắt buộc.
3. Admin preview bằng từng locale.
4. Admin publish.
5. Nội dung mới xuất hiện trong API learner.
6. Hành động publish được lưu audit log.

## 6. Quy tắc streak

- Một ngày được tính hoạt động khi người dùng hoàn thành ít nhất một lesson, quiz hoặc phiên flashcard có câu trả lời.
- Ngày được tính theo timezone của người dùng; mặc định `Asia/Ho_Chi_Minh`.
- `currentStreak` và `longestStreak` có thể cache, nhưng `DailyActivity` là nguồn dữ liệu kiểm tra.
- Không có streak freeze hoặc grace day trong MVP.
- Chạy lại cùng một request không được tăng streak nhiều lần.

## 7. Yêu cầu phi chức năng

- Responsive từ mobile web đến desktop.
- Keyboard navigation cho luồng học và CMS chính.
- Mọi endpoint có validation.
- API có version prefix `/api/v1`.
- Không lưu refresh token dạng rõ trong database.
- Không lưu token đăng nhập trong `localStorage` của web.
- Không log password, token hoặc secret.
- Có unit test cho logic streak, tiến độ và SRS.
- Có integration test cho auth và publish content.
- Có E2E cho các luồng learner và admin quan trọng.
- Mọi thay đổi schema có Prisma migration.
- Mọi feature có handoff.

## 8. Tiêu chí hoàn thành MVP

MVP đạt khi:

- Learner có thể tạo tài khoản, đăng nhập và học từ đầu đến cuối một lesson của từng module.
- Learner làm được flashcard và quiz.
- Tiến độ và streak được lưu đúng, kể cả retry request.
- Admin có thể tạo và publish nội dung mà không chỉnh database thủ công.
- UI chính hoạt động ở `vi`, `en`, `ja`.
- CI pass trên pull request.
- Production có health check, migration procedure và rollback note.
