# Write Legal - Technical Reference

## Architecture Overview

The write_legal skill consists of modular components that work together to provide comprehensive legal document generation:

```
write_legal/
├── write_legal.py          # Main skill interface
├── config.py               # Configuration and constants
├── template_analyzer.py    # Template change detection
├── individual_database.py  # Profile management
├── document_processor.py   # Document generation engine
└── data/                   # Runtime data storage
```

## API Reference

### Main Functions

#### create_nda(input_text=None, **kwargs)
Primary function for NDA creation.

**Parameters:**
- `input_text` (str, optional): Freeform text with individual information
- `full_name` (str): Individual's full legal name
- `email` (str): Individual's email address
- `address` (str): Individual's complete address
- `professional_description` (str): Description of individual's expertise
- `project_type` (str): Type of project (from predefined list or custom)
- `agreement_date` (str, optional): Agreement date in YYYY-MM-DD format
- `short_name` (str, optional): Short reference name

**Returns:**
```python
{
    "success": bool,
    "output_file": str,           # Path to generated document
    "summary": dict,              # Execution summary
    "individual_profile": dict,   # Individual information used
    "error": str                  # Error message if success=False
}
```

### WriteLegalSkill Class

#### Methods

**create_nda(input_text, **kwargs)**
Main NDA creation method with full error handling.

**get_individual_suggestions(query: str) -> List[Dict]**
Get profile suggestions for auto-completion.
```python
suggestions = skill.get_individual_suggestions("john@")
# Returns: [{"email": "john@example.com", "full_name": "John Doe", ...}]
```

**get_project_types() -> List[str]**
Get available project types.

**get_database_stats() -> Dict**
Get database statistics including total individuals and documents created.

**validate_template(doc_type: str = "nda") -> Dict**
Validate template and return analysis.

**format_completion_summary(summary: Dict) -> str**
Format completion summary for display.

## Configuration Reference

### Paths Configuration
```python
BASE_DIR = "/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI"
TEMPLATES_DIR = BASE_DIR / "Docs" / "Legal" / "Templates"
OUTPUT_DIR = BASE_DIR / "Docs" / "Legal" / "Executed NDAs"
```

### Project Types
```python
PROJECT_TYPES = [
    "Full Stack Development Services",
    "AI/ML Consulting Services",
    "Legal Tech Development", 
    "Custom Software Development",
    "Backend Development Services",
    "Frontend Development Services",
    "Data Analytics Services",
    "Cloud Infrastructure Services",
    "Custom - User Specified"
]
```

### Company Information
```python
COMPANY_INFO = {
    "name": "Shivang Patel on behalf of Mirai360 AI",
    "address": "404, 4th floor, Galaxy Mall, Neharunagar Shivranjani Road, Ahmedabad 380015",
    "email": "shivang@mirai360.ai",
    "short_name": "Mirai360 AI",
    "kind_attention": "Shivang Patel",
    "jurisdiction": "Ahmedabad",
    "arbitration_venue": "Ahmedabad"
}
```

## Data Storage

### Template Cache (template_cache.json)
```json
{
  "nda": {
    "signature": "1762338507.29441_64728",
    "analysis": {
      "total_placeholders": 16,
      "categories": {...},
      "analysis_date": "2025-11-06T..."
    },
    "last_analyzed": "2025-11-06T..."
  }
}
```

### Individual Database (individuals.json)
```json
{
  "john@example.com": {
    "full_name": "John Doe",
    "address": "123 Main St, City, State, ZIP",
    "professional_description": "AI expert specializing in backend development",
    "documents_created": 3,
    "project_history": [
      {"project_type": "Full Stack Development Services", "date": "2025-11-06T..."}
    ],
    "created": "2025-11-06T...",
    "last_updated": "2025-11-06T..."
  }
}
```

## Template Processing

### Placeholder Patterns
The system recognizes these placeholder patterns:
- `[●]` - Standard placeholder
- `[Insert...]` - Descriptive placeholders
- `TBD` - To be determined

### Replacement Strategy
1. **Date and Venue**: Agreement dates, jurisdiction, arbitration venue
2. **Company Information**: Disclosing party details
3. **Individual Information**: Receiving party details
4. **Contact Information**: Addresses, emails, attention lines
5. **Signature Blocks**: For and on behalf of clauses

### Context-Aware Replacement
The system uses context clues to determine which information to use:
- Checks surrounding text for "Disclosing Party" vs "Receiving Party"
- Uses company info for disclosing party contexts
- Uses individual info for receiving party contexts

## Error Handling Patterns

### Information Validation
```python
# Email validation
VALIDATION_PATTERNS = {
    "email": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
}

# Required fields check
required_fields = ["full_name", "address", "email", "professional_description"]
missing_fields = [field for field in required_fields if not individual_info.get(field)]
```

### Template Validation
```python
# Check template existence
if not template_path.exists():
    raise FileNotFoundError(f"Template not found: {template_path}")

# Verify placeholder replacement
verification_result = self._verify_document(output_path)
if not verification_result["success"]:
    # Report remaining placeholders
```

## Performance Monitoring

### Targets
```python
PERFORMANCE_TARGETS = {
    "template_analysis": 30,    # seconds
    "information_collection": 120,
    "document_generation": 60,
    "total_time": 240
}
```

### Metrics Collected
- Template analysis time (cached after first run)
- Document generation time
- File size of output
- Number of placeholders processed
- Success/failure rates

## Extension Points

### Adding New Document Types
1. Add template configuration to `SUPPORTED_TEMPLATES`
2. Create template analysis patterns
3. Implement document-specific processing logic
4. Add validation rules

### Custom Project Types
Users can specify custom project types that are automatically stored and made available for future use.

### Additional Company Profiles
The system can be extended to support multiple company profiles for different business entities.

## Troubleshooting

### Common Issues

**"Template not found" Error:**
- Verify template exists at: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Legal/Templates/NDA Template.docx`
- Check file permissions

**"Missing python-docx" Error:**
- Install with: `pip install python-docx>=0.8.11`

**"Placeholders remaining" Warning:**
- Check template for new placeholder patterns
- Verify individual information completeness
- Re-run template analysis if template changed

**"Invalid email format" Error:**
- Ensure email follows standard format: `user@domain.com`

### Debug Mode
Set environment variable for detailed logging:
```bash
export WRITE_LEGAL_DEBUG=1
```