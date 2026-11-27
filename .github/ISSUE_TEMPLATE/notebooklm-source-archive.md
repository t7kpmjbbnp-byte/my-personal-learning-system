---
name: NotebookLM Source Archive Capture
about: Lưu trữ có cấu trúc nguồn, prompt, câu trả lời, ghi chú và trích dẫn từ NotebookLM
title: "[SOURCE ARCHIVE] "
---

> Dùng mẫu này để lưu một phiên làm việc hoặc một chủ đề từ NotebookLM. Giữ nguyên nội dung gốc và trích dẫn; không chỉ dán bản tóm tắt.

## CAPTURE_METADATA
Ngày/giờ ghi nhận:
Tên notebook:
URL notebook (nếu có):
Tên chủ đề/phiên:
Trạng thái: in_progress / captured_unverified / checked / partial_unavailable
Google Docs export link (nếu có):

## SOURCE_INVENTORY
### Source 1
Tên nguồn chính xác như NotebookLM hiển thị:
Loại nguồn: [PDF / slide / Google Docs / website / video / khác]
Tác giả/đơn vị xuất bản:
Năm/phiên bản/ấn bản:
URL hoặc vị trí lưu bản gốc:
Số trang/slide hoặc mục liên quan:
Ngày truy cập:
Ghi chú bản quyền/quyền chia sẻ:

### Additional sources
[Liệt kê từng nguồn bổ sung. Không gộp nhiều nguồn thành một tên chung.]

## ORIGINAL_PROMPTS
### Prompt 1
[Dán nguyên văn câu hỏi/yêu cầu đã nhập]

### Follow-up prompts
[Dán từng câu hỏi tiếp nối theo đúng thứ tự. Nếu không có, ghi: Không có.]

## NOTEBOOKLM_ANSWERS
### Answer 1 — full captured text
[Dán đầy đủ câu trả lời cần lưu. Giữ tiêu đề, bảng, danh sách, lưu ý, giới hạn và trích dẫn.]

### Follow-up answers
[Dán đầy đủ từng câu trả lời tương ứng. Nếu dài, chia thành Part 1/N, Part 2/N... và không bỏ đoạn.]

## SAVED_NOTES
### Note 1
Tên ghi chú:
Nội dung đầy đủ:
[Giữ nguyên từng ghi chú. Lặp lại mục này cho các ghi chú khác.]

## NOTEBOOKLM_CITATIONS
[Giữ nguyên ký hiệu trích dẫn, tên nguồn, số trang/mục và URL đúng như NotebookLM hiển thị. Không tự tạo lại trích dẫn.]

## LEARNER_ANNOTATIONS
Điều mình hiểu:
Điểm chưa rõ:
Câu hỏi muốn ChatGPT kiểm tra:
Ghi chú riêng của người học (phân biệt với nội dung nguồn):

## CAPTURE_CHECKLIST
- [ ] Đã ghi đúng tên notebook.
- [ ] Đã kiểm kê tất cả nguồn được dùng trong phiên này.
- [ ] Đã ghi thông tin truy xuất tài liệu gốc.
- [ ] Đã lưu nguyên văn prompt ban đầu.
- [ ] Đã lưu các prompt tiếp nối quan trọng.
- [ ] Đã lưu đầy đủ câu trả lời liên quan hoặc chia đủ các phần.
- [ ] Đã lưu các Notes liên quan.
- [ ] Đã giữ nguyên trích dẫn và số trang/mục.
- [ ] Đã so sánh bản sao/xuất với nội dung NotebookLM.
- [ ] Đã ghi rõ phần không thể lấy hoặc chưa kiểm tra.
- [ ] Đã kiểm tra quyền chia sẻ và không có dữ liệu nhạy cảm.

## KNOWN_GAPS
[Liệt kê nội dung chưa xuất được, thiếu trích dẫn, thiếu trang, lịch sử hội thoại không truy cập được... Nếu không có, ghi: Chưa phát hiện.]

## CHATGPT_REVIEW_REQUEST
Hãy tạo bản ghi Markdown trong 04_SOURCE_BRIDGE/records/ theo RECORD_TEMPLATE.md. Bảo toàn nội dung NotebookLM đã dán; không tự rút gọn. Tách riêng phần đánh giá của ChatGPT khỏi nội dung gốc. Kiểm tra tính đầy đủ, nguồn dẫn, điểm chưa được nguồn hỗ trợ và các chỗ cần xác minh. Cập nhật SOURCE_REGISTER.md sau khi đối chiếu. Không tạo LEARNING UPDATE và không tự đánh dấu mastery.
