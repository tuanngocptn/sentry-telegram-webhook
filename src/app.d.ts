export type HelloWorldResponseType = {
  message: string;
};

export type SentryInstallationType = {
  uuid: string;
};

export type SentryProjectType = {
  id: string;
  name: string;
  slug: string;
  platform: string;
};

export type SentryMetadataSdkType = {
  name: string;
  name_normalized: string;
};

export type SentryMetadataType = {
  value: string;
  type: string;
  filename: string;
  function: string;
  display_title_with_tree_label: boolean;
  in_app_frame_mix: string;
  sdk: SentryMetadataSdkType;
  initial_priority: number;
};

export type SentryRequestDataType = {
  issue: {
    id: string;
    shareId: string;
    shortId: string;
    title: string;
    culprit: string;
    permalink: string;
    logger: string;
    level: string;
    status: string;
    statusDetails: any;
    substatus: string;
    isPublic: boolean;
    platform: string;
    project: SentryProjectType;
    type: string;
    metadata: SentryMetadataType;
    numComments: number;
    assignedTo: string;
    isBookmarked: boolean;
    isSubscribed: boolean;
    subscriptionDetails: string;
    hasSeen: boolean;
    annotations: any;
    issueType: string;
    issueCategory: string;
    priority: string;
    priorityLockedAt: string;
    isUnhandled: boolean;
    count: string;
    userCount: number;
    firstSeen: string;
    lastSeen: string;
  };
};

export type SentryActorType = {
  type: string;
  id: string;
  name: string;
};

export type SentryRequestType = {
  action: string;
  installation: SentryInstallationType;
  data: SentryRequestDataType;
  actor: SentryActorType;
};

export type HookMessageDataType = {
  issueAction?: string;
  appName?: string;
  title?: string;
  errorPosition?: string;
  environment?: string;
  handled?: string;
  release?: string;
  dist?: string;
  user?: string;
  level?: string;
  mechanism?: string;
  device?: string;
  os?: string;
  detailLink?: string;
};
