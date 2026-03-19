import AccessControl "authorization/access-control";
import BlobStorageMixin "blob-storage/Mixin";
import AuthMixin "authorization/MixinAuthorization";

actor {
  let _accessControlState = AccessControl.initState();

  include BlobStorageMixin();
  include AuthMixin(_accessControlState);
};
