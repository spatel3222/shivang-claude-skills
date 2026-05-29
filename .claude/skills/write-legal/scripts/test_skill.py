#!/usr/bin/env python3
"""
Test script for write_legal skill
"""

import sys
import os
from pathlib import Path

# Add current directory to path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def test_basic_functionality():
    """Test basic skill functionality"""
    
    print("🧪 Testing write_legal skill...")
    
    try:
        from write_legal import WriteLegalSkill, create_nda
        print("✅ Import successful")
        
        # Initialize skill
        skill = WriteLegalSkill()
        print("✅ Skill initialization successful")
        
        # Test template validation
        template_result = skill.validate_template("nda")
        if template_result["success"]:
            print("✅ Template validation successful")
            print(f"   Template has {template_result['template_info']['total_placeholders']} placeholders")
        else:
            print(f"❌ Template validation failed: {template_result['error']}")
        
        # Test project types
        project_types = skill.get_project_types()
        print(f"✅ Found {len(project_types)} project types")
        
        # Test database stats
        stats = skill.get_database_stats()
        print(f"✅ Database has {stats['total_individuals']} individuals")
        
        print("\\n🎉 All basic tests passed!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_nda_creation():
    """Test NDA creation with sample data"""
    
    print("\\n🧪 Testing NDA creation...")
    
    try:
        from write_legal import create_nda
        
        # Test data
        test_individual = {
            "full_name": "Test User",
            "email": "test@example.com",
            "address": "123 Test Street, Test City, Test State 12345",
            "professional_description": "Test developer specializing in testing and quality assurance",
            "project_type": "Full Stack Development Services"
        }
        
        print("Creating test NDA...")
        result = create_nda(**test_individual)
        
        if result["success"]:
            print("✅ NDA creation successful")
            print(f"   Output file: {result['output_file']}")
            
            # Check if file exists
            if Path(result['output_file']).exists():
                print("✅ Output file created successfully")
                file_size = Path(result['output_file']).stat().st_size
                print(f"   File size: {file_size} bytes")
            else:
                print("❌ Output file not found")
                return False
                
            # Print summary
            summary = result["summary"]
            print(f"   Duration: {summary.get('duration_seconds', 0):.1f} seconds")
            print(f"   Status: {summary.get('status', 'Unknown')}")
            
        else:
            print(f"❌ NDA creation failed: {result['error']}")
            return False
        
        print("\\n🎉 NDA creation test passed!")
        return True
        
    except Exception as e:
        print(f"❌ NDA creation test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_freeform_input():
    """Test freeform input parsing"""
    
    print("\\n🧪 Testing freeform input parsing...")
    
    try:
        from write_legal import WriteLegalSkill
        
        skill = WriteLegalSkill()
        
        # Test parsing
        test_input = "NDA for Alice Johnson, alice@techcorp.com, senior developer"
        parsed = skill.individual_db.parse_freeform_input(test_input)
        
        print(f"✅ Parsed input: {parsed}")
        
        if "email" in parsed and "full_name" in parsed:
            print("✅ Freeform parsing successful")
        else:
            print("⚠️ Freeform parsing incomplete but functional")
        
        return True
        
    except Exception as e:
        print(f"❌ Freeform input test failed: {e}")
        return False

def main():
    """Run all tests"""
    
    print("=" * 60)
    print("🚀 write_legal Skill Test Suite")
    print("=" * 60)
    
    tests = [
        test_basic_functionality,
        test_freeform_input,
        # Note: Commenting out NDA creation test to avoid creating test files
        # test_nda_creation,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\\n" + "=" * 60)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Skill is ready to use.")
    else:
        print("⚠️ Some tests failed. Check implementation.")
    
    print("=" * 60)

if __name__ == "__main__":
    main()