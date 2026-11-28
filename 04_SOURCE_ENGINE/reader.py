#!/usr/bin/env python3
"""SÁCH TRỜI v0.1 local reader: image + PDF text/scan.

Outputs:
  source-manifest.json
  source-units.jsonl
  assets/ (embedded PDF images and optional rendered OCR pages)

OCR is optional and requires Tesseract installed on the machine.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from statistics import median
from typing import Any

SUPPORTED = {".pdf", ".png", ".jpg", ".jpeg", ".tif", ".tiff", ".bmp"}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def source_id_for(path: Path) -> str:
    return "SRC-" + sha256_file(path)[:16].upper()


def write_json(path: Path, value: Any) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def ocr_image(image, language: str):
    try:
        import pytesseract
        from pytesseract import Output
    except ImportError as exc:
        raise RuntimeError("Thiếu pytesseract. Cài requirements-ocr.txt và Tesseract OCR.") from exc

    data = pytesseract.image_to_data(image, lang=language, output_type=Output.DICT)
    words, confidences = [], []
    for word, raw_conf in zip(data["text"], data["conf"]):
        word = word.strip()
        try:
            conf = float(raw_conf)
        except (TypeError, ValueError):
            conf = -1
        if word:
            words.append(word)
            if conf >= 0:
                confidences.append(conf / 100.0)
    text = " ".join(words).strip()
    return text, (median(confidences) if confidences else None)


def image_unit(path: Path, out: Path, language: str, source_id: str) -> tuple[list[dict], dict]:
    from PIL import Image, ImageOps

    image = Image.open(path)
    image = ImageOps.exif_transpose(image).convert("RGB")
    text, confidence = ocr_image(image, language)
    units = [{
        "source_id": source_id,
        "source_version": sha256_file(path),
        "unit_id": f"{source_id}-IMG-0001",
        "content_type": "text",
        "content": text,
        "locator": {"kind": "image_region", "label": "Toàn ảnh"},
        "extraction_method": "ocr",
        "extractor_name": "tesseract",
        "extractor_version": None,
        "confidence": confidence,
        "verification_status": "needs_review" if text else "unreviewed",
        "evidence_ref": [path.name],
        "language": language,
        "warnings": [] if text else ["OCR không tìm thấy văn bản; cần kiểm tra ảnh thủ công."],
        "created_at": now_iso()
    }]
    manifest = {
        "source_id": source_id, "title": path.stem, "source_type": "image",
        "original_asset": {"name": path.name, "mime_type": Image.MIME.get(image.format, "image/unknown"),
                           "uri": None, "sha256": sha256_file(path), "size_bytes": path.stat().st_size},
        "metadata": {"language": language, "rights_status": "unknown"},
        "ingestion_status": "needs_review",
        "extraction_runs": [{"run_id": "RUN-001", "method": "ocr", "status": "completed",
                             "started_at": None, "finished_at": now_iso(), "error_summary": None}],
        "coverage": {"unit_kind": "items", "expected_units": 1, "discovered_units": 1,
                     "extracted_units": 1 if text else 0, "verified_units": 0, "failed_units": 0,
                     "unreadable_units": [] if text else ["image:1"]},
        "created_at": now_iso(), "updated_at": now_iso()
    }
    return units, manifest


def pdf_units(path: Path, out: Path, language: str, source_id: str, dpi: int) -> tuple[list[dict], dict]:
    try:
        import fitz
    except ImportError as exc:
        raise RuntimeError("Thiếu PyMuPDF. Cài requirements.txt trước.") from exc

    doc = fitz.open(path)
    version = sha256_file(path)
    assets_dir = out / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    units: list[dict] = []
    unreadable: list[str] = []
    extracted_pages = 0
    run_start = now_iso()

    for page_index, page in enumerate(doc):
        page_no = page_index + 1
        page_text = page.get_text("text").strip()
        method = "native_parser"
        confidence = None
        warnings: list[str] = []

        # Scanned pages often have no meaningful text layer. OCR only those pages.
        if len(re.sub(r"\s+", "", page_text)) < 30:
            try:
                from PIL import Image
                pix = page.get_pixmap(dpi=dpi, alpha=False)
                page_image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                page_text, confidence = ocr_image(page_image, language)
                method = "ocr"
                rendered = assets_dir / f"page-{page_no:04d}-ocr.png"
                pix.save(rendered)
            except RuntimeError as exc:
                warnings.append(str(exc))
                page_text = ""
            except ImportError:
                warnings.append("Thiếu Pillow; không thể render trang scan để OCR.")
                page_text = ""

        if page_text:
            extracted_pages += 1
        else:
            unreadable.append(f"page:{page_no}")
            warnings.append("Không trích xuất được văn bản; cần kiểm tra trang gốc.")

        units.append({
            "source_id": source_id, "source_version": version,
            "unit_id": f"{source_id}-P{page_no:04d}-TEXT",
            "content_type": "text", "content": page_text,
            "locator": {"kind": "page", "page": page_no},
            "extraction_method": method, "extractor_name": "PyMuPDF" if method == "native_parser" else "Tesseract",
            "extractor_version": getattr(fitz, "VersionBind", None) if method == "native_parser" else None,
            "confidence": confidence, "verification_status": "needs_review" if method == "ocr" else "unreviewed",
            "evidence_ref": [f"{path.name}#page={page_no}"], "language": language,
            "warnings": warnings, "created_at": now_iso()
        })

        # Preserve detected tables as separate structured units where supported.
        try:
            finder = page.find_tables()
            for table_index, table in enumerate(finder.tables, start=1):
                rows = table.extract()
                if rows:
                    units.append({
                        "source_id": source_id, "source_version": version,
                        "unit_id": f"{source_id}-P{page_no:04d}-TABLE{table_index:02d}",
                        "content_type": "table", "content": {"rows": rows},
                        "locator": {"kind": "page", "page": page_no,
                                    "label": f"Bảng {table_index}"},
                        "extraction_method": "native_parser", "extractor_name": "PyMuPDF",
                        "extractor_version": getattr(fitz, "VersionBind", None),
                        "confidence": None, "verification_status": "needs_review",
                        "evidence_ref": [f"{path.name}#page={page_no}"],
                        "language": language,
                        "warnings": ["Bảng tự nhận diện; cần đối chiếu bố cục và ô gộp."],
                        "created_at": now_iso()
                    })
        except (AttributeError, Exception):
            # Older PyMuPDF versions do not expose table detection.
            pass

        # Preserve embedded images as assets with page locators.
        seen_on_page = set()
        for image_index, image_info in enumerate(page.get_images(full=True), start=1):
            xref = image_info[0]
            if xref in seen_on_page:
                continue
            seen_on_page.add(xref)
            try:
                extracted = doc.extract_image(xref)
                suffix = extracted.get("ext", "bin")
                asset_name = f"page-{page_no:04d}-image-{image_index:02d}.{suffix}"
                asset_path = assets_dir / asset_name
                asset_path.write_bytes(extracted["image"])
                rects = page.get_image_rects(xref)
                rect = rects[0] if rects else None
                locator = {"kind": "page", "page": page_no, "label": asset_name}
                if rect:
                    locator["region"] = {
                        "x": max(0, rect.x0 / page.rect.width),
                        "y": max(0, rect.y0 / page.rect.height),
                        "width": min(1, rect.width / page.rect.width),
                        "height": min(1, rect.height / page.rect.height)
                    }
                units.append({
                    "source_id": source_id, "source_version": version,
                    "unit_id": f"{source_id}-P{page_no:04d}-FIG{image_index:02d}",
                    "content_type": "figure", "content": {"asset_path": str(Path("assets") / asset_name)},
                    "locator": locator, "extraction_method": "native_parser",
                    "extractor_name": "PyMuPDF", "extractor_version": getattr(fitz, "VersionBind", None),
                    "confidence": None, "verification_status": "needs_review",
                    "evidence_ref": [f"{path.name}#page={page_no}"],
                    "language": language,
                    "warnings": ["Ảnh đã được giữ riêng; cần phân tích nội dung hình bằng vision hoặc người kiểm tra."],
                    "created_at": now_iso()
                })
            except Exception as exc:
                units.append({
                    "source_id": source_id, "source_version": version,
                    "unit_id": f"{source_id}-P{page_no:04d}-FIG{image_index:02d}",
                    "content_type": "figure", "content": {"xref": xref},
                    "locator": {"kind": "page", "page": page_no},
                    "extraction_method": "native_parser", "extractor_name": "PyMuPDF",
                    "extractor_version": getattr(fitz, "VersionBind", None),
                    "confidence": None, "verification_status": "needs_review",
                    "evidence_ref": [f"{path.name}#page={page_no}"],
                    "language": language, "warnings": [f"Không xuất được ảnh nhúng: {exc}"],
                    "created_at": now_iso()
                })

    page_count = len(doc)
    doc.close()
    status = "needs_review" if unreadable or any(u["verification_status"] == "needs_review" for u in units) else "verified"
    manifest = {
        "source_id": source_id, "title": path.stem, "source_type": "pdf_scan" if extracted_pages < page_count else "pdf_text",
        "original_asset": {"name": path.name, "mime_type": "application/pdf", "uri": None,
                           "sha256": version, "size_bytes": path.stat().st_size},
        "metadata": {"language": language, "rights_status": "unknown"},
        "ingestion_status": status,
        "extraction_runs": [{"run_id": "RUN-001", "method": "native_parser+ocr_fallback",
                             "status": "completed" if not unreadable else "partial",
                             "started_at": run_start, "finished_at": now_iso(),
                             "error_summary": None if not unreadable else "Một hoặc nhiều trang chưa đọc được."}],
        "coverage": {"unit_kind": "pages", "expected_units": page_count,
                     "discovered_units": page_count, "extracted_units": extracted_pages,
                     "verified_units": 0, "failed_units": len(unreadable),
                     "unreadable_units": unreadable},
        "created_at": now_iso(), "updated_at": now_iso()
    }
    return units, manifest


def main() -> int:
    parser = argparse.ArgumentParser(description="Đọc ảnh/PDF cho SÁCH TRỜI, giữ bằng chứng theo trang.")
    parser.add_argument("input", type=Path, help="Đường dẫn ảnh hoặc PDF")
    parser.add_argument("--out", type=Path, default=Path("sach-troi-output"))
    parser.add_argument("--lang", default="vie+eng", help="Mã ngôn ngữ Tesseract, mặc định vie+eng")
    parser.add_argument("--dpi", type=int, default=220)
    args = parser.parse_args()

    source = args.input.expanduser().resolve()
    if not source.is_file():
        parser.error(f"Không tìm thấy tệp: {source}")
    if source.suffix.lower() not in SUPPORTED:
        parser.error(f"Định dạng chưa hỗ trợ: {source.suffix}. Hiện hỗ trợ PDF và ảnh raster.")
    args.out.mkdir(parents=True, exist_ok=True)
    sid = source_id_for(source)

    try:
        if source.suffix.lower() == ".pdf":
            units, manifest = pdf_units(source, args.out, args.lang, sid, args.dpi)
        else:
            units, manifest = image_unit(source, args.out, args.lang, sid)
    except Exception as exc:
        print(f"Lỗi tiếp nhận: {exc}", file=sys.stderr)
        return 2

    write_json(args.out / "source-manifest.json", manifest)
    with (args.out / "source-units.jsonl").open("w", encoding="utf-8") as stream:
        for unit in units:
            stream.write(json.dumps(unit, ensure_ascii=False) + "\n")

    print(json.dumps({
        "source_id": sid, "manifest": str(args.out / "source-manifest.json"),
        "units_file": str(args.out / "source-units.jsonl"),
        "coverage": manifest["coverage"], "unit_count": len(units),
        "status": manifest["ingestion_status"]
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
