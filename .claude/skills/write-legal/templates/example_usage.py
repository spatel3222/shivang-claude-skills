#!/usr/bin/env python3
"""
Example usage patterns for write_legal skill
"""

import sys
from pathlib import Path

# Add skill scripts to path
skill_scripts = Path(__file__).parent.parent / "scripts"
sys.path.insert(0, str(skill_scripts))

from write_legal import create_nda, WriteLegalSkill

def example_freeform_input():
    """Example: Using freeform input (recommended approach)"""
    
    print("Example 1: Freeform Input")
    print("-" * 40)
    
    # Simulate user input
    user_input = "Create NDA for John Doe, john@example.com, AI expert backend developer"
    
    try:
        result = create_nda(user_input)
        
        if result["success"]:
            print("✅ NDA created successfully")
            print(f"Output: {result['output_file']}")
        else:
            print(f"❌ Error: {result['error']}")
            
    except ValueError as e:
        print("Missing information:")
        print(str(e))

def example_structured_input():
    """Example: Using structured input"""
    
    print("\nExample 2: Structured Input")
    print("-" * 40)
    
    result = create_nda(
        full_name="Jane Smith",
        email="jane@techcorp.com",
        address="456 Tech Avenue, San Francisco, CA 94105",
        professional_description="Senior AI Engineer specializing in machine learning and data science",
        project_type="AI/ML Consulting Services",
        agreement_date="2025-11-06"
    )
    
    if result["success"]:
        print("✅ NDA created successfully")
        # Format and display summary
        skill = WriteLegalSkill()
        print(skill.format_completion_summary(result["summary"]))
    else:
        print(f"❌ Error: {result['error']}")

def example_existing_individual():
    """Example: Reusing existing individual profile"""
    
    print("\nExample 3: Existing Individual Reuse")
    print("-" * 40)
    
    # First, create an individual profile
    create_nda(
        full_name="Bob Wilson",
        email="bob@startup.io",
        address="789 Startup Blvd, Austin, TX 78701",
        professional_description="Full stack developer with startup experience",
        project_type="Full Stack Development Services"
    )
    
    # Now reuse the profile with different project
    result = create_nda(
        email="bob@startup.io",
        project_type="Custom Software Development"
    )
    
    if result["success"]:
        print("✅ Reused existing profile successfully")
        print(f"Individual: {result['individual_profile']['full_name']}")
    else:
        print(f"❌ Error: {result['error']}")

def example_suggestions():
    """Example: Getting individual suggestions"""
    
    print("\nExample 4: Individual Suggestions")
    print("-" * 40)
    
    skill = WriteLegalSkill()
    
    # Get suggestions for partial input
    suggestions = skill.get_individual_suggestions("john")
    
    print(f"Found {len(suggestions)} suggestions for 'john':")
    for suggestion in suggestions:
        print(f"  • {suggestion['full_name']} ({suggestion['email']}) - {suggestion['documents_count']} docs")

def example_database_stats():
    """Example: Getting database statistics"""
    
    print("\nExample 5: Database Statistics")
    print("-" * 40)
    
    skill = WriteLegalSkill()
    stats = skill.get_database_stats()
    
    print(f"Total individuals: {stats['total_individuals']}")
    print(f"Total documents created: {stats['total_documents_created']}")
    print(f"Average docs per individual: {stats['average_documents_per_individual']:.1f}")
    
    if stats['project_type_distribution']:
        print("\nProject type distribution:")
        for project_type, count in stats['project_type_distribution'].items():
            print(f"  • {project_type}: {count}")

def example_error_handling():
    """Example: Handling errors and missing information"""
    
    print("\nExample 6: Error Handling")
    print("-" * 40)
    
    try:
        # This will fail due to missing information
        result = create_nda("NDA for Sarah")
        
    except ValueError as e:
        print("Caught missing information error:")
        print(str(e))
        
        # Provide missing information
        print("\nProviding complete information:")
        result = create_nda(
            full_name="Sarah Johnson",
            email="sarah@company.com",
            address="321 Business St, New York, NY 10001",
            professional_description="Data scientist with expertise in analytics",
            project_type="Data Analytics Services"
        )
        
        if result["success"]:
            print("✅ NDA created after providing missing info")

def main():
    """Run all examples"""
    
    print("=" * 60)
    print("🚀 write_legal Skill - Usage Examples")
    print("=" * 60)
    
    examples = [
        example_freeform_input,
        example_structured_input,
        example_existing_individual,
        example_suggestions,
        example_database_stats,
        example_error_handling
    ]
    
    for example in examples:
        try:
            example()
        except Exception as e:
            print(f"❌ Example failed: {e}")
    
    print("\n" + "=" * 60)
    print("📊 Examples completed")
    print("=" * 60)

if __name__ == "__main__":
    main()