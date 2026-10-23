---
name: multiple-skills
description: Decides which rule to follow when two or more loaded skills (or two rules) disagree about the same output - the rule written for exactly that output wins, otherwise the more restrictive one. Use whenever more than one skill applies to what Claude is writing and their rules pull different ways, and whenever another skill says to load it (e.g. commit-message), asked in any words or noticed unasked (e.g. "one skill says max 100 chars and the other no limit", "these two rules contradict", "estas dos skills se contradicen").
---

# Multiple skills

When several skills apply to the same output, their rules can disagree. This skill says which one to follow, so the result is the same every time instead of depending on which skill Claude happens to follow more closely.

## When it applies

- Two or more loaded skills, or two rules inside one skill, say different things about the same part of the same output.
- Not when the rules are about different things, or one of them is written for another kind of output (see the first rule).

## Rules

- **Check that both rules cover this output.** A rule meant for another kind of output (e.g. a style for messages to business, while writing developer docs) doesn't take part.
- **The rule written for exactly this output wins.** When one rule is written for exactly this output and the other for a broader kind that includes it, follow the exact one where they disagree, even if the broader one is more restrictive.
- **Otherwise, the more restrictive rule wins.** Follow the rule that allows less: a limit beats no limit, the lower limit beats the higher one, "never" beats "may". Rules that don't contradict each other all apply together.
- **If neither is more restrictive** (they ask for opposite things and are just as specific), follow the one that fits this output best and say the conflict in one line so the user can settle it. Conflicts the rules above settle need no mention.

## Examples

### Exact output against a broader kind

One skill's "Error messages" section says to show the error code; another skill says text for end users never shows codes. An error message is exactly what the first rule is for: show the code, even though "never" is more restrictive.

### A limit against no limit

One skill caps ticket titles at 60 characters; another says titles have no fixed length but should be as short as they can. Both cover ticket titles, and 60 is more restrictive than no limit: keep the title under 60, and as short as it can be within that.

### "Never" against "may"

One skill says emojis may be used in release notes; another says never use emojis in text that is pasted into chats, and the release notes go to a chat. "Never" is more restrictive: no emojis.
