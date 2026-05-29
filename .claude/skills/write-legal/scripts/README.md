# write_legal - Legal Document Generation Skill

A comprehensive skill for generating legal documents with template-based automation. Currently supports NDAs with plans for contracts, renewals, and other legal documents.

## Features

- **Template Change Detection**: Automatically monitors template files for changes
- **Individual Profile Database**: Stores and reuses individual information across documents
- **Freeform Input Processing**: Accepts natural language input for information gathering
- **Formatting Preservation**: Maintains exact Word document formatting and structure
- **Project Type Management**: Predefined and custom project type support
- **Performance Tracking**: Monitors and reports generation performance
- **Comprehensive Validation**: Ensures all placeholders are filled

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

```python
from write_legal import create_nda

# Freeform input
result = create_nda("NDA for John Doe, john@example.com, backend developer")

# Structured input
result = create_nda(
    full_name="John Doe",
    email="john@example.com", 
    address="123 Main St, City, State, ZIP",
    professional_description="AI expert specializing in backend development",
    project_type="Full Stack Development Services",
    agreement_date="2025-11-06"
)
```

### Advanced Usage

```python
from write_legal import WriteLegalSkill

skill = WriteLegalSkill()

# Get project type options
project_types = skill.get_project_types()

# Get individual suggestions for auto-completion
suggestions = skill.get_individual_suggestions("john@")

# Get database statistics
stats = skill.get_database_stats()

# Validate template
template_status = skill.validate_template("nda")
```

## File Structure

```
write_legal/
├── __init__.py              # Package initialization
├── write_legal.py          # Main skill implementation  
├── config.py               # Configuration settings
├── template_analyzer.py    # Template analysis and change detection
├── individual_database.py  # Individual profiles management
├── document_processor.py   # Document generation engine
├── requirements.txt        # Dependencies
├── README.md              # Documentation
└── data/                  # Runtime data directory
    ├── template_cache.json # Template analysis cache
    └── individuals.json   # Individual profiles database
```

## Configuration

### Paths
- **Templates**: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Legal/Templates/`
- **Output**: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Docs/Legal/Executed NDAs/`
- **Data**: `/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI/Skills/write_legal/data/`

### Project Types
1. Full Stack Development Services
2. AI/ML Consulting Services
3. Legal Tech Development
4. Custom Software Development
5. Backend Development Services
6. Frontend Development Services
7. Data Analytics Services
8. Cloud Infrastructure Services
9. Custom - User Specified

### Company Information (Mirai360 AI)
Pre-configured company information is automatically used:
- Name: Shivang Patel on behalf of Mirai360 AI
- Address: 404, 4th floor, Galaxy Mall, Neharunagar Shivranjani Road, Ahmedabad 380015
- Email: shivang@mirai360.ai
- Jurisdiction: Ahmedabad

## Template Support

### Currently Supported
- **NDA**: Non-Disclosure Agreements (fully implemented)

### Future Support
- **Contracts**: Service contracts (planned)
- **SOPs**: Statement of Purpose documents (planned)
- **Renewals**: Contract renewals (planned)

## API Reference

### create_nda(input_text=None, **kwargs)

Create an NDA document.

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
Dict with creation results and summary

### WriteLegalSkill Class

#### Methods

- `create_nda(input_text, **kwargs)`: Main NDA creation method
- `get_individual_suggestions(query)`: Get profile suggestions for auto-completion
- `get_project_types()`: Get available project types
- `get_database_stats()`: Get database statistics
- `validate_template(doc_type)`: Validate template and return analysis
- `format_completion_summary(summary)`: Format completion summary for display

## Error Handling

The skill provides graceful error handling for:
- Missing required information (shows interactive checklist)
- Invalid template files
- Unsupported document types
- File system errors
- Validation failures

## Performance Targets

- Template Analysis: 30 seconds (first run only)
- Information Collection: 1-2 minutes (with reuse)
- Document Generation: 30-60 seconds
- Total Time: 2-4 minutes per NDA

## Examples

### Example 1: First-time Individual

```python
result = create_nda(
    full_name="Jane Smith",
    email="jane@techcorp.com",
    address="456 Tech Ave, San Francisco, CA 94105",
    professional_description="Senior AI Engineer specializing in machine learning and data science",
    project_type="AI/ML Consulting Services"
)

print(result["summary"]["status"])  # ✅ Success
```

### Example 2: Existing Individual (Auto-completion)

```python
# Individual exists in database, only email needed
result = create_nda(
    email="jane@techcorp.com",
    project_type="Custom Software Development"
)
```

### Example 3: Freeform Input

```python
result = create_nda("NDA for Bob Wilson, bob@startup.io, full stack developer in Austin Texas")
```

### Example 4: Error Handling

```python
result = create_nda("John Doe")  # Missing information

if not result["success"]:
    print(result["error"])  # Shows checklist of missing information
```

## CLI Usage

```bash
# Create NDA with structured input
python write_legal.py --name "John Doe" --email "john@example.com" --project "Full Stack Development Services"

# Create NDA with freeform input
python write_legal.py --input "NDA for Jane Smith, jane@corp.com, AI expert"

# Validate template
python write_legal.py --validate

# Show database stats
python write_legal.py --stats
```

## License

Part of CRTX.in AI Consultation framework.