#!/usr/bin/env python3
"""
PDF to Markdown Converter
Direct text extraction without OCR - optimized for large PDFs
Returns JSON output for validation and data loss detection
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    print(json.dumps({
        "success": False,
        "error": "PyMuPDF not installed. Run: pip install pymupdf"
    }))
    sys.exit(1)


def extract_pdf_to_markdown(input_path: str, output_path: str = None) -> dict:
    """
    Extract text from PDF and convert to Markdown.

    Args:
        input_path: Path to input PDF file
        output_path: Optional path for output MD file (default: same dir as input)

    Returns:
        dict with extraction stats and status
    """
    input_file = Path(input_path)

    # Validate input
    if not input_file.exists():
        return {"success": False, "error": f"File not found: {input_path}"}

    if input_file.suffix.lower() != ".pdf":
        return {"success": False, "error": f"Not a PDF file: {input_path}"}

    # Set output path
    if output_path:
        output_file = Path(output_path)
    else:
        output_file = input_file.with_suffix(".md")

    # Extraction stats
    stats = {
        "total_pages": 0,
        "pages_with_text": 0,
        "empty_pages": [],
        "low_text_pages": [],  # Pages with <50 chars (likely image-only)
        "total_chars": 0,
        "chars_per_page": []
    }

    markdown_content = []
    markdown_content.append(f"# {input_file.stem}\n")
    markdown_content.append(f"*Converted from: {input_file.name}*\n\n---\n")

    try:
        doc = fitz.open(input_path)
        stats["total_pages"] = len(doc)

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            char_count = len(text)

            stats["chars_per_page"].append(char_count)
            stats["total_chars"] += char_count

            if char_count == 0:
                stats["empty_pages"].append(page_num + 1)
            elif char_count < 50:
                stats["low_text_pages"].append(page_num + 1)
                stats["pages_with_text"] += 1
            else:
                stats["pages_with_text"] += 1

            # Add page content to markdown
            markdown_content.append(f"\n## Page {page_num + 1}\n\n")

            if text:
                # Clean up text: normalize whitespace, preserve paragraphs
                paragraphs = text.split("\n\n")
                cleaned_paragraphs = []
                for para in paragraphs:
                    # Join lines within paragraph, preserve intentional breaks
                    lines = para.split("\n")
                    cleaned = " ".join(line.strip() for line in lines if line.strip())
                    if cleaned:
                        cleaned_paragraphs.append(cleaned)

                markdown_content.append("\n\n".join(cleaned_paragraphs))
            else:
                markdown_content.append("*[No text content - possibly image or scanned page]*")

            markdown_content.append("\n")

        doc.close()

        # Write output
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("".join(markdown_content))

        # Calculate extraction quality
        extraction_percentage = (stats["pages_with_text"] / stats["total_pages"] * 100) if stats["total_pages"] > 0 else 0

        return {
            "success": True,
            "input_file": str(input_file.absolute()),
            "output_file": str(output_file.absolute()),
            "stats": {
                "total_pages": stats["total_pages"],
                "pages_with_text": stats["pages_with_text"],
                "empty_pages": stats["empty_pages"],
                "low_text_pages": stats["low_text_pages"],
                "total_chars": stats["total_chars"],
                "avg_chars_per_page": stats["total_chars"] // stats["total_pages"] if stats["total_pages"] > 0 else 0,
                "extraction_percentage": round(extraction_percentage, 1)
            },
            "warnings": []
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to Markdown (direct text extraction)")
    parser.add_argument("--input", "-i", required=True, help="Path to input PDF file")
    parser.add_argument("--output", "-o", help="Path for output MD file (default: same location as input)")

    args = parser.parse_args()

    result = extract_pdf_to_markdown(args.input, args.output)

    # Add warnings based on stats
    if result.get("success") and result.get("stats"):
        stats = result["stats"]
        warnings = []

        if stats["extraction_percentage"] < 90:
            warnings.append(f"Low extraction rate: {stats['extraction_percentage']}% pages have text")

        if stats["empty_pages"]:
            warnings.append(f"Empty pages (no text): {stats['empty_pages']}")

        if stats["low_text_pages"]:
            warnings.append(f"Low text pages (<50 chars, possibly images): {stats['low_text_pages']}")

        result["warnings"] = warnings

    print(json.dumps(result, indent=2))
    return 0 if result.get("success") else 1


if __name__ == "__main__":
    sys.exit(main())
