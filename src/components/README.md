# Base Components

This directory contains reusable base components organized by their purpose.

## Input Components

### Button
- Variants: primary, secondary, text, icon, action
- Features: loading state, active state, count display
- Used in: FeedPost, CommentCard, forms

### TextInput
- Features: error states, helper text, labels
- Used in: comment forms, reply forms

## Layout Components

### FeedPost
- Purpose: Display social media posts
- Uses: UserInfo, Button, CommentCard, TextInput
- Features: likes, comments, shares

### CommentCard
- Purpose: Display comments and nested replies
- Uses: UserInfo, Button, TextInput
- Features: nested replies, like functionality

### Divider
- Variants: horizontal, vertical
- Styles: solid, dashed, dotted
- Spacing: small, medium, large

### Container
- Purpose: Layout wrapper with consistent spacing
- Features: responsive widths, padding options
- Sizes: sm, md, lg, xl, full

## User Components

### Avatar
- Sizes: small, medium, large
- Features: image fallback with initials
- Used in: UserInfo, headers

### UserInfo
- Purpose: Display user metadata
- Uses: Avatar
- Features: username, timestamp, subtitle

## Usage Example

```tsx
<Container maxWidth="lg">
  <FeedPost
    post={post}
    user={user}
    currentUserId={currentUserId}
    onLike={handleLike}
    onComment={handleComment}
    onShare={handleShare}
  >
    <CommentCard
      comment={comment}
      currentUserId={currentUserId}
      onLike={handleLikeComment}
      onReply={handleReplyToComment}
    />
  </FeedPost>
  <Divider spacing="large" />
</Container>
