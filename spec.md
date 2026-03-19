# Kazutube

## Current State
- Upload form has fields: Title, Description, Video URL (YouTube embed), Thumbnail URL, Duration, Tags, Short toggle
- VideoPlayerPage uses an `<iframe>` YouTube embed player
- Video and thumbnail URLs are stored as text in localStorage
- Blob storage component is already integrated (StorageClient.ts, config.ts)

## Requested Changes (Diff)

### Add
- Video file input (local device file picker) in upload form
- Thumbnail image file input (local device file picker) in upload form
- Auto-detection of video duration using HTML5 HTMLVideoElement API
- Short validation: if Short toggle is enabled and duration > 60 seconds, show inline error and prevent upload
- Upload progress state while files are being uploaded to blob storage
- HTML5 `<video controls>` player in VideoPlayerPage

### Modify
- UploadPage: remove Video URL, Thumbnail URL, Duration, Tags fields; replace with file inputs that upload to blob storage and resolve to a URL
- VideoPlayerPage: replace `<iframe>` with `<video controls>` element using the stored videoUrl
- config.ts: export a standalone `createStorageClient()` helper so UploadPage can upload files directly
- Bump seed version in useStore.ts to `v6` to clear stale localStorage data

### Remove
- Video URL text input
- Thumbnail URL text input
- Duration text input
- Tags text input
- YouTube iframe embed in VideoPlayerPage

## Implementation Plan
1. Export `createStorageClient()` from config.ts
2. Rewrite UploadPage: file inputs for video/thumbnail, use StorageClient to upload, auto-detect duration, validate Short <= 60s
3. Rewrite VideoPlayerPage: replace iframe with `<video controls>` element
4. Bump seed version to v6 in useStore.ts
