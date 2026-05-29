#!/usr/bin/env python3
"""
Test the write-legal skill as it would be used in Claude Code
"""

import subprocess
import sys
from pathlib import Path

def setup_environment():
    """Setup the environment exactly as described in SKILL.md"""
    
    print("🔧 Setting up write-legal skill environment...")
    
    # Use existing virtual environment with python-docx
    venv_path = "/tmp/docx_env"
    if not Path(venv_path).exists():
        print(f"Creating virtual environment at {venv_path}")
        subprocess.run([sys.executable, "-m", "venv", venv_path], check=True)
        subprocess.run([f"{venv_path}/bin/pip", "install", "python-docx>=0.8.11"], check=True)
    else:
        print(f"Using existing virtual environment at {venv_path}")

    # Add virtual environment to path
    sys.path.insert(0, f"{venv_path}/lib/python3.13/site-packages")

    # Import the skill
    skill_path = Path("~/.claude/skills/write-legal/scripts").expanduser()
    sys.path.insert(0, str(skill_path))
    
    try:
        from write_legal import create_nda, WriteLegalSkill
        print("✅ write-legal skill imported successfully")
        return create_nda, WriteLegalSkill
    except Exception as e:
        print(f"❌ Failed to import write-legal skill: {e}")
        raise

def demonstrate_skill_usage():
    """Demonstrate the skill working as intended"""
    
    print("\n🚀 Demonstrating write-legal skill usage...")
    
    # Setup
    create_nda, WriteLegalSkill = setup_environment()
    skill = WriteLegalSkill()
    
    # Test 1: Validate template
    print("\n📋 Test 1: Template Validation")
    template_result = skill.validate_template("nda")
    if template_result["success"]:
        print(f"✅ Template valid: {template_result['template_info']['total_placeholders']} placeholders")
    else:
        print(f"❌ Template validation failed: {template_result['error']}")
        return False
    
    # Test 2: Show missing information handling
    print("\n📋 Test 2: Missing Information Handling")
    try:
        result = create_nda("NDA for Test User")
    except ValueError as e:
        print("✅ Correctly identified missing information:")
        error_lines = str(e).split('\n')[:5]  # Show first 5 lines
        for line in error_lines:
            print(f"   {line}")
    
    # Test 3: Project types
    print("\n📋 Test 3: Project Types Available")
    project_types = skill.get_project_types()
    print(f"✅ {len(project_types)} project types available:")
    for i, ptype in enumerate(project_types[:5], 1):
        print(f"   {i}. {ptype}")
    if len(project_types) > 5:
        print(f"   ... and {len(project_types) - 5} more")
    
    # Test 4: Database stats
    print("\n📋 Test 4: Database Statistics")
    stats = skill.get_database_stats()
    print(f"✅ Database stats:")
    print(f"   Individuals: {stats['total_individuals']}")
    print(f"   Documents created: {stats['total_documents_created']}")
    
    # Test 5: Freeform input parsing
    print("\n📋 Test 5: Freeform Input Parsing")
    test_input = "NDA for Alice Johnson, alice@techcorp.com, AI researcher"
    parsed = skill.individual_db.parse_freeform_input(test_input)
    print(f"✅ Parsed input: {parsed}")
    
    print("\n🎉 All tests completed successfully!")
    print("\n📖 The write-legal skill is ready for use in Claude Code!")
    
    return True

def show_usage_examples():
    """Show example usage patterns"""
    
    print("\n" + "="*60)
    print("📚 USAGE EXAMPLES FOR CLAUDE CODE")
    print("="*60)
    
    examples = [
        {
            "title": "Example 1: Freeform Input (Recommended)",
            "user_request": 'Create an NDA for John Doe, john@example.com, AI expert',
            "claude_action": 'create_nda("NDA for John Doe, john@example.com, AI expert")'
        },
        {
            "title": "Example 2: Structured Input",
            "user_request": 'I need an NDA for Jane Smith, backend developer',
            "claude_action": '''create_nda(
    full_name="Jane Smith",
    email="jane@company.com",
    professional_description="Backend developer",
    project_type="Backend Development Services"
)'''
        },
        {
            "title": "Example 3: Existing Individual",
            "user_request": 'Create another NDA for John with different project',
            "claude_action": '''create_nda(
    email="john@example.com", 
    project_type="AI/ML Consulting Services"
)'''
        }
    ]
    
    for example in examples:
        print(f"\n{example['title']}:")
        print(f"User: \"{example['user_request']}\"")
        print(f"Claude Action:")
        print(f"```python")
        print(f"{example['claude_action']}")
        print(f"```")

if __name__ == "__main__":
    try:
        success = demonstrate_skill_usage()
        
        if success:
            show_usage_examples()
            
            print("\n" + "="*60)
            print("🎉 write-legal Claude Code Skill is READY!")
            print("="*60)
            print("📁 Skill Location: ~/.claude/skills/write-legal/")
            print("📖 Documentation: ~/.claude/skills/write-legal/SKILL.md")
            print("🔧 Reference: ~/.claude/skills/write-legal/reference.md")
            print("="*60)
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()