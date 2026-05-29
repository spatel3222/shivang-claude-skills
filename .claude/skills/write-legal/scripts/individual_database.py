"""
Individual profiles database for reusing information across legal documents
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

try:
    from .config import SKILL_DATA_DIR, VALIDATION_PATTERNS
except ImportError:
    from config import SKILL_DATA_DIR, VALIDATION_PATTERNS


class IndividualDatabase:
    """Manages individual profiles and information reuse"""
    
    def __init__(self):
        self.data_dir = Path(SKILL_DATA_DIR)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.db_file = self.data_dir / "individuals.json"
        self._load_database()
    
    def _load_database(self) -> None:
        """Load individuals database"""
        try:
            if self.db_file.exists():
                with open(self.db_file, 'r') as f:
                    self.individuals = json.load(f)
            else:
                self.individuals = {}
        except Exception:
            self.individuals = {}
    
    def _save_database(self) -> None:
        """Save individuals database"""
        try:
            with open(self.db_file, 'w') as f:
                json.dump(self.individuals, f, indent=2)
        except Exception as e:
            print(f"Warning: Could not save individuals database: {e}")
    
    def add_individual(self, individual_info: Dict) -> str:
        """Add or update individual in database"""
        
        # Validate required fields
        required_fields = ["full_name", "email"]
        for field in required_fields:
            if field not in individual_info:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate email format
        if not self._validate_email(individual_info["email"]):
            raise ValueError(f"Invalid email format: {individual_info['email']}")
        
        # Use email as unique key
        email_key = individual_info["email"].lower()
        
        # Update or create profile
        if email_key in self.individuals:
            # Update existing profile
            self.individuals[email_key].update(individual_info)
            self.individuals[email_key]["last_updated"] = datetime.now().isoformat()
        else:
            # Create new profile
            self.individuals[email_key] = {
                **individual_info,
                "created": datetime.now().isoformat(),
                "last_updated": datetime.now().isoformat(),
                "documents_created": 0,
                "project_history": []
            }
        
        self._save_database()
        return email_key
    
    def get_individual(self, identifier: str) -> Optional[Dict]:
        """Get individual by email or partial name match"""
        
        # Try exact email match first
        email_key = identifier.lower()
        if email_key in self.individuals:
            return self.individuals[email_key]
        
        # Try partial name matching
        for email, profile in self.individuals.items():
            full_name = profile.get("full_name", "").lower()
            if identifier.lower() in full_name:
                return profile
        
        return None
    
    def search_individuals(self, query: str) -> List[Tuple[str, Dict]]:
        """Search individuals by name or email"""
        
        results = []
        query_lower = query.lower()
        
        for email, profile in self.individuals.items():
            full_name = profile.get("full_name", "").lower()
            
            if (query_lower in full_name or 
                query_lower in email or
                query_lower in profile.get("professional_description", "").lower()):
                results.append((email, profile))
        
        return results
    
    def get_suggestions(self, partial_input: str) -> List[Dict]:
        """Get profile suggestions based on partial input"""
        
        suggestions = []
        results = self.search_individuals(partial_input)
        
        for email, profile in results[:5]:  # Limit to top 5 suggestions
            suggestions.append({
                "email": email,
                "full_name": profile.get("full_name"),
                "last_project": profile.get("project_history", [])[-1] if profile.get("project_history") else None,
                "documents_count": profile.get("documents_created", 0)
            })
        
        return suggestions
    
    def update_document_count(self, email: str, project_type: str) -> None:
        """Update document creation count and project history"""
        
        email_key = email.lower()
        if email_key in self.individuals:
            profile = self.individuals[email_key]
            profile["documents_created"] = profile.get("documents_created", 0) + 1
            profile["last_updated"] = datetime.now().isoformat()
            
            # Update project history
            project_history = profile.get("project_history", [])
            project_entry = {
                "project_type": project_type,
                "date": datetime.now().isoformat()
            }
            project_history.append(project_entry)
            
            # Keep only last 10 projects
            profile["project_history"] = project_history[-10:]
            
            self._save_database()
    
    def _validate_email(self, email: str) -> bool:
        """Validate email format"""
        pattern = VALIDATION_PATTERNS["email"]
        return bool(re.match(pattern, email))
    
    def parse_freeform_input(self, input_text: str) -> Dict:
        """Parse freeform input and extract individual information"""
        
        parsed_info = {}
        
        # Extract email
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, input_text)
        if email_match:
            parsed_info["email"] = email_match.group()
        
        # Extract potential name (words before email or first few words)
        words = input_text.split()
        name_words = []
        
        for word in words:
            if "@" in word:  # Stop at email
                break
            if word.lower() not in ["nda", "for", "create", "make"]:
                name_words.append(word.replace(",", ""))
        
        if name_words:
            parsed_info["full_name"] = " ".join(name_words[:4])  # Limit to 4 words
        
        # Extract common professional terms
        professional_terms = [
            "developer", "backend", "frontend", "full stack", "ai expert", 
            "ml engineer", "data scientist", "consultant", "architect"
        ]
        
        found_terms = []
        lower_input = input_text.lower()
        for term in professional_terms:
            if term in lower_input:
                found_terms.append(term)
        
        if found_terms:
            parsed_info["professional_description"] = f"Expert in {', '.join(found_terms)}"
        
        return parsed_info
    
    def get_database_stats(self) -> Dict:
        """Get database statistics"""
        
        total_individuals = len(self.individuals)
        total_documents = sum(profile.get("documents_created", 0) for profile in self.individuals.values())
        
        # Project type distribution
        project_types = {}
        for profile in self.individuals.values():
            for project in profile.get("project_history", []):
                project_type = project.get("project_type", "Unknown")
                project_types[project_type] = project_types.get(project_type, 0) + 1
        
        return {
            "total_individuals": total_individuals,
            "total_documents_created": total_documents,
            "project_type_distribution": project_types,
            "average_documents_per_individual": total_documents / max(total_individuals, 1)
        }