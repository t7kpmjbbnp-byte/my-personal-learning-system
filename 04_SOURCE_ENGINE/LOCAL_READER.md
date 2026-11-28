# Local reader — ảnh và PDF (v0.1)

## Phạm vi hiện tại
- Ảnh PNG/JPG/TIFF/BMP: OCR thành một Source Unit.
- PDF có text: trích xuất text theo từng trang.
- PDF scan: render trang và OCR khi lớp text rỗng/quá ngắn.
- PDF có bảng: thử nhận diện bảng nếu phiên bản PyMuPDF hỗ trợ.
- PDF có ảnh nhúng: lưu ảnh thành asset riêng và tạo figure unit liên kết trang/vùng.
- Xuất `source-manifest.json` và `source-units.jsonl`.

## Cài đặt trên Windows
1. Cài Python 3.11+.
2. Mở PowerShell tại thư mục dự án:
   ```powershell
   py -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r 04_SOURCE_ENGINE/requirements.txt
   ```
3. Nếu cần OCR, cài Tesseract OCR và gói ngôn ngữ Vietnamese + English; sau đó:
   ```powershell
   pip install -r 04_SOURCE_ENGINE/requirements-ocr.txt
   ```
4. Chạy:
   ```powershell
   python 04_SOURCE_ENGINE/reader.py "C:\DuongDan\tai-lieu.pdf" --out "C:\DuongDan\ket-qua" --lang vie+eng
   ```

## Cách đọc kết quả
- `source-manifest.json`: nguồn, phiên bản, số trang phát hiện/đọc được/chưa đọc được.
- `source-units.jsonl`: mỗi dòng là một đơn vị nội dung có locator, extraction method và trạng thái kiểm chứng.
- `assets/`: ảnh trang OCR và ảnh nhúng được tách ra.

## Giới hạn phải biết
- OCR không đảm bảo chính xác; kết quả OCR luôn cần kiểm tra.
- Nhận diện bảng phụ thuộc phiên bản PyMuPDF và cần đối chiếu ô gộp, cột/hàng.
- Hình ảnh chỉ được tách và liên kết vị trí; chưa có mô hình vision phân tích nội dung hình.
- Chưa có giao diện upload, đồng bộ Notion, vector index hay hỏi đáp đa nguồn.
- Script không tải tài liệu lên dịch vụ bên ngoài.
