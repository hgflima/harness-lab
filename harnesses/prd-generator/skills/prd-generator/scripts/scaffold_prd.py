#!/usr/bin/env python3
"""
Scaffold a PRD directory structure with empty template files.

Usage:
    python scaffold_prd.py <output_path> --level {lite|standard|enterprise}

Examples:
    python scaffold_prd.py docs/prd/feature-auth --level standard
    python scaffold_prd.py docs/prd/fix-login --level lite
"""

import argparse
import os
from datetime import date


def create_file(path: str, content: str):
    """Create a file with the given content, creating parent dirs as needed."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Created: {path}")


def get_folder_name(output_path: str) -> str:
    """Extract the folder name from the output path."""
    return os.path.basename(output_path.rstrip("/"))


def scaffold_lite(output_path: str):
    """Create lite PRD structure (4 files)."""
    folder = get_folder_name(output_path)
    today = date.today().isoformat()

    create_file(
        os.path.join(output_path, "README.md"),
        f"# PRD: {folder}\n\n"
        f"**Created:** {today}\n"
        f"**Status:** ⏳ Planning\n"
        f"**Level:** Lite\n\n"
        f"---\n\n"
        f"## Navigation\n\n"
        f"1. [Overview & Stories](requirements/01-overview-and-stories.md)\n"
        f"2. [E2E Test Specs](requirements/02-e2e-test-specs.md)\n"
        f"3. [Tasks & Timeline](task_assignments/01-tasks-and-timeline.md)\n\n"
        f"---\n\n"
        f"## Document History\n\n"
        f"| Date | Version | Changes |\n"
        f"|------|---------|--------|\n"
        f"| {today} | 0.1 | Initial structure |\n",
    )

    create_file(
        os.path.join(output_path, "requirements", "01-overview-and-stories.md"),
        f"# Overview & User Stories\n\n"
        f"<!-- Generated {today} - Fill in from discovery interview -->\n\n"
        f"## Overview\n\n"
        f"## User Stories\n\n",
    )

    create_file(
        os.path.join(output_path, "requirements", "02-e2e-test-specs.md"),
        f"# E2E Test Specifications\n\n"
        f"<!-- Generated {today} - Fill in from discovery interview -->\n\n"
        f"<!-- Lite PRDs keep E2E specs as a first-class artifact: every user story\n"
        f"     in 01-overview-and-stories.md MUST map to at least one test below.\n"
        f"     Scope can be lighter (Given/When/Then per story is enough), but the\n"
        f"     coder-agent ↔ tester-agent contract is non-negotiable. -->\n\n"
        f"## Coverage Map\n\n"
        f"| User Story | E2E Test |\n"
        f"|------------|----------|\n\n"
        f"## Tests\n\n",
    )

    create_file(
        os.path.join(output_path, "task_assignments", "01-tasks-and-timeline.md"),
        f"# Tasks & Timeline\n\n"
        f"<!-- Generated {today} - Fill in from discovery interview -->\n\n"
        f"## Task Breakdown\n\n"
        f"## Timeline\n\n",
    )


def scaffold_standard(output_path: str):
    """Create standard PRD structure (8 files)."""
    folder = get_folder_name(output_path)
    today = date.today().isoformat()

    # README
    create_file(
        os.path.join(output_path, "README.md"),
        f"# PRD: {folder}\n\n"
        f"**Created:** {today}\n"
        f"**Status:** ⏳ Planning\n\n"
        f"---\n\n"
        f"## Requirements\n\n"
        f"1. [Overview & Goals](requirements/01-overview-and-goals.md)\n"
        f"2. [User Stories](requirements/02-user-stories.md)\n"
        f"3. [Technical Architecture](requirements/03-technical-architecture.md)\n"
        f"4. [Security & Performance](requirements/04-security-and-performance.md)\n"
        f"5. [E2E Test Specs](requirements/05-e2e-test-specs.md)\n\n"
        f"## Task Assignments\n\n"
        f"1. [Task Breakdown](task_assignments/01-task-breakdown.md)\n"
        f"2. [Dependencies & Critical Path](task_assignments/02-dependencies-critical-path.md)\n"
        f"3. [Timeline Estimates](task_assignments/03-timeline-estimates.md)\n\n"
        f"---\n\n"
        f"## Document History\n\n"
        f"| Date | Version | Changes |\n"
        f"|------|---------|--------|\n"
        f"| {today} | 0.1 | Initial structure |\n",
    )

    # Requirements
    req_files = {
        "01-overview-and-goals.md": "Overview & Goals",
        "02-user-stories.md": "User Stories",
        "03-technical-architecture.md": "Technical Architecture",
        "04-security-and-performance.md": "Security & Performance",
        "05-e2e-test-specs.md": "E2E Test Specifications",
    }

    for filename, title in req_files.items():
        create_file(
            os.path.join(output_path, "requirements", filename),
            f"# {title}\n\n"
            f"<!-- Generated {today} - Fill in from discovery interview -->\n\n",
        )

    # Task assignments
    task_files = {
        "01-task-breakdown.md": "Task Breakdown",
        "02-dependencies-critical-path.md": "Dependencies & Critical Path",
        "03-timeline-estimates.md": "Timeline Estimates",
    }

    for filename, title in task_files.items():
        create_file(
            os.path.join(output_path, "task_assignments", filename),
            f"# {title}\n\n"
            f"<!-- Generated {today} - Fill in from discovery interview -->\n\n",
        )


def scaffold_enterprise(output_path: str):
    """Create enterprise PRD structure (standard + compliance sections)."""
    # Start with standard
    scaffold_standard(output_path)

    today = date.today().isoformat()

    # Add compliance note to security file
    security_path = os.path.join(
        output_path, "requirements", "04-security-and-performance.md"
    )
    with open(security_path, "a", encoding="utf-8") as f:
        f.write(
            f"\n## Compliance & Audit\n\n"
            f"<!-- Enterprise: Add regulatory compliance, audit trail, "
            f"and stakeholder sign-off requirements -->\n\n"
            f"### Regulatory Requirements\n\n"
            f"### Audit Trail\n\n"
            f"### Stakeholder Sign-off Matrix\n\n"
            f"| Stakeholder | Role | Sign-off Required | Date |\n"
            f"|------------|------|-------------------|------|\n"
        )

    # Update README to note enterprise level
    readme_path = os.path.join(output_path, "README.md")
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(
        "**Status:** ⏳ Planning",
        "**Status:** ⏳ Planning\n**Level:** Enterprise",
    )
    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"  Updated: {readme_path} (enterprise flag)")
    print(f"  Updated: {security_path} (compliance sections)")


def main():
    parser = argparse.ArgumentParser(
        description="Scaffold a PRD directory structure"
    )
    parser.add_argument("output_path", help="Path for the PRD directory")
    parser.add_argument(
        "--level",
        choices=["lite", "standard", "enterprise"],
        default="standard",
        help="Detail level (default: standard)",
    )

    args = parser.parse_args()

    print(f"\nScaffolding PRD: {args.output_path} (level: {args.level})\n")

    if args.level == "lite":
        scaffold_lite(args.output_path)
    elif args.level == "standard":
        scaffold_standard(args.output_path)
    elif args.level == "enterprise":
        scaffold_enterprise(args.output_path)

    print(f"\n✅ PRD structure created at: {args.output_path}\n")


if __name__ == "__main__":
    main()
