---
name: pdf_to_md
description: Convert PDF files to Markdown format with validation and data loss detection
---

# PDF to Markdown Skill

Convert PDF files to Markdown using direct text extraction (no OCR). Includes validation step to identify potential data loss.

## When to Use This Skill

Use when user mentions:
- "Convert PDF to markdown"
- "PDF to MD"
- "Extract text from PDF"
- "/pdf_to_md"

## Execution Framework

### Phase 1: Parse User Request

**Extract from user prompt:**
1. **Input PDF path** - required
2. **Output path** - optional (default: same dir as input, `.md` extension)

**If input path not provided:**
Ask: "Please provide the path to the PDF file."

### Phase 2: Validate Input

Before running conversion:
1. Check file exists using `ls` or Read tool
2. Confirm it's a `.pdf` file
3. If output path specified, confirm it's writable

### Phase 3: Run Conversion

Execute the Python script:

```bash
python3 ~/.claude/skills/PDFtoMD/pdf_to_md.py --input "<input_pdf_path>" --output "<output_md_path>"
```

**Script returns JSON with:**
```json
{
  "success": true/false,
  "input_file": "/absolute/path/to/input.pdf",
  "output_file": "/absolute/path/to/output.md",
  "stats": {
    "total_pages": 10,
    "pages_with_text": 9,
    "empty_pages": [5],
    "low_text_pages": [3, 7],
    "total_chars": 25000,
    "avg_chars_per_page": 2500,
    "extraction_percentage": 90.0
  },
  "warnings": ["Empty pages (no text): [5]"],
  "error": "error message if failed"
}
```

### Phase 4: Validate Output (MANDATORY)

**After conversion, perform these checks:**

#### 4.1 Extraction Rate Check
```
IF extraction_percentage < 90%:
  WARN: "Low extraction rate ({X}%). Some pages may be scanned/image-only."
```

#### 4.2 Empty Pages Check
```
IF empty_pages exists:
  WARN: "Pages {list} have no text content. These may be:
         - Image-only pages (diagrams, photos)
         - Scanned pages requiring OCR
         - Blank pages"
```

#### 4.3 Low Text Pages Check
```
IF low_text_pages exists:
  WARN: "Pages {list} have minimal text (<50 chars). May be:
         - Chapter dividers
         - Image-heavy pages
         - Headers/footers only"
```

#### 4.4 Content Spot Check (Optional)
If warnings exist, offer to:
- Read first 50 lines of output MD
- Compare with a sample page from source PDF

### Phase 5: Report Results

**Success Report:**
```
Conversion Complete

Input:  {input_file}
Output: {output_file}

Stats:
- Total pages: {total_pages}
- Pages with text: {pages_with_text}
- Extraction rate: {extraction_percentage}%
- Total characters: {total_chars}

{Warnings if any}
```

**Error Report:**
```
Conversion Failed

Error: {error_message}

Troubleshooting:
- Verify file exists and is readable
- Ensure it's a valid PDF (not corrupted)
- Check pymupdf is installed: pip install pymupdf
```

## Data Loss Detection Thresholds

| Metric | Threshold | Action |
|--------|-----------|--------|
| extraction_percentage | <90% | Warn user |
| empty_pages | Any | List pages |
| low_text_pages | Any | List pages |
| avg_chars_per_page | <100 | Warn: likely scanned PDF |

## Requirements

- Python 3.x
- pymupdf library

**Install:**
```bash
pip install pymupdf
```

## Limitations

- **No OCR**: Only extracts embedded text. Scanned PDFs will have empty pages.
- **No images**: Images are not converted, only text.
- **Layout**: Complex layouts (tables, columns) may not preserve structure perfectly.

## Output Format

End every conversion with:
```
Skills: pdf_to_md
Agents: None
Tools: Bash
```
