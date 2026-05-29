# shivang-claude-skills

Canonical source of truth for Shivang's custom Claude Code skills.

Skills live under `.claude/skills/`. The active install at `~/.claude/skills`
is a **symlink** to that folder, so this repo and the live skills are the same files.

## Workflow
- Edit a skill (repo or symlink — same files) -> `git add -A && git commit && git push`.
- Pull updates (other device / GitHub web edit) -> `git pull`; `~/.claude/skills` reflects it instantly via the symlink.
