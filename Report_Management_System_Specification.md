# Report Management System --- Functional & Technical Specification

**Document type:** Product / Software Requirements Specification\
**Module:** Report Management, Content Moderation & Community
Moderation\
**Version:** 1.0\
**Status:** Proposed baseline specification\
**Scope:** Social media platform with public/global content and
community-based content

------------------------------------------------------------------------

## 1. Purpose

This document defines how users report content and how reports are
reviewed, assigned, investigated, resolved, appealed, monitored, and
audited.

The system has two moderation paths:

1.  **Platform-level moderation** --- reports involving normal/global
    posts and other platform-wide content are handled by Platform
    Moderators and Platform Admins.
2.  **Community-level moderation** --- reports involving posts or
    comments inside a community are first handled by that community's
    authorized moderators or community admins, subject to platform-wide
    rules and escalation controls.

The two paths must share a common reporting foundation, status model,
audit trail, notification framework, and policy taxonomy. Their
permissions and scope of authority must remain separate.

> **Configuration note:** The platform's exact name, framework, database
> engine, and existing role names were not provided for this
> specification. Terms such as `Platform Admin`, `Platform Moderator`,
> `Community Admin`, and `Community Moderator` are logical roles. Map
> them to the actual role names in the application during
> implementation.

## 2. Goals

-   Make reporting easy, safe, and understandable for users.
-   Route each report to the correct moderation team.
-   Give moderators enough context to make fair decisions.
-   Prevent community administrators from exercising authority outside
    their communities.
-   Allow Platform Admins to intervene in serious, repeated,
    cross-community, or policy-level matters.
-   Prevent report counts alone from automatically proving a violation.
-   Maintain a traceable history of decisions and actions.
-   Provide an appeal/review mechanism.
-   Monitor queues, response times, repeat violations, moderator
    workload, and moderation quality.
-   Protect reporter identity and sensitive evidence from unauthorized
    access.

## 3. Non-goals

Unless separately approved, this module does not: - Replace the
platform's complete user-management system. - Automatically determine
every policy violation using AI. - Guarantee that every report will
result in content removal. - Allow a community admin to permanently ban
a user from the entire platform. - Allow a reporter to directly delete
another user's content by submitting a report. - Treat a high number of
reports as conclusive evidence of a violation.

------------------------------------------------------------------------

# Part A --- Concepts, Roles and Permissions

## 4. Content scope and ownership

### 4.1 Normal / Global content

Normal content is content published outside a specific community
context, such as: - Public or follower-visible posts. - Normal post
comments and replies. - User profile information, profile image, or
cover image. - Other platform-wide content types enabled by the product.

A report against this content is routed to the Platform Moderation
queue.

### 4.2 Community content

Community content is content published within a specific community, such
as: - Community posts. - Comments and replies on community posts. -
Community-specific media or links. - Community resources, if
reportable. - Community membership or conduct issues, where the platform
supports reporting them.

A report against community content is routed to the moderation team of
the community that owns the content, unless a routing or escalation rule
sends it directly to the Platform Moderation queue.

### 4.3 Determine ownership from the content record

The backend must determine the report route using the target content's
trusted database relationship: - If `community_id` is null, treat the
target as normal/global content. - If `community_id` is present, treat
the target as community content and validate that the community exists
and is active. - Do not trust a client-supplied `report_type`,
`owner_id`, or `community_id` as the sole source of routing authority. -
For comments, derive the community/global context from the parent post,
not from a value submitted by the client.

## 5. Roles

### 5.1 Reporter

Any authenticated user allowed to submit a report. Depending on product
policy, guests may be allowed to report selected public content, but
authenticated reporting is easier to rate-limit and audit.

Can: - Report eligible content or accounts. - Select a reason and
optionally provide details. - Attach evidence where supported. - View a
limited status such as submitted, under review, or closed, if the
product exposes report tracking. - Submit an appeal or additional
information only where policy allows.

Cannot: - See internal moderator notes. - See another user's reports. -
Choose the final action. - Force content removal through repeated
reports.

### 5.2 Platform Moderator

Handles platform-level queues and may be assigned escalated community
cases.

Can: - View reports within assigned platform moderation scope. - Review
the reported content and relevant context. - Apply permitted
platform-level content actions. - Issue platform warnings or
restrictions within delegated permission. - Escalate serious cases to a
Platform Admin. - Add internal notes and record a reason.

Cannot: - Change platform-wide policy unless explicitly authorized. -
Alter or erase audit history. - Access unrelated private messages or
private data without a separately authorized safety process.

### 5.3 Platform Admin

Responsible for platform-wide policy enforcement and moderation
governance.

Can: - View platform-wide moderation queues and escalations. - Assign
and reassign cases. - Configure categories, severity rules, SLA targets,
and moderation permissions. - Apply or approve platform-level actions. -
Review community moderator decisions where policy permits. - Suspend or
remove community-level privileges. - Handle appeals and serious
escalations. - Review audit logs and moderation analytics.

### 5.4 Community Moderator

A delegated role within one or more specific communities.

Can: - View reports routed to communities where they have an active
moderation role. - Review content in that community. - Apply
community-scoped actions allowed by the community's settings and
platform policy. - Hide or remove a community post/comment from that
community, where permitted. - Warn a member within the community, if
supported. - Escalate cases to the Community Admin or Platform
Moderation.

Cannot: - Moderate content in communities where they have no role. -
Apply platform-wide account suspension or permanent platform bans. -
Change global platform policy. - View reporter identity unless
explicitly required and authorized. - Modify reports or actions from
another community.

### 5.5 Community Admin

Owns or administers a specific community and is accountable for its
local moderation.

Can: - View and manage reports assigned to their community. - Assign
cases to that community's moderators. - Review moderator decisions. -
Apply community-scoped content and membership actions. - Configure
community rules and community-specific report guidance, within platform
policy. - Escalate serious or platform-wide issues. - View community
moderation metrics.

Cannot: - Ban a user from the entire platform unless a separate platform
permission explicitly allows it. - Remove or edit a user's normal/global
post. - Moderate another community's content. - Override platform-wide
safety decisions. - Hide a report from Platform Admins or delete the
audit trail. - Create a community rule that conflicts with platform-wide
policy.

### 5.6 Permission principle

A role's authority must be checked server-side for every read and write
operation. Hiding a button in the frontend is not an authorization
control.

## 6. Permission matrix

  ---------------------------------------------------------------------------------------------
  Capability          Reporter     Community     Community   Platform Moderator  Platform Admin
                                   Moderator         Admin                      
  --------------- ------------ ------------- ------------- -------------------- ---------------
  Submit report            Yes           Yes           Yes                  Yes             Yes

  View own            Optional      Optional      Optional             Optional        Optional
  report's public                                                               
  status                                                                        

  View global               No            No            No       Assigned scope             Yes
  report queue                                                                  

  View a                    No      Assigned   Owned/admin                   If             Yes
  community queue                communities   communities   assigned/escalated 

  Add internal              No   Yes, scoped   Yes, scoped                  Yes             Yes
  moderation note                                                               

  Hide/remove               No  If permitted   Yes, scoped     If escalated and             Yes
  community                                                           permitted 
  content                                                                       

  Remove                    No            No            No         If permitted             Yes
  normal/global                                                                 
  content                                                                       

  Warn member               No  If permitted           Yes         If delegated             Yes
  within a                                                                      
  community                                                                     

  Suspend                   No            No            No         If delegated             Yes
  platform                                                                      
  account                                                                       

  Permanently ban           No            No            No         Normally no; Yes, subject to
  platform                                                    approval required          policy
  account                                                                       

  Assign                    No  If delegated           Yes           No, except             Yes
  community                                                 escalation workflow 
  reports                                                                       

  Configure                 No            No            No                   No             Yes
  global policy                                                                 

  View audit logs           No    Own action     Community    Assigned/platform   Platform-wide
                                history only         scope                scope 
                                  if exposed                                    
  ---------------------------------------------------------------------------------------------

`Optional` means the product team must decide whether reporter-facing
status tracking is part of the user experience.

------------------------------------------------------------------------

# Part B --- Reporting Experience

## 7. Where users can report

The Report action may be available on: - Normal/global post menu. -
Comment/reply menu. - User profile menu. - Community post menu. -
Community comment/reply menu. - Community-specific content menu, if
applicable.

The UI should identify the target clearly, for example: "Report post",
"Report comment", or "Report profile".

## 8. Report submission flow

1.  User selects **Report**.
2.  The client opens a report dialog or page.
3.  The user selects a reason/category.
4.  The user may add a short explanation.
5.  The user may attach evidence if supported.
6.  The client displays a short confirmation of what will happen next.
7.  The backend validates the target, reporter, category, rate limits,
    and eligibility.
8.  The backend creates the report and routes it based on the target
    content's ownership.
9.  The reporter receives a confirmation.
10. The report appears in the correct moderation queue.

### 8.1 Suggested report categories

Use a configurable taxonomy. A suggested baseline:

  -----------------------------------------------------------------------
  Category                            Meaning
  ----------------------------------- -----------------------------------
  Spam or scam                        Repetitive, deceptive, or
                                      fraudulent content

  Harassment or bullying              Targeted abuse, intimidation, or
                                      bullying

  Hate or hateful conduct             Attacks targeting protected or
                                      vulnerable groups, as defined by
                                      policy

  Threats or violence                 Threats, praise, or promotion of
                                      violence

  Nudity or sexual content            Sexual or nudity-related content
                                      prohibited by platform policy

  Self-harm concern                   Content indicating self-harm risk
                                      or encouraging self-harm

  Child safety                        Suspected child exploitation or
                                      endangerment

  Misinformation                      False or misleading content, where
                                      covered by platform policy

  Intellectual property               Copyright or trademark concern

  Privacy violation                   Sharing personal information or
                                      private material without permission

  Impersonation                       Pretending to be another person or
                                      entity

  Illegal or regulated goods          Content prohibited by law or
                                      platform policy

  Community rule violation            A rule specific to the community

  Other                               User can provide an explanation
  -----------------------------------------------------------------------

Do not expose a category that the platform has no policy or operational
process to handle. Legal and child-safety categories may require a
specialized process and restricted access.

### 8.2 Report form fields

Required: - `target_type` - `target_id` - `reason_code`

Optional: - `description` - `evidence_attachment_ids` -
`additional_context`

Server-generated: - `report_id` - `reporter_id` - `content_owner_id` -
`community_id`, if applicable - `queue_type` - `created_at` -
`initial_status`

Do not ask users to provide unnecessary personal or sensitive
information.

### 8.3 Confirmation message

Suggested text:

"Thanks for letting us know. Your report has been submitted for review.
Reporting does not automatically remove content. Our moderation team
will review it under the platform's rules."

For community content, the message may say that the community moderation
team may review it, while serious safety or platform-policy concerns can
be escalated to the platform team.

## 9. Duplicate and coordinated reports

-   Multiple reports against the same content may be grouped into a case
    or linked to a common target.
-   Preserve each individual report record for audit, abuse detection,
    and reporter status.
-   Do not delete duplicate reports.
-   Show moderators the number of distinct reports and relevant
    categories, but do not treat volume alone as proof.
-   Apply rate limits per account, IP/device signals where lawful and
    appropriate, and target.
-   Detect suspicious mass-reporting patterns for review.
-   Do not automatically punish a reported user solely because a report
    threshold was reached.
-   Avoid allowing one reporter to create unlimited duplicate reports
    for the same target in a short period.
-   Keep a clear distinction between `report` (a user's allegation) and
    `moderation_case` (the work item reviewed by moderators).

------------------------------------------------------------------------

# Part C --- Workflow 1: Normal / Global Post Reports

## 10. Routing rules

When a user reports normal/global content: 1. Backend loads the target
content. 2. Backend verifies that the target exists and is reportable.
3. Backend confirms that the target has no community ownership. 4.
Backend creates the report. 5. Backend creates or links a platform
moderation case. 6. The case enters the Platform Moderation queue. 7.
The case is prioritized and assigned according to policy and workload.
8. Platform Moderator reviews the case. 9. The moderator resolves,
dismisses, or escalates it. 10. Platform Admin handles high-risk,
policy-sensitive, appealed, or escalated cases.

### 10.1 Platform moderation queue

Recommended queue tabs: - New / Unassigned - Assigned to Me - In
Review - High Priority - Critical / Safety Escalation - Awaiting More
Information - Appeal Requested - Resolved - Dismissed - Reopened

Recommended filters: - Report category - Content type - Priority /
severity - Status - Date range - Assigned moderator - Number of linked
reports - Repeat violation indicator - Language or region, if supported
and lawful

### 10.2 Platform report detail screen

The case detail page should contain:

**A. Case header** - Case ID and linked Report IDs. - Current status and
priority. - Created time and age of case. - Assigned moderator. -
Escalation indicator.

**B. Report information** - Report category and user explanation. -
Report submission time. - Count of linked reports. - Evidence
attachments, if any. - Reporter identity hidden by default from the
reviewer unless there is a justified, permission-controlled need.

**C. Target content** - Original post/comment/profile reference. -
Author account reference. - Content creation time. - Current visibility
and availability. - Relevant parent post or thread context. - Edit
history or content snapshot where retained and permitted. - Whether the
content has already been removed or changed.

**D. Context** - Relevant prior confirmed violations. - Related reports
and prior decisions. - Account-level risk signals approved for
moderation use. - Relevant policy section. - Any automated classifier
signal, clearly marked as advisory and not as a final decision.

**E. Decision panel** - No violation / dismiss. - Content action. -
Account action, if authorized. - Escalate. - Request additional review
or information. - Internal notes. - Policy reason and decision
explanation.

### 10.3 Platform moderator review procedure

1.  Open the case and confirm that the target is within platform scope.
2.  Read the allegation and inspect the target content.
3.  Review enough context to understand meaning, including parent
    post/thread where relevant.
4.  Compare the content with the applicable platform policy.
5.  Check whether the content is already unavailable, edited, or
    actioned.
6.  Check prior confirmed enforcement only where relevant.
7.  Select the correct policy outcome.
8.  Choose the least restrictive action that adequately addresses the
    violation.
9.  Enter a reason and internal note.
10. Submit the decision.
11. System records the action, actor, time, policy code, and affected
    target.
12. System sends relevant notifications.
13. Case is closed or escalated based on the decision.

### 10.4 Possible platform-level outcomes

  -----------------------------------------------------------------------
  Outcome                             Meaning
  ----------------------------------- -----------------------------------
  No violation                        Content does not breach the
                                      applicable policy

  Insufficient context                More information or specialist
                                      review is required

  Content warning / label             Add a warning or contextual label,
                                      if supported

  Reduce distribution                 Limit recommendation or discovery,
                                      if supported and policy permits

  Age / audience restriction          Restrict visibility to an eligible
                                      audience

  Remove content                      Remove the post/comment/media from
                                      the platform

  Feature restriction                 Temporarily restrict a relevant
                                      account feature

  Formal warning                      Notify the account holder of a
                                      policy breach

  Temporary account suspension        Suspend account access for a
                                      defined period

  Permanent account ban               Disable account under
                                      severe/repeated-violation policy

  Escalate                            Send to Platform Admin or
                                      specialist safety team

  Dismiss report                      Close because no violation is found
                                      or report is invalid
  -----------------------------------------------------------------------

A content decision and an account decision are separate. A post may be
removed without suspending its author. Account restrictions require
their own policy basis and authorization.

### 10.5 Platform Admin responsibilities

Platform Admin should: - Review critical and escalated cases. - Approve
high-impact account actions where the permission model requires
approval. - Review decisions with significant policy or legal
implications. - Handle appeals or assign independent appeal reviewers. -
Resolve conflicts between platform policy and local/community
decisions. - Audit moderator quality and consistency. - Configure queue
rules and severity/SLA targets. - Review patterns of abuse, coordinated
reporting, and repeated violations.

------------------------------------------------------------------------

# Part D --- Workflow 2: Community Post Reports

## 11. Community report routing

When a user reports content inside a community: 1. Backend loads the
target content and its parent relationships. 2. Backend derives the
owning `community_id`. 3. Backend checks that the community is active
and has a moderation team. 4. Backend creates the report and links it to
a community moderation case. 5. The case appears only to authorized
moderators/admins of that community and platform staff with appropriate
access. 6. Community Moderator or Community Admin reviews the report. 7.
The community team applies a community-scoped action, dismisses it, or
escalates it. 8. Platform Moderation receives escalated cases and
platform-wide policy concerns.

### 11.1 Why community moderation is separate

Communities often have their own rules, topics, and moderation needs. A
community admin should be able to enforce valid community rules without
gaining control over the entire platform.

Example: - A community prohibits off-topic advertising. - A member
publishes repeated promotional posts. - A user reports the post as spam
or a community-rule violation. - Community moderators review it and may
remove it from that community. - The community admin may issue a
community warning or temporary community restriction. - The community
admin cannot automatically delete the author's normal/global posts or
suspend the entire platform account.

## 12. Community moderation queue

Each community should have its own report queue.

Suggested tabs: - New Reports - Unassigned - Assigned to Me - In
Review - Community Rule Violations - Platform Policy Escalations -
Appeals / Reconsideration - Resolved - Dismissed

Recommended filters: - Report category - Community rule - Content type -
Priority - Status - Assigned community moderator - Report date - Repeat
community violations - Linked report count

A moderator who belongs to Community A must not be able to retrieve
Community B's queue by changing a URL, request parameter, or API
identifier.

## 13. Community report detail page

The detail page should show:

**A. Community information** - Community name and ID. - Community rules
relevant to the report. - Community status. - Current moderator
assignment.

**B. Report information** - Report ID and case ID. - Reason selected by
reporter. - User explanation. - Submission date. - Number of linked
reports. - Reporter identity hidden by default.

**C. Reported content** - Post/comment and parent context. - Content
author. - Date published. - Community visibility. - Relevant edit or
action history, where available.

**D. Community member context** - Membership status. - Relevant prior
confirmed community violations. - Previous community warnings or
restrictions. - Do not expose unrelated private account information.

**E. Moderator decision panel** - No community-rule violation. -
Community warning. - Remove/hide from community. - Lock comments, if
supported. - Temporary community posting restriction. - Remove member
from community, if supported. - Escalate to Platform Moderation. - Add
internal note. - Record the community rule and reason.

## 14. Community Moderator responsibilities

A Community Moderator should: - Review reports within assigned
communities only. - Apply the community's published rules
consistently. - Check the full relevant conversation, not only the
reported sentence or image. - Use proportionate actions. - Record the
exact rule breached. - Avoid retaliation against a reporter or a person
whose content is reported. - Escalate suspected threats, child-safety
issues, credible violence, doxxing, exploitation, or other serious
platform-policy concerns. - Avoid making platform-wide account
decisions.

## 15. Community Admin responsibilities

A Community Admin should: - Maintain a clear set of community rules. -
Ensure rules do not conflict with platform-wide policy. - Assign reports
to active moderators. - Review moderator decisions and unresolved
cases. - Handle community-level appeals if the product supports them. -
Escalate serious or repeated platform-policy concerns. - Monitor queue
age and moderator workload. - Review moderator conduct and conflicts of
interest. - Remove or suspend a moderator's community role where
authorized. - Keep community moderation actions auditable.

### 15.1 Community-specific actions

  -----------------------------------------------------------------------
  Action                  Scope                   Notes
  ----------------------- ----------------------- -----------------------
  Dismiss report          Report/case             No violation found

  Community warning       Community               Warning visible to the
                                                  member

  Remove post from        Community               Does not necessarily
  community                                       delete the original
                                                  content globally

  Remove comment from     Community               Does not necessarily
  community                                       remove copies or other
                                                  contexts

  Lock comments           Community post          Use only if supported
                                                  and justified

  Temporary posting       Community               User may remain on the
  restriction                                     platform

  Remove member from      Community               Does not suspend
  community                                       platform account

  Temporary community ban Community               Must have duration and
                                                  reason

  Escalate to platform    Platform queue          For platform policy or
                                                  serious safety concerns
  -----------------------------------------------------------------------

The system must clearly distinguish **Remove from Community** from
**Delete from Platform**. A community action must not silently change
global content visibility unless the platform's content ownership model
explicitly defines that behavior.

## 16. Community Admin must not do these things

Unless a separate platform permission is explicitly granted: - Delete a
user's normal/global post. - Suspend or permanently ban the user's
entire platform account. - Restrict the user in unrelated communities. -
View another community's private moderation queue. - Change global
report categories or platform policy. - Delete a report because it
criticizes the community admin. - Erase moderation history. - Reveal the
reporter's identity to the reported member. - Close a serious
platform-policy case without the required platform review.

## 17. When a community report must be escalated

Escalate to Platform Moderation when: - The content may violate a
platform-wide safety policy. - There is a credible threat of violence or
immediate danger. - Child safety or exploitation is suspected. - Private
personal information is exposed (doxxing). - There is suspected illegal
activity requiring specialized handling. - The same account is involved
in serious violations across multiple communities. - A community admin
or moderator is the subject of the report. - A moderator has a conflict
of interest. - The community admin requests platform-level action. - The
case is appealed and requires independent review. - The community team
cannot safely or confidently decide.

Escalation should preserve the original report, evidence references,
community decision history, and internal notes. The platform team should
not need the reporter to submit the same report again.

### 17.1 Community-to-platform escalation flow

`User report → Community queue → Community review → (a) Community resolution OR (b) Platform escalation → Platform review → Final platform decision → Notifications and audit record`

A community may still take an immediate temporary protective action
within its own scope while the platform reviews a serious case, if
policy permits. The platform team remains responsible for platform-wide
enforcement.

------------------------------------------------------------------------

# Part E --- Status, Priority and SLA

## 18. Recommended status model

Use one consistent status model for both queues, with optional
queue-specific labels.

  -----------------------------------------------------------------------
  Status                              Definition
  ----------------------------------- -----------------------------------
  `PENDING`                           Report received; not yet reviewed

  `TRIAGED`                           Category, scope, and priority
                                      checked

  `ASSIGNED`                          Assigned to a moderator

  `UNDER_REVIEW`                      Moderator is actively reviewing

  `NEEDS_INFORMATION`                 Awaiting additional evidence or
                                      specialist input

  `ESCALATED`                         Sent to a higher-level moderation
                                      team

  `ACTION_TAKEN`                      A moderation action has been
                                      applied

  `RESOLVED_NO_VIOLATION`             Review completed; no violation
                                      found

  `DISMISSED_INVALID`                 Invalid, duplicate-only, or
                                      out-of-scope report closed with
                                      reason

  `APPEALED`                          A decision has been challenged

  `REOPENED`                          Case reopened due to new evidence
                                      or review

  `CLOSED`                            Workflow is complete
  -----------------------------------------------------------------------

Do not use an ambiguous status such as `ACTION_REQUIRED` without
defining whether it means a decision is pending or an action has already
been applied.

### 18.1 Status transition rules

-   `PENDING → TRIAGED`
-   `TRIAGED → ASSIGNED`
-   `ASSIGNED → UNDER_REVIEW`
-   `UNDER_REVIEW → NEEDS_INFORMATION`
-   `NEEDS_INFORMATION → UNDER_REVIEW`
-   `UNDER_REVIEW → ESCALATED`
-   `ESCALATED → UNDER_REVIEW` (by receiving team)
-   `UNDER_REVIEW → ACTION_TAKEN`
-   `UNDER_REVIEW → RESOLVED_NO_VIOLATION`
-   `UNDER_REVIEW → DISMISSED_INVALID`
-   `ACTION_TAKEN → APPEALED` (if appeal is allowed)
-   `RESOLVED_NO_VIOLATION → APPEALED` (if appeal is allowed)
-   `APPEALED → REOPENED` or `APPEALED → CLOSED`
-   Any closed case may be reopened only by an authorized role with a
    recorded reason.

Every transition must be recorded in the audit trail. The backend must
reject invalid transitions.

## 19. Priority and severity

Suggested priority levels:

  -----------------------------------------------------------------------
  Priority                Example                 Handling
  ----------------------- ----------------------- -----------------------
  `LOW`                   Minor community rule    Normal queue
                          issue                   

  `MEDIUM`                Repeated spam or        Standard review
                          targeted low-level      
                          harassment              

  `HIGH`                  Credible harassment,    Prioritized review
                          privacy concern,        
                          repeated serious        
                          conduct                 

  `CRITICAL`              Imminent threat, child  Immediate specialist
                          safety, severe          escalation
                          exploitation, credible  
                          danger                  
  -----------------------------------------------------------------------

Priority is a triage aid, not a verdict. It may be based on: - Report
category. - Content context. - Credible risk indicators. - Target
vulnerability where policy allows. - Prior confirmed violations. - Time
sensitivity. - Potential reach or ongoing exposure. - Specialist safety
rules.

Do not assign critical priority merely because many users report the
same post.

## 20. SLA and queue monitoring

Set actual SLA targets based on staffing, risk, legal obligations, and
product scale. Example targets below are illustrative only:

  Priority     Example first-review target
  ---------- -----------------------------
  Critical                      15 minutes
  High                             4 hours
  Medium                          24 hours
  Low                             72 hours

Track: - Time from report creation to triage. - Time to assignment. -
Time to first review. - Time to final decision. - Time spent awaiting
information. - Time after escalation. - Appeal resolution time. -
Percentage of cases breaching SLA.

Pause or separately record time spent waiting for external information;
do not hide it from reporting. Critical safety cases should use a
dedicated on-call or escalation process if the platform offers such
coverage.

------------------------------------------------------------------------

# Part F --- Data Model

## 21. Recommended entities

The following is a logical relational model. Adapt field types and
naming to the actual database.

### 21.1 `reports`

Stores each user-submitted report.

  -----------------------------------------------------------------------
  Field                   Suggested type          Notes
  ----------------------- ----------------------- -----------------------
  `id`                    UUID                    Primary key

  `reporter_id`           UUID                    User who submitted
                                                  report

  `target_type`           ENUM/VARCHAR            POST, COMMENT, PROFILE,
                                                  COMMUNITY_RESOURCE,
                                                  etc.

  `target_id`             UUID                    Reported object ID

  `target_author_id`      UUID                    Content author, if
                                                  applicable

  `community_id`          UUID nullable           Derived from target
                                                  ownership

  `reason_code`           VARCHAR                 Selected report reason

  `description`           TEXT nullable           User explanation

  `status`                VARCHAR                 Report-level status or
                                                  linked case status

  `case_id`               UUID nullable           Linked moderation case

  `created_at`            TIMESTAMP               Server timestamp

  `updated_at`            TIMESTAMP               Server timestamp

  `is_validated`          BOOLEAN                 Backend validation
                                                  result
  -----------------------------------------------------------------------

Do not duplicate sensitive evidence unnecessarily. Use secure attachment
references.

### 21.2 `moderation_cases`

Groups one or more reports that relate to the same target or
investigation.

  --------------------------------------------------------------------------
  Field                   Suggested type          Notes
  ----------------------- ----------------------- --------------------------
  `id`                    UUID                    Primary key

  `scope_type`            ENUM                    PLATFORM or COMMUNITY

  `community_id`          UUID nullable           Required for community
                                                  scope

  `target_type`           VARCHAR                 Target object type

  `target_id`             UUID                    Main target

  `target_author_id`      UUID nullable           Target author

  `status`                VARCHAR                 Workflow status

  `priority`              VARCHAR                 LOW/MEDIUM/HIGH/CRITICAL

  `assigned_to`           UUID nullable           Moderator user ID

  `assigned_role_scope`   VARCHAR                 Platform or community
                                                  assignment

  `linked_report_count`   INTEGER                 Derived/cache; source
                                                  remains reports

  `policy_code`           VARCHAR nullable        Policy/rule considered

  `decision_code`         VARCHAR nullable        Final outcome

  `created_at`            TIMESTAMP               Created time

  `updated_at`            TIMESTAMP               Updated time

  `resolved_at`           TIMESTAMP nullable      Resolution time

  `closed_at`             TIMESTAMP nullable      Closure time
  --------------------------------------------------------------------------

### 21.3 `moderation_actions`

Stores each action applied to content or an account.

  -----------------------------------------------------------------------
  Field                   Suggested type          Notes
  ----------------------- ----------------------- -----------------------
  `id`                    UUID                    Primary key

  `case_id`               UUID                    Related case

  `actor_id`              UUID                    Admin/moderator

  `action_scope`          VARCHAR                 COMMUNITY or PLATFORM

  `action_type`           VARCHAR                 HIDE, REMOVE, WARN,
                                                  RESTRICT, SUSPEND, etc.

  `target_type`           VARCHAR                 POST, COMMENT, USER,
                                                  MEMBERSHIP

  `target_id`             UUID                    Affected object

  `duration_seconds`      BIGINT nullable         For temporary action

  `reason_code`           VARCHAR                 Policy/rule basis

  `public_message`        TEXT nullable           User-facing explanation

  `internal_note`         TEXT nullable           Restricted internal
                                                  note

  `created_at`            TIMESTAMP               Action time

  `expires_at`            TIMESTAMP nullable      Expiry, if temporary

  `reversed_at`           TIMESTAMP nullable      Reversal time

  `reversed_by`           UUID nullable           Actor who reversed
                                                  action
  -----------------------------------------------------------------------

Actions should be append-only where possible. Reversal should create a
new record rather than deleting the original action.

### 21.4 `moderation_case_events`

Stores case timeline events: - Report linked. - Case created. - Priority
changed. - Assigned or reassigned. - Status changed. - Note added. -
Escalated. - Evidence added. - Decision made. - Action applied. - Appeal
received. - Case reopened or closed.

Suggested fields: `id`, `case_id`, `actor_id`, `event_type`,
`old_value`, `new_value`, `metadata_json`, `created_at`.

### 21.5 `moderation_appeals`

  Field               Suggested type       Notes
  ------------------- -------------------- -----------------------------------
  `id`                UUID                 Primary key
  `case_id`           UUID                 Original case
  `appellant_id`      UUID                 User appealing
  `appeal_reason`     TEXT                 Explanation
  `status`            VARCHAR              PENDING/IN_REVIEW/UPHELD/REVERSED
  `reviewer_id`       UUID nullable        Prefer independent reviewer
  `decision_reason`   TEXT nullable        Appeal decision
  `created_at`        TIMESTAMP            Submitted time
  `resolved_at`       TIMESTAMP nullable   Decision time

### 21.6 `community_moderator_roles`

Maps users to community-scoped roles.

Suggested fields: - `id` - `community_id` - `user_id` - `role`
(`COMMUNITY_ADMIN`, `COMMUNITY_MODERATOR`) - `granted_by` -
`granted_at` - `revoked_at` - `is_active`

Enforce uniqueness for an active role assignment per community/user/role
as appropriate.

### 21.7 `moderation_evidence`

Stores references to evidence securely.

Suggested fields: - `id` - `case_id` - `uploaded_by` - `storage_key` -
`mime_type` - `file_size` - `checksum` - `evidence_type` -
`access_scope` - `created_at` - `retention_until`

Use private object storage, short-lived signed URLs, malware scanning,
and strict authorization. Do not put public evidence URLs in the
database.

### 21.8 `policy_rules`

Stores versioned platform and community policy references.

Suggested fields: - `id` - `scope_type` (`PLATFORM` or `COMMUNITY`) -
`community_id` nullable - `rule_code` - `title` - `description` -
`version` - `is_active` - `created_at` - `updated_at`

A decision should retain the policy code/version used at decision time.

## 22. Important database constraints and indexes

-   Index `reports(target_type, target_id, created_at)`.
-   Index `reports(community_id, status, created_at)`.
-   Index `moderation_cases(scope_type, status, priority, created_at)`.
-   Index `moderation_cases(assigned_to, status)`.
-   Index `moderation_cases(community_id, status, priority)`.
-   Index `moderation_actions(case_id, created_at)`.
-   Index `moderation_case_events(case_id, created_at)`.
-   Add foreign keys where appropriate.
-   Validate that `scope_type = COMMUNITY` requires a valid
    `community_id`.
-   Validate that `scope_type = PLATFORM` does not accidentally inherit
    a community moderator assignment.
-   Use transactions when creating a report and its case/link.
-   Prevent duplicate active cases for the same target and scope where
    the product's grouping rules require it.
-   Preserve each individual report even when grouped into one case.

------------------------------------------------------------------------

# Part G --- API Design

## 23. User-facing report APIs

Example REST endpoints; adapt route naming to the existing backend.

  -------------------------------------------------------------------------------------
  Method                  Endpoint                              Purpose
  ----------------------- ------------------------------------- -----------------------
  `GET`                   `/api/report-reasons`                 Get active report
                                                                reasons

  `POST`                  `/api/reports`                        Submit a report

  `GET`                   `/api/reports/me`                     List current user's
                                                                reports, if enabled

  `GET`                   `/api/reports/:id/status`             View limited public
                                                                status, if enabled

  `POST`                  `/api/moderation-cases/:id/appeals`   Submit appeal, if
                                                                eligible
  -------------------------------------------------------------------------------------

Example request:

``` json
{
  "targetType": "POST",
  "targetId": "target-uuid",
  "reasonCode": "HARASSMENT",
  "description": "This post targets and repeatedly harasses a person."
}
```

The backend derives the target author, community, and queue scope. The
client must not be allowed to choose `assigned_to`, `priority`,
`status`, or `action_type`.

## 24. Platform moderation APIs

  --------------------------------------------------------------------------------------------
  Method                  Endpoint                                     Purpose
  ----------------------- -------------------------------------------- -----------------------
  `GET`                   `/api/admin/moderation/cases`                List platform cases

  `GET`                   `/api/admin/moderation/cases/:id`            Case detail

  `PATCH`                 `/api/admin/moderation/cases/:id/assign`     Assign/reassign

  `PATCH`                 `/api/admin/moderation/cases/:id/status`     Valid status transition

  `PATCH`                 `/api/admin/moderation/cases/:id/priority`   Update priority

  `POST`                  `/api/admin/moderation/cases/:id/notes`      Add internal note

  `POST`                  `/api/admin/moderation/cases/:id/actions`    Apply
                                                                       platform-authorized
                                                                       action

  `POST`                  `/api/admin/moderation/cases/:id/escalate`   Escalate case

  `GET`                   `/api/admin/moderation/analytics`            Moderation metrics

  `GET`                   `/api/admin/moderation/audit-logs`           Authorized audit search
  --------------------------------------------------------------------------------------------

## 25. Community moderation APIs

  -------------------------------------------------------------------------------------------------------------------
  Method                  Endpoint                                                            Purpose
  ----------------------- ------------------------------------------------------------------- -----------------------
  `GET`                   `/api/communities/:communityId/moderation/cases`                    List cases for
                                                                                              authorized community

  `GET`                   `/api/communities/:communityId/moderation/cases/:caseId`            Case detail

  `PATCH`                 `/api/communities/:communityId/moderation/cases/:caseId/assign`     Assign to community
                                                                                              moderator

  `PATCH`                 `/api/communities/:communityId/moderation/cases/:caseId/status`     Update status

  `POST`                  `/api/communities/:communityId/moderation/cases/:caseId/notes`      Add community internal
                                                                                              note

  `POST`                  `/api/communities/:communityId/moderation/cases/:caseId/actions`    Apply community-scoped
                                                                                              action

  `POST`                  `/api/communities/:communityId/moderation/cases/:caseId/escalate`   Escalate to platform

  `GET`                   `/api/communities/:communityId/moderation/analytics`                Community moderation
                                                                                              metrics
  -------------------------------------------------------------------------------------------------------------------

Every endpoint must verify: 1. Authenticated session. 2. Active role. 3.
Correct community membership/role assignment. 4. Case belongs to the
requested community. 5. Action is permitted for that role and scope. 6.
Requested status transition is valid. 7. Target is still eligible for
the requested action.

Do not rely only on the `communityId` in the URL.

## 26. Example API response

``` json
{
  "caseId": "case-uuid",
  "scopeType": "COMMUNITY",
  "communityId": "community-uuid",
  "target": {
    "type": "POST",
    "id": "post-uuid"
  },
  "status": "UNDER_REVIEW",
  "priority": "MEDIUM",
  "linkedReportCount": 3,
  "assignedTo": "moderator-uuid",
  "createdAt": "2026-01-01T10:00:00Z"
}
```

Return only fields the requesting role is allowed to see. Never return
private reporter identity or internal notes in public report-status
APIs.

------------------------------------------------------------------------

# Part H --- Admin UI / UX

## 27. Platform Admin sidebar

Suggested navigation: - Overview - User Management - Post / Content
Management - Report Management - Moderation Queue - Appeals - Moderation
History - Community Oversight - Moderator Management - Analytics -
Policy & Report Reasons - Audit Logs - Settings

### 27.1 Platform report list columns

-   Case ID
-   Target type
-   Content preview
-   Author
-   Reason/category
-   Linked report count
-   Priority
-   Status
-   Assigned moderator
-   Created time / age
-   Action menu

### 27.2 Platform dashboard metrics

-   Total reports in selected period.
-   New / pending cases.
-   Critical and high-priority cases.
-   Cases breaching SLA.
-   Average first-review time.
-   Average resolution time.
-   Resolved with action.
-   Resolved with no violation.
-   Appeals received and appeal reversal rate.
-   Reports by category and content type.
-   Repeat confirmed violators.
-   Moderator workload and quality indicators.

Avoid using raw number of removed posts as the only performance metric.
That can incentivize excessive enforcement.

## 28. Community Admin sidebar

Suggested navigation: - Community Overview - Community Posts - Members -
Report Management - Moderation Queue - Community Rules - Moderator
Team - Community Appeals / Reconsideration - Moderation History -
Community Analytics - Community Settings

### 28.1 Community dashboard metrics

-   Open community reports.
-   Unassigned reports.
-   High-priority cases.
-   Average time to first review.
-   Community actions by type.
-   Community rule violations by category.
-   Reopened and appealed decisions.
-   Moderator workload.
-   Cases escalated to Platform Moderation.

Community Admins should see only their community's metrics. Platform
Admins may see cross-community aggregates.

## 29. UI design guidance

The platform has previously explored a black, white, and red visual
identity. If that remains the chosen design direction: - Use black/dark
neutral tones for navigation and structure. - Use white/light surfaces
for readable content. - Use gray for secondary information and
hierarchy. - Reserve red for critical severity, destructive actions,
urgent alerts, and important attention states. - Do not make every
report card red. - Use explicit labels and icons in addition to color. -
Make destructive actions require confirmation. - Show the action scope
before confirmation, e.g. "Remove from this community" versus "Remove
from the platform". - Provide responsive layouts for desktop and
mobile. - Support accessible contrast, keyboard navigation, and screen
readers.

------------------------------------------------------------------------

# Part I --- Notifications and User Communication

## 30. Reporter notifications

Possible notifications: - Report received. - Report is under review
(optional). - Report review completed (optional). - Action taken, where
disclosure is allowed. - No violation found, where disclosure is
allowed. - Appeal outcome, if the reporter is an eligible appellant.

Do not disclose private moderator notes, reporter identity, security
signals, or unnecessary details about another user's account.

## 31. Reported user notifications

When an enforcement action is taken, notify the affected user with: -
What content or behavior was actioned. - What rule or policy was
applied. - What action was taken. - Duration, if temporary. - Effective
date/time. - Whether the action affects a community only or the whole
platform. - How to appeal, if an appeal is available.

Avoid telling the reported user who submitted the report.

## 32. Moderator notifications

Notify assigned moderators about: - New assignment. - Reassignment. -
Priority increase. - SLA approaching or breached. - New evidence. -
Appeal received. - Escalation response. - Case reopened.

------------------------------------------------------------------------

# Part J --- Appeals, Conflicts and Fairness

## 33. Appeal process

1.  User receives an enforcement notice.
2.  Notice includes an appeal option if the action is appealable.
3.  User submits an appeal reason and optional evidence.
4.  System creates an appeal record linked to the original case.
5.  Appeal is assigned to an authorized reviewer.
6.  Where feasible, the appeal reviewer should not be the original
    decision-maker.
7.  Reviewer examines the original content, policy version, decision,
    and new evidence.
8.  Reviewer upholds, modifies, or reverses the action.
9.  System records the appeal decision and notifies the user.
10. Any reversal creates a new action/event; it does not erase the
    original decision history.

For community-only actions, the first appeal may be handled by the
Community Admin or a different community moderator. If the Community
Admin is involved in the original decision, or the appeal concerns
platform-wide policy, route it to Platform Moderation.

## 34. Conflict of interest

-   A moderator must not decide a case where they are the reporter,
    reported person, target author, or have another material conflict.
-   If a community admin is reported, route the case to another
    authorized community admin or Platform Moderation.
-   If the whole community moderation team is implicated, bypass that
    team and route directly to Platform Moderation.
-   Record conflict declarations and reassignment reasons.

## 35. Reporter abuse and retaliation

-   Rate-limit repeated reports.
-   Detect suspicious coordinated reporting.
-   Do not automatically punish reporters for good-faith reports that
    are not upheld.
-   Take action against demonstrably malicious or abusive reporting only
    under a clear policy and with review.
-   Do not reveal reporter identity to the reported user or community
    moderators by default.
-   Protect users from retaliation and targeted harassment after
    reporting.

------------------------------------------------------------------------

# Part K --- Security, Privacy and Audit

## 36. Authorization and isolation

-   Use server-side role-based access control (RBAC).
-   Use community-scoped authorization for every community endpoint.
-   Enforce object-level access checks on cases, reports, content,
    evidence, and actions.
-   Prevent insecure direct object reference (IDOR) attacks.
-   Apply least-privilege access.
-   Require stronger authentication for sensitive admin operations where
    supported.
-   Log privileged access to sensitive cases.

## 37. Evidence security

-   Store evidence in private storage.
-   Use signed, short-lived access URLs.
-   Validate file type, size, and malware risk.
-   Restrict access to assigned and authorized reviewers.
-   Avoid copying illegal or highly sensitive material unless required
    by a safe, legally reviewed process.
-   Define retention and deletion schedules.
-   Preserve chain-of-custody metadata where required.
-   Do not expose evidence attachments through public post URLs.

## 38. Audit log requirements

For every moderation event, store: - Actor ID and role at action time. -
Scope (platform or community). - Community ID, if applicable. - Case ID
and target reference. - Event/action type. - Previous and new
status/value. - Policy/rule code and version. - Reason and internal note
reference. - Timestamp. - Request/correlation ID where available. -
Reversal or appeal linkage.

Audit logs must be append-only or protected against ordinary
administrator modification. A privileged correction should itself create
a new auditable event.

## 39. Privacy and retention

-   Collect only information needed to review the report.
-   Keep reporter identity restricted.
-   Define retention periods for reports, evidence, notes, and audit
    records.
-   Apply deletion/anonymization rules consistent with legal
    requirements and safety needs.
-   Restrict exports of moderation data.
-   Record who accessed sensitive evidence.
-   Do not expose moderation analytics that identify reporters or
    vulnerable users unnecessarily.

------------------------------------------------------------------------

# Part L --- Automated Assistance

## 40. Optional automated moderation support

The platform may later add: - Spam detection. - Duplicate report
grouping. - Text classification. - Image/video safety classification. -
URL and scam detection. - Language detection. - Risk-based queue
prioritization. - Similar past-case recommendations.

Automation must: - Be treated as decision support unless a clearly
defined policy permits automated enforcement. - Show moderators why a
case was flagged where feasible. - Avoid using report count as the only
decision factor. - Be monitored for false positives and bias. - Allow
human review and appeal. - Log model/version and relevant decision
signals when automation materially affects a case. - Have a safe
fallback if the model or service is unavailable.

------------------------------------------------------------------------

# Part M --- Edge Cases and Expected Behavior

## 41. Edge-case handling

  -----------------------------------------------------------------------
  Scenario                            Expected behavior
  ----------------------------------- -----------------------------------
  Target post was deleted before      Keep report/case; show unavailable
  review                              state and retained permitted
                                      snapshot/reference

  Target author deleted account       Preserve necessary case metadata
                                      under retention policy

  Same target reported many times     Link reports to a case; preserve
                                      each report

  Same user reports repeatedly        Apply rate limits and abuse
                                      detection

  Community becomes inactive          Route to Platform Moderation or a
                                      designated fallback queue

  Community has no active moderators  Route to Platform Moderation or
                                      central fallback

  Community admin is reported         Bypass conflicted admin

  Moderator is reported               Assign to an independent
                                      moderator/admin

  Community post is also a            Community may take local action;
  platform-policy violation           escalate platform case

  Post is shared in multiple places   Treat each content object/ownership
                                      context correctly; link related
                                      cases if useful

  Comment is reported                 Derive ownership and context from
                                      its parent post

  Content changes after report        Preserve relevant version/snapshot
                                      where lawful and technically
                                      feasible

  Reported content is already         Show prior action and avoid
  actioned                            duplicate destructive action

  Appeal is submitted after case      Create linked appeal/reopen
  closure                             according to policy

  Moderator loses role during review  Revoke access; reassign case

  User is banned while a report is    Keep case history; decide whether
  pending                             review is still necessary

  API receives invalid community ID   Reject; derive scope from the
                                      target object

  Platform Admin overrides community  Record override reason and notify
  action                              affected community admin where
                                      appropriate

  Multiple reports have different     Preserve each reason; moderator
  categories                          assesses the actual content and
                                      applicable policies
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# Part N --- Analytics and Quality Monitoring

## 42. Platform-level analytics

Recommended measures: - Total reports by time period. - Reports by
category and target type. - Platform versus community queue volume. -
Pending cases by age. - First-response and resolution time. - SLA
compliance by priority. - Action outcomes and appeal reversals. - Repeat
confirmed violations. - Community escalation volume. - Moderator
workload distribution. - False-positive indicators and quality-review
outcomes. - Report abuse patterns.

## 43. Community-level analytics

Community Admins may see: - Reports within their community. - Open and
overdue cases. - Category breakdown. - Community action outcomes. -
Appeal and reversal trends. - Moderator assignment and workload. -
Escalations to the platform team.

Community analytics must not reveal other communities' private
moderation information.

## 44. Quality safeguards

-   Sample decisions for quality review.
-   Compare similar cases for consistency.
-   Monitor appeal reversal rates, but do not use them as the sole
    measure of moderator performance.
-   Review over-enforcement and under-enforcement patterns.
-   Provide moderator training and policy updates.
-   Keep a versioned policy history.
-   Make queue metrics transparent to authorized supervisors.

------------------------------------------------------------------------

# Part O --- Implementation Plan

## 45. Recommended development phases

### Phase 1 --- Core reporting

-   Report button and form.
-   Configurable report categories.
-   Report creation API.
-   Backend ownership detection.
-   Normal/global and community routing.
-   Basic report and case tables.
-   Basic user confirmation.

### Phase 2 --- Platform moderation

-   Platform Admin/Moderator queue.
-   Case detail page.
-   Assignment and status workflow.
-   Platform content actions.
-   Internal notes.
-   Audit events.

### Phase 3 --- Community moderation

-   Community Admin/Moderator roles.
-   Community-specific queues.
-   Community-scoped actions.
-   Community rules mapping.
-   Community escalation to Platform Moderation.
-   Community-level analytics.

### Phase 4 --- Appeals and notifications

-   Enforcement notifications.
-   Appeal submission and review.
-   Independent reviewer workflow.
-   Reporter status visibility, if required.

### Phase 5 --- Advanced monitoring

-   SLA monitoring.
-   Queue dashboards.
-   Duplicate report grouping.
-   Abuse detection.
-   Automated triage support.
-   Quality review tools.

## 46. Minimum viable release

A first production-ready version should include at least: -
Authenticated report submission. - Normal/global versus community
ownership detection. - Correct queue routing. - Platform and community
role authorization. - Report and case status tracking. - Review decision
with a reason. - Community-scoped and platform-scoped action
separation. - Escalation to Platform Moderation. - Audit log. - Basic
reporter and reported-user notifications. - Rate limiting and duplicate
handling. - Basic admin queue filters.

Do not launch community moderation with unrestricted community-admin
permissions. Scope enforcement and audit logging are foundational
requirements.

------------------------------------------------------------------------

# Part P --- Acceptance Criteria / Test Scenarios

## 47. Functional acceptance criteria

### Reporting

-   [ ] A user can report an eligible normal/global post.
-   [ ] A user can report an eligible community post.
-   [ ] A user can report a comment and the backend derives the parent
    post's scope.
-   [ ] Invalid or deleted targets are handled safely.
-   [ ] A report cannot be submitted with a forged owner or community
    ID.
-   [ ] A report confirmation is displayed after successful submission.
-   [ ] Rate limits prevent abusive report flooding.

### Normal/global moderation

-   [ ] A normal/global report appears in the platform queue.
-   [ ] A community moderator cannot access the global queue.
-   [ ] An authorized platform moderator can inspect the case.
-   [ ] The moderator can record a decision and reason.
-   [ ] Only authorized platform roles can apply platform-wide account
    actions.
-   [ ] Every action is auditable.

### Community moderation

-   [ ] A community report appears in the correct community queue.
-   [ ] Community A moderators cannot access Community B cases.
-   [ ] A community admin can assign a case to an authorized community
    moderator.
-   [ ] A community moderator can take only permitted community-scoped
    actions.
-   [ ] Removing a post from a community does not unintentionally delete
    its global copy.
-   [ ] A community admin cannot suspend a platform account without a
    separate platform permission.
-   [ ] A community case can be escalated to Platform Moderation.
-   [ ] A conflicted community admin cannot decide a report against
    themselves.

### Status, appeal and audit

-   [ ] Invalid status transitions are rejected.
-   [ ] Every status change records actor, time, old value, and new
    value.
-   [ ] A user can appeal eligible enforcement.
-   [ ] Appeal decisions are linked to the original case.
-   [ ] Reversals do not erase original actions.
-   [ ] Reporter identity and internal notes are not exposed through
    public APIs.

## 48. Security test scenarios

-   [ ] Change `communityId` in the URL and verify access is denied.
-   [ ] Guess another case ID and verify object-level access is denied.
-   [ ] Call platform action APIs using a community admin token and
    verify denial.
-   [ ] Call community action APIs for a community where the user has no
    role and verify denial.
-   [ ] Attempt to change `assigned_to`, `priority`, or `status` in
    report creation payload and verify the server ignores/rejects
    unauthorized fields.
-   [ ] Attempt to access evidence using an expired or unauthorized URL
    and verify denial.
-   [ ] Verify reporter identity is not returned to the reported user.
-   [ ] Verify audit records cannot be edited through ordinary admin
    APIs.

------------------------------------------------------------------------

# Part Q --- Key Product Decisions to Confirm Before Development

The following are configurable product decisions, not assumptions:

1.  Can users report profiles, comments, messages, and community
    resources, or only posts?
2.  Can a reporter see the status of their submitted report?
3.  Can community moderators issue warnings, or only remove/hide
    content?
4.  Can a community admin temporarily restrict a member from posting in
    that community?
5.  Who reviews appeals against community-level decisions?
6.  Which actions require Platform Admin approval?
7.  What are the actual SLA targets and moderation coverage hours?
8.  Which report categories are supported at launch?
9.  What evidence file types and limits are allowed?
10. What retention period applies to reports and evidence?
11. Does the platform support automated content detection at launch or
    only human review?
12. Are community rules versioned and accepted by members?

------------------------------------------------------------------------

# 49. Final recommended architecture

Use a shared reporting foundation with separate moderation scopes:

``` text
                         USER
                           |
                    Submit a Report
                           |
                 Backend validates target
                           |
               Derive content ownership
                           |
              +------------+------------+
              |                         |
       community_id is null      community_id exists
              |                         |
      PLATFORM MODERATION       COMMUNITY MODERATION
              |                         |
      Platform Moderator        Community Moderator
              |                         |
      Platform Admin            Community Admin
              |                         |
              |                Community-scoped action
              |                         |
              |                 Need platform review?
              |                         |
              |                  +------+------+
              |                  |             |
              |                  No            Yes
              |                  |             |
              |               Resolve     Platform escalation
              |                                |
              +------------------------> Platform review
                                               |
                                      Final platform decision
                                               |
                                  Notifications + Audit Trail
```

### Architectural rules

1.  Use one shared `reports` model and one shared `moderation_cases`
    workflow.
2.  Store an explicit moderation scope: `PLATFORM` or `COMMUNITY`.
3.  Derive scope from trusted content ownership on the backend.
4.  Use separate authorization checks for platform and community
    actions.
5.  Keep community actions limited to that community.
6.  Keep platform-wide actions under platform authority.
7.  Preserve reports, decisions, events, and reversals as an auditable
    history.
8.  Support escalation without requiring users to submit a second
    report.
9.  Keep report volume separate from proof of a policy violation.
10. Treat appeals and conflict-of-interest handling as part of the
    moderation lifecycle, not as optional afterthoughts.

**Core design principle:** Community Admins manage community-level rules
and content. Platform Admins manage platform-wide safety and policy. A
shared report system connects the two without merging their authority.
