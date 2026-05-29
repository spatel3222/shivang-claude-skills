"""
Configuration settings for write_legal skill
"""

import os
from pathlib import Path

# Base paths
PROJECT_BASE_DIR = Path("/Users/shivangpatel/Documents/GitHub/crtx.in/LegalAI")
TEMPLATES_DIR = PROJECT_BASE_DIR / "Docs" / "Legal" / "Templates"
OUTPUT_DIR = PROJECT_BASE_DIR / "Docs" / "Legal" / "Executed NDAs"

# User-level data directory (temporary files)
SKILL_DATA_DIR = Path("~/.claude/skills/write-legal/data").expanduser()

# Template configurations
SUPPORTED_TEMPLATES = {
    "nda": {
        "template_file": "NDA Template.docx",
        "output_prefix": "NDA_",
        "supported": True
    },
    "contract": {
        "template_file": "Contract Template.docx", 
        "output_prefix": "CONTRACT_",
        "supported": False  # Future implementation
    },
    "sop": {
        "template_file": "SOP Template.docx",
        "output_prefix": "SOP_",
        "supported": False  # Future implementation
    }
}

# Project types database
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

# Company information (Mirai360 AI)
COMPANY_INFO = {
    "name": "Shivang Patel on behalf of Mirai360 AI",
    "address": "404, 4th floor, Galaxy Mall, Neharunagar Shivranjani Road, Ahmedabad 380015",
    "email": "shivang@mirai360.ai",
    "short_name": "Mirai360 AI",
    "kind_attention": "Shivang Patel",
    "description": "Mirai360.ai is an Agentic AI OS for legal systems that transforms Indian law firms through comprehensive automation of back office operations, client experiences, and legal intelligence. The platform enables boutique practices to handle larger, more complex cases through our AI-first agentic architecture that operates autonomously across legal workflows. Built for Indian legal complexity with vernacular language support, Mirai360.ai operates as the complete AI operating system that converts traditional legal practices into strategic advisory firms.",
    "jurisdiction": "Ahmedabad",
    "arbitration_venue": "Ahmedabad"
}

# Default agreement settings
DEFAULT_AGREEMENT = {
    "jurisdiction": "Ahmedabad",
    "arbitration_venue": "Ahmedabad",
    "agreement_location": "Ahmedabad"
}

# File naming conventions
NAMING_CONVENTIONS = {
    "nda": "{prefix}{first_name}_{last_name}.docx"
}

# Validation patterns
VALIDATION_PATTERNS = {
    "email": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
    "placeholders": [r"\[●\]", r"\[Insert.*?\]", r"TBD"]
}

# Performance targets (in seconds)
PERFORMANCE_TARGETS = {
    "template_analysis": 30,
    "information_collection": 120,
    "document_generation": 60,
    "total_time": 240
}