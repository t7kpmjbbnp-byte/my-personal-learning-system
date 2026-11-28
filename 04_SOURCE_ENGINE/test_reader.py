"""Fast unit tests for deterministic reader helpers; run with python -m unittest discover -s 04_SOURCE_ENGINE."""
import unittest

from reader import classify_pdf_profile, sha256_bytes


class ReaderHelperTests(unittest.TestCase):
    def test_text_pdf_is_not_misclassified_as_scan(self):
        self.assertEqual(classify_pdf_profile(35, 0), "text")

    def test_scan_pdf_profile(self):
        self.assertEqual(classify_pdf_profile(0, 35), "scan")

    def test_mixed_pdf_profile(self):
        self.assertEqual(classify_pdf_profile(34, 1), "mixed")

    def test_image_hash_is_content_based(self):
        self.assertEqual(sha256_bytes(b"same image"), sha256_bytes(b"same image"))
        self.assertNotEqual(sha256_bytes(b"image A"), sha256_bytes(b"image B"))


if __name__ == "__main__":
    unittest.main()
