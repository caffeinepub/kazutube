# Kazutube

## Current State
- Owner seed data uses channelName "Kazutube Official", not @KazuyaXedit
- Demo users (user_002, user_003) and 8 sample videos exist in seed data
- Video player has Like + Comments, but no Share button or visible views counter in the action bar
- No subscribe system on channel or video player pages
- Subscriber count stored but no subscribe/unsubscribe action in store
- localStorage seed is only initialized once; old data persists for returning users

## Requested Changes (Diff)

### Add
- Subscribe system: subscribe/unsubscribe action in store
- Subscribe button on VideoPlayerPage (below video, near channel info)
- Subscribe button on ChannelPage
- Subscriber count displayed next to channel name everywhere
- Share button in video player action bar (copies URL / shows toast)
- Views counter displayed prominently in video player action bar
- Seed version key to force-reset localStorage when seed data changes

### Modify
- Owner seed: channelName → "@KazuyaXedit", name → "KazuyaXedit"
- Remove demo users (user_002, user_003) from seed
- Remove all 8 sample videos from seed (start with empty video list)
- Homepage title changed to reflect @KazuyaXedit channel
- Subscribe button style: red when not subscribed, gray (muted) when subscribed — YouTube style
- Navbar Upload button already present; ensure it navigates to upload page correctly

### Remove
- Sample users alex@example.com and maya@example.com from seed data
- All 8 hardcoded sample videos from seed data
- sampleComments seed array

## Implementation Plan
1. Update `useStore.ts`: bump seed version key to force re-init, update owner to @KazuyaXedit, remove demo users/videos, add `subscribe(channelOwnerId, subscriberId)` and `unsubscribe` actions, expose subscriptions map
2. Update `VideoPlayerPage.tsx`: add Share button (copy link + toast), show views counter in action bar, add Subscribe button below channel name
3. Update `ChannelPage.tsx`: add Subscribe button with subscriber count
4. Update `HomePage.tsx`: filter to only show @KazuyaXedit (owner) videos, update section heading
