---
name: commit-message
description: Writes commit messages by loading other skills and following each for its part - simple-text for what the subject and points say, multiple-skills for where they disagree. Use for every commit Claude makes.
---

# Commit message

This skill has no rules of its own. It loads the skills that cover commit messages and says which one decides what, so every commit message follows both the same way.

## When it applies

- Every commit Claude makes. The message goes straight into `git commit` as plain text.

## What to do

1. Load `simple-text` and `multiple-skills` with the Skill tool, unless they are already loaded.
2. Follow each one for its part:
   - **simple-text, "Commit messages":** what the subject and each point say (real values, names as in the code, which changes to merge or drop), their limits, and the subject's format from `git log`.
   - **multiple-skills:** whatever they disagree on, including the commit rules in the task's own instructions (e.g. an issue number at the end of the subject, a `Co-Authored-By` trailer).
