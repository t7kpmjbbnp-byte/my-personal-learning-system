# SÁCH TRỜI — Knowledge Source Engine

Phiên bản thiết kế: 0.1

## Mục tiêu
Tiếp nhận nguồn tri thức đa định dạng, trích xuất nội dung, giữ vị trí bằng chứng gốc, lập chỉ mục và hỗ trợ phân tích có dẫn chứng.

## Pipeline
1. Register: tạo source_id, metadata và fingerprint phiên bản.
2. Inspect: nhận diện định dạng, số trang/slide/thời lượng và chất lượng.
3. Extract: chọn adapter phù hợp (PDF text, OCR, image/vision, DOCX, slides, spreadsheet, web, audio/video transcript).
4. Normalize: chuyển kết quả về Source Unit chuẩn.
5. Index: lập chỉ mục theo đơn vị có ngữ cảnh và liên kết vị trí gốc.
6. Analyze: hỏi đáp, tóm tắt, phân loại, so sánh và tổng hợp.
7. Verify: kiểm tra độ bao phủ, dẫn chứng, lỗi trích xuất và mâu thuẫn.
8. Publish: chỉ đề xuất ghi vào Notion sau kiểm duyệt.
9. Connect: liên kết tri thức đã duyệt với chủ đề/bài học và bản đồ vũ trụ.

## Nguyên tắc an toàn dữ liệu
- Bản gốc bất biến; mọi lần xử lý tạo extraction run/version riêng.
- Không coi OCR thành công là tri thức đã đầy đủ.
- Không tự tạo confidence score nếu adapter không cung cấp.
- Mọi câu trả lời quan trọng cần evidence locator.
- Phân biệt trích dẫn trực tiếp, tổng hợp suy luận và nội dung chưa đủ bằng chứng.
- Không tự động ghi đè hoặc xóa tri thức đã duyệt.
- Hỗ trợ quyền sử dụng, nguồn truy cập và ngày truy xuất.

## Chuẩn Source Unit
Xem `source-record.schema.json`.

## Mốc triển khai
- A: ảnh, PDF text, PDF scan; giữ page locator và báo cáo coverage.
- B: DOCX, PPTX, XLSX/CSV, website.
- C: audio/video transcript và timestamp.
- D: hỏi đáp đa nguồn, so sánh, phát hiện mâu thuẫn, citations.
- E: kiểm duyệt và publish vào Notion.

## Trạng thái
Đây là nền tảng hợp đồng dữ liệu và kiến trúc. Chưa có adapter OCR/parser hoặc giao diện upload được triển khai chỉ bằng việc thêm hai tệp này.
