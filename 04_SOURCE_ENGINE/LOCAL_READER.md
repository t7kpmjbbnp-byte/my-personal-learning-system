# Local reader — ảnh và PDF (v0.1)

## Phạm vi hiện tại
- Ảnh PNG/JPG/TIFF/BMP: OCR thành một Source Unit.
- PDF có text: trích xuất text theo từng trang.
- PDF scan: render trang và OCR khi lớp text rỗng/quá ngắn.
- PDF có bảng: thử nhận diện bảng nếu phiên bản PyMuPDF hỗ trợ.
- PDF có ảnh nhúng: lưu ảnh thành asset riêng, khử trùng lặp theo SHA-256 nhưng vẫn giữ từng vị trí xuất hiện theo trang/vùng.
- Phân loại PDF thành text, scan hoặc mixed dựa trên số trang có lớp text và số trang phải OCR.
- Xuất `source-manifest.json`, `source-units.jsonl` và `coverage-report.json` (báo cáo từng trang, OCR, ảnh, bảng và cảnh báo).

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
- `source-manifest.json`: nguồn, fingerprint phiên bản, trạng thái và thống kê tiếp nhận.
- `source-units.jsonl`: mỗi dòng là một đơn vị nội dung có locator, extraction method và trạng thái kiểm chứng.
- `coverage-report.json`: trạng thái theo từng trang; số trang text/OCR, số lượt ảnh, số ảnh duy nhất và số lượt trùng.
- `assets/`: ảnh trang OCR và ảnh nhúng đã khử trùng lặp theo nội dung.

## Chạy kiểm thử helper
Từ thư mục gốc repo:
```powershell
python -m unittest discover -s 04_SOURCE_ENGINE
```

## Giới hạn phải biết
- OCR không đảm bảo chính xác; kết quả OCR luôn cần kiểm tra.
- Nhận diện bảng phụ thuộc phiên bản PyMuPDF và cần đối chiếu ô gộp, cột/hàng.
- Hình ảnh chỉ được tách, khử trùng lặp và liên kết vị trí; chưa có mô hình vision phân tích nội dung hình.
- Phân loại `mixed` được ghi trong metadata; schema source_type hiện dùng `pdf_text` cho cả text và mixed để giữ tương thích.
- Chưa có giao diện upload, đồng bộ Notion, vector index hay hỏi đáp đa nguồn.
- Script không tải tài liệu lên dịch vụ bên ngoài.
