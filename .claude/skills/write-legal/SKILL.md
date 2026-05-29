---
name: write-legal
description: Generate legal documents (NDAs, contracts) with template-based automation, individual profile management, and comprehensive placeholder replacement while preserving exact formatting.
---

# Write Legal - Legal Document Generation

A comprehensive skill for generating legal documents with template-based automation. Creates NDAs with perfect formatting preservation, individual profile reuse, and intelligent information gathering.

## When to Use This Skill

Use this skill when the user mentions:
- Creating NDAs (Non-Disclosure Agreements)
- Legal document generation
- Template-based document creation
- Need to fill legal document placeholders
- Mentions individuals needing legal agreements
- Contract preparation (future expansion)

## Key Capabilities

- **Template Change Detection**: Monitors template files for modifications
- **Individual Profile Database**: Stores and reuses individual information
- **Freeform Input Processing**: Parses natural language inputs like "NDA for John Doe, john@email.com, backend developer"
- **Formatting Preservation**: Maintains exact Word document structure and legal formatting
- **Direct DOCX Editing**: Edit existing docx files without format conversion
- **Copy and Rename**: Create copies with new names for editing
- **Company Information**: Pre-configured Mirai360 AI details
- **Project Type Management**: 9 predefined types plus custom options
- **Comprehensive Validation**: Ensures all placeholders are filled
- **Performance Tracking**: Target 2-4 minutes per document

## Instructions

### 1. Environment Setup
```python
# Setup virtual environment and imports
import subprocess
import sys
from pathlib import Path

# Use existing virtual environment with python-docx
venv_path = "/tmp/docx_env"
if not Path(venv_path).exists():
    subprocess.run([sys.executable, "-m", "venv", venv_path], check=True)
    subprocess.run([f"{venv_path}/bin/pip", "install", "python-docx>=0.8.11"], check=True)

# Add virtual environment to path
sys.path.insert(0, f"{venv_path}/lib/python3.13/site-packages")

# Import the skill
skill_path = Path("~/.claude/skills/write-legal/scripts").expanduser()
sys.path.insert(0, str(skill_path))
from write_legal import create_nda, WriteLegalSkill
```

### 2. Basic NDA Creation

**For freeform input (preferred approach):**
```python
# User says: "Create NDA for John Doe, john@example.com, AI expert"
result = create_nda("NDA for John Doe, john@example.com, AI expert")
```

**For structured input:**
```python
result = create_nda(
    full_name="John Doe",
    email="john@example.com",
    address="123 Main St, City, State, ZIP",
    professional_description="AI expert specializing in backend development",
    project_type="Full Stack Development Services",
    agreement_date="2025-11-06"  # Optional, defaults to today
)
```

### 3. Handle Missing Information

When information is missing, the skill will raise a ValueError with a checklist:
```python
try:
    result = create_nda("NDA for John")  # Missing info
except ValueError as e:
    # Show the checklist to user
    print(str(e))
    # Ask user for missing information
```

### 4. Use Individual Database for Reuse

```python
# Initialize skill for advanced features
skill = WriteLegalSkill()

# Get suggestions for existing individuals
suggestions = skill.get_individual_suggestions("john@")

# For returning individuals, just provide email
result = create_nda(email="existing@email.com", project_type="New Project Type")
```

### 5. Edit Existing DOCX Files

**Direct editing without format conversion:**
```python
# Edit existing docx file
from write_legal import edit_docx

# Simple text replacement
result = edit_docx(
    "/path/to/existing.docx", 
    [{"find": "old text", "replace": "new text"}]
)

# Multiple edits with output to new file
result = edit_docx(
    "/path/to/original.docx",
    [
        {"find": "Recipient", "replace": "Advisor"},
        {"find": "shall serve as", "replace": "serves as an Advisor providing"}
    ],
    "/path/to/updated.docx"
)
```

### 6. Copy and Rename DOCX Files

**Create copies for editing:**
```python
from write_legal import copy_rename_docx

# Copy and rename in same directory
result = copy_rename_docx("/path/to/original.docx", "new_filename")

# Copy to different directory
result = copy_rename_docx("/path/to/original.docx", "new_filename", "/different/directory")
```

### 7. Display Results

```python
if result["success"]:
    # Simple clean output
    skill = WriteLegalSkill()
    print(skill.format_completion_summary(result["summary"]))
else:
    print(f"❌ Error: {result['error']}")
```

## File Locations (Critical)

- **Template Location**: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Legal/Templates/NDA Template.docx`
- **Output Location**: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Legal/Executed NDAs/`
- **Skill Code**: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Skills/write_legal/`

## Project Types Available

1. Full Stack Development Services
2. AI/ML Consulting Services  
3. Legal Tech Development
4. Custom Software Development
5. Backend Development Services
6. Frontend Development Services
7. Data Analytics Services
8. Cloud Infrastructure Services
9. Custom - User Specified

## Company Information (Pre-configured)

- **Name**: Shivang Patel on behalf of Mirai360 AI
- **Address**: 404, 4th floor, Galaxy Mall, Neharunagar Shivranjani Road, Ahmedabad 380015
- **Email**: shivang@mirai360.ai
- **Jurisdiction**: Ahmedabad

## Examples

### Example 1: Simple Freeform Request
```
User: "Create an NDA for Abdul Kadar, abdul@kuzhiyil.in, he's an AI expert"

Assistant Action:
result = create_nda("NDA for Abdul Kadar, abdul@kuzhiyil.in, AI expert")
```

### Example 2: Missing Information Handling
```
User: "I need an NDA for Sarah"

Assistant Action:
try:
    result = create_nda("NDA for Sarah")
except ValueError as e:
    # Show checklist and ask for missing info
    print("Missing information needed:")
    print(str(e))
```

### Example 3: Existing Individual
```
User: "Create another NDA for Abdul with a different project type"

Assistant Action:
result = create_nda(email="abdul@kuzhiyil.in", project_type="AI/ML Consulting Services")
```

### Example 4: Complete Structured Input
```
User: "NDA for Jane Smith, full stack developer at jane@tech.com, address 456 Tech Ave San Francisco"

Assistant Action:
result = create_nda(
    full_name="Jane Smith",
    email="jane@tech.com", 
    address="456 Tech Ave, San Francisco",
    professional_description="Full stack developer",
    project_type="Full Stack Development Services"
)
```

## Error Handling

- **Missing Template**: Check template file exists at specified location
- **Missing Information**: Show interactive checklist with current and missing fields
- **Invalid Email**: Validate email format before processing
- **File Permissions**: Ensure write access to output directory
- **Unsupported Documents**: Gracefully fail for non-NDA requests (future expansion)

## Performance Expectations

- **Template Analysis**: 30 seconds (first run only, then cached)
- **Document Generation**: 30-60 seconds
- **Total Time**: 2-4 minutes per NDA
- **File Output**: Properly formatted .docx files with no placeholders remaining

## Completion Summary Format

Always provide a concise summary after successful completion:
```
📋 EXECUTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Input Template: NDA Template.docx
Output File: /LegalAI/Docs/Legal/Executed NDAs/NDA_John_Doe.docx
Individual: John Doe (john@example.com)
Project: Full Stack Development Services
Tool: python-docx + template preservation
Completed: 2025-11-06 14:23:45 (2.3 minutes)
Status: ✅ All placeholders filled
File Size: 67.2 KB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```